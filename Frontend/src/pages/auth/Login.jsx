import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});

const DEMO_ACCOUNTS = [
  { label: 'Admin Demo',    email: 'admin@worksync.com',    password: 'admin123' },
  { label: 'Employee Demo', email: 'employee@worksync.com', password: 'emp123' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controls if login form modal is visible

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/employee');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center">

      {/* Top Navbar */}
      <div className="absolute top-0 left-0 w-full p-6 lg:px-16 flex items-center justify-between z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-accent">
            <span className="text-white font-bold text-xs">W</span>
          </div>
          <span className="text-warm-900 font-bold text-lg tracking-tight">WorkSync</span>
        </div>

        {/* Small/Medium Login Button */}
        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-2 rounded-full bg-warm-900 hover:bg-warm-800 text-white text-sm font-semibold transition-colors shadow-pill"
        >
          Login
        </button>
      </div>

      {/* Animated red blob — Auraform style */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] pointer-events-none" style={{ animation: 'blobSpin 25s linear infinite' }}>
        <div className="w-full h-full rounded-full" style={{
          background: 'radial-gradient(circle at 35% 35%, #ff4070 0%, #dc002d 40%, #8b001a 70%, #4b0010 100%)',
          opacity: 0.95,
        }} />
      </div>
      <div className="absolute bottom-[-10%] right-[5%] w-[600px] h-[600px] pointer-events-none" style={{ animation: 'blobSpin 18s linear infinite reverse' }}>
        <div className="w-full h-full rounded-full" style={{
          background: 'radial-gradient(circle at 60% 60%, #ff6b8a 0%, #ff2052 50%, #a30022 100%)',
          opacity: 0.6,
          filter: 'blur(2px)',
        }} />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 lg:px-16 flex flex-col justify-center min-h-[70vh]">
        
        <h1 className="text-5xl lg:text-7xl font-bold text-warm-900 leading-[1.1] mb-6 max-w-2xl">
          HR Management<br />
          <span className="gradient-text">That Works For You</span>
        </h1>
        <p className="text-warm-500 text-lg lg:text-xl leading-relaxed max-w-lg mb-10">
          Streamline attendance, payroll, and employee management — all in one powerful platform.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 mb-16">
          {['Attendance Tracking', 'Payroll Management', 'Leave Approval', 'Employee Profiles'].map(f => (
            <span key={f} className="px-4 py-2 rounded-full bg-warm-50 border border-warm-200 text-warm-600 text-sm font-medium">
              {f}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
          {[['10+', 'Modules'], ['99.9%', 'Uptime'], ['500+', 'Teams']].map(([n, l]) => (
            <div key={l} className="card p-6 text-center bg-white/80 backdrop-blur-sm border border-warm-100 shadow-card">
              <p className="text-warm-900 font-bold text-3xl mb-1">{n}</p>
              <p className="text-warm-500 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Login Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-warm-900/40 backdrop-blur-sm p-4 animate-fade-in">
          
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-card-lg animate-slideUp">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-warm-50 text-warm-400 hover:text-warm-900 hover:bg-warm-100 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-3xl font-bold text-warm-900 mb-1 mt-2">Welcome back</h2>
            <p className="text-warm-500 mb-8 text-sm">Sign in to your workspace</p>

            {/* Demo quick-fill */}
            <div className="mb-6 p-3.5 rounded-2xl bg-warm-50/50 border border-warm-200">
              <p className="text-warm-600 text-xs font-semibold mb-2.5 flex items-center gap-1.5">
                <Zap size={12} className="text-primary-600" /> Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button key={acc.label} type="button" onClick={() => { setValue('email', acc.email); setValue('password', acc.password); }}
                    className="py-2.5 px-3 rounded-xl bg-white border border-warm-200 text-warm-700 hover:text-warm-900 hover:border-warm-400 shadow-sm text-xs font-semibold transition-all text-center">
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="label-text">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none" />
                  <input type="email" placeholder="you@worksync.com" {...register('email')}
                    className={`input-field pl-10 ${errors.email ? 'border-primary-400' : ''}`} />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-primary-600 font-medium">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="label-text">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none" />
                  <input type={showPw ? 'text' : 'password'} placeholder="••••••••" {...register('password')}
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-primary-400' : ''}`} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-700">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-primary-600 font-medium">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-4 shadow-accent-lg text-base">
                {loading
                  ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><span>Sign In</span> <ArrowRight size={18} /></>
                }
              </button>
            </form>

            <p className="mt-6 text-center text-warm-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-warm-900 font-semibold hover:text-primary-600 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
