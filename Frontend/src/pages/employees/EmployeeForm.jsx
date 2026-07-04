import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { employeeAPI } from '../../api/employees';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Engineering','Design','Sales','Marketing','Finance','Management','HR','Operations'];
const GENDERS     = ['Male','Female','Other','Prefer not to say'];

const schema = z.object({
  name:       z.string().min(2, 'Name is required'),
  email:      z.string().email('Valid email required'),
  phone:      z.string().min(7, 'Valid phone required'),
  gender:     z.string().min(1, 'Select gender'),
  department: z.string().min(1, 'Select department'),
  position:   z.string().min(2, 'Position is required'),
  salary:     z.coerce.number().min(1000, 'Enter a valid salary'),
  joinDate:   z.string().min(1, 'Join date required'),
  status:     z.enum(['active', 'inactive']),
});

const Field = ({ label, error, children }) => (
  <div>
    <label className="label-text">{label}</label>
    {children}
    {error && <p className="mt-1.5 text-xs text-primary-600 font-medium">{error}</p>}
  </div>
);

const EmployeeForm = () => {
  const { id } = useParams();
  const isEdit  = !!id;
  const navigate = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', joinDate: new Date().toISOString().split('T')[0] },
  });

  useEffect(() => {
    if (!isEdit) return;
    employeeAPI.getById(id)
      .then(emp => reset({ ...emp, salary: String(emp.salary) }))
      .catch(err => { toast.error(err.message); navigate('/employees'); })
      .finally(() => setFetching(false));
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) { await employeeAPI.update(id, data); toast.success('Employee updated'); }
      else        { await employeeAPI.create(data);     toast.success('Employee added'); }
      navigate('/employees');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  if (fetching) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-warm-500 hover:text-warm-900 text-sm mb-5 transition-colors font-medium">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="max-w-2xl">
        <div className="mb-6">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            {isEdit ? 'Update Record' : 'New Employee'}
          </p>
          <h1 className="page-title">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Field label="Full Name"         error={errors.name?.message}>
                <input type="text"   placeholder="Alex Johnson"      {...register('name')}       className={`input-field ${errors.name ? 'border-primary-400' : ''}`} />
              </Field>
              <Field label="Email"             error={errors.email?.message}>
                <input type="email"  placeholder="alex@company.com"  {...register('email')}      className={`input-field ${errors.email ? 'border-primary-400' : ''}`} />
              </Field>
              <Field label="Phone"             error={errors.phone?.message}>
                <input type="tel"    placeholder="+1 555-0100"        {...register('phone')}      className={`input-field ${errors.phone ? 'border-primary-400' : ''}`} />
              </Field>
              <Field label="Gender"            error={errors.gender?.message}>
                <select {...register('gender')} className={`input-field ${errors.gender ? 'border-primary-400' : ''}`}>
                  <option value="">Select gender</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Department"        error={errors.department?.message}>
                <select {...register('department')} className={`input-field ${errors.department ? 'border-primary-400' : ''}`}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Position / Job Title" error={errors.position?.message}>
                <input type="text"   placeholder="Software Engineer" {...register('position')}   className={`input-field ${errors.position ? 'border-primary-400' : ''}`} />
              </Field>
              <Field label="Annual Salary (USD)"  error={errors.salary?.message}>
                <input type="number" placeholder="75000"             {...register('salary')}     className={`input-field ${errors.salary ? 'border-primary-400' : ''}`} />
              </Field>
              <Field label="Join Date"         error={errors.joinDate?.message}>
                <input type="date"                                    {...register('joinDate')}   className={`input-field ${errors.joinDate ? 'border-primary-400' : ''}`} />
              </Field>
              <Field label="Status"            error={errors.status?.message}>
                <select {...register('status')} className={`input-field ${errors.status ? 'border-primary-400' : ''}`}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
            </div>

            <div className="flex gap-3 pt-2 border-t border-warm-100">
              <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : isEdit ? <><Save size={15} /> Save Changes</> : <><UserPlus size={15} /> Add Employee</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeForm;
