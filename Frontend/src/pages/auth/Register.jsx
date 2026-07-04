import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone, Briefcase, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  department: z.string().min(1, 'Select a department'),
  position: z.string().min(2, 'Enter your position'),
  role: z.enum(['employee', 'admin']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: "Passwords don't match", path: ['confirm'] });

const DEPARTMENTS = ['Engineering', 'Design', 'Sales', 'Marketing', 'Finance', 'Management', 'HR', 'Operations'];

const Register = () => {
  const { register: regAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'employee' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const { confirm, ...payload } = data;
    try {
      const user = await regAuth(payload);
      toast.success('Account created successfully!');
      navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/employee');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, icon: Icon, error, children }) => (
    <div>
      <label className="label-text">{label}</label>
      <div className="relative">
        {Icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none"><Icon size={15} /></div>}
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-primary-600 font-medium">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center p-6"
      style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(220,0,45,0.05), transparent)' }}>
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-accent">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-warm-900 font-bold text-xl tracking-tight">WorkSync</span>
          </div>
          <h1 className="text-3xl font-bold text-warm-900 mb-2">Create your account</h1>
          <p className="text-warm-500 text-sm">Fill in the details below to get started</p>
        </div>

        <div className="card p-6 shadow-card-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Full Name" icon={User} error={errors.name?.message}>
                <input type="text" placeholder="Alex Johnson" {...register('name')} className={`input-field pl-10 ${errors.name ? 'border-primary-400' : ''}`} />
              </Field>
              <Field label="Email Address" icon={Mail} error={errors.email?.message}>
                <input type="email" placeholder="alex@company.com" {...register('email')} className={`input-field pl-10 ${errors.email ? 'border-primary-400' : ''}`} />
              </Field>
              <Field label="Phone Number" icon={Phone} error={errors.phone?.message}>
                <input type="tel" placeholder="+1 555-0100" {...register('phone')} className={`input-field pl-10 ${errors.phone ? 'border-primary-400' : ''}`} />
              </Field>
              <Field label="Department" error={errors.department?.message}>
                <select {...register('department')} className={`input-field ${errors.department ? 'border-primary-400' : ''}`}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Position / Job Title" icon={Briefcase} error={errors.position?.message}>
                <input type="text" placeholder="Software Engineer" {...register('position')} className={`input-field pl-10 ${errors.position ? 'border-primary-400' : ''}`} />
              </Field>

              <div>
                <label className="label-text">Account Role</label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {['employee', 'admin'].map(role => (
                    <label key={role} className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl border border-warm-200 hover:border-warm-400 bg-white hover:bg-warm-50 transition-colors has-[:checked]:border-warm-900 has-[:checked]:bg-warm-50">
                      <input type="radio" value={role} {...register('role')} className="accent-warm-900" />
                      <span className="text-sm text-warm-700 capitalize font-medium">{role}</span>
                    </label>
                  ))}
                </div>
                {errors.role && <p className="mt-1.5 text-xs text-primary-600">{errors.role.message}</p>}
              </div>

              <Field label="Password" icon={Lock} error={errors.password?.message}>
                <input type="password" placeholder="••••••••" {...register('password')} className={`input-field pl-10 ${errors.password ? 'border-primary-400' : ''}`} />
              </Field>
              <Field label="Confirm Password" icon={Lock} error={errors.confirm?.message}>
                <input type="password" placeholder="••••••••" {...register('confirm')} className={`input-field pl-10 ${errors.confirm ? 'border-primary-400' : ''}`} />
              </Field>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><span>Create Account</span><ArrowRight size={16} /></>
              }
            </button>
          </form>
          <p className="mt-5 text-center text-warm-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-warm-900 font-semibold hover:text-primary-600 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
