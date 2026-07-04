import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, FileText, Send } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { leaveAPI } from '../../api/leaves';
import { useAuth } from '../../hooks/useAuth';
import { getDaysCount } from '../../utils/formatters';
import toast from 'react-hot-toast';

const LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'];

const schema = z.object({
  type:   z.string().min(1, 'Select leave type'),
  from:   z.string().min(1, 'Start date required'),
  to:     z.string().min(1, 'End date required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
}).refine(d => !d.from || !d.to || new Date(d.to) >= new Date(d.from), {
  message: 'End date must be after start date', path: ['to'],
});

const ApplyLeave = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const fromDate = watch('from');
  const toDate   = watch('to');
  const days = fromDate && toDate && new Date(toDate) >= new Date(fromDate) ? getDaysCount(fromDate, toDate) : 0;

  useState(() => { leaveAPI.getBalance().then(setBalance); }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try { await leaveAPI.apply({ ...data, days }, user); toast.success('Leave application submitted!'); reset(); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">Leaves</p>
        <h1 className="page-title">Apply for Leave</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form */}
        <div className="lg:col-span-2 card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-text">Leave Type</label>
              <select {...register('type')} className={`input-field ${errors.type ? 'border-primary-400' : ''}`}>
                <option value="">Select leave type</option>
                {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.type && <p className="mt-1.5 text-xs text-primary-600 font-medium">{errors.type.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">From Date</label>
                <input type="date" {...register('from')} className={`input-field ${errors.from ? 'border-primary-400' : ''}`} />
                {errors.from && <p className="mt-1.5 text-xs text-primary-600 font-medium">{errors.from.message}</p>}
              </div>
              <div>
                <label className="label-text">To Date</label>
                <input type="date" {...register('to')} className={`input-field ${errors.to ? 'border-primary-400' : ''}`} />
                {errors.to && <p className="mt-1.5 text-xs text-primary-600 font-medium">{errors.to.message}</p>}
              </div>
            </div>

            {days > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 border border-primary-200 text-sm">
                <CalendarDays size={15} className="text-primary-600" />
                <span className="text-primary-700 font-semibold">{days} working day{days !== 1 ? 's' : ''} requested</span>
              </div>
            )}

            <div>
              <label className="label-text">Reason</label>
              <div className="relative">
                <FileText size={14} className="absolute left-3.5 top-3 text-warm-400 pointer-events-none" />
                <textarea {...register('reason')} rows={4} placeholder="Briefly describe your reason for leave..."
                  className={`input-field pl-10 resize-none ${errors.reason ? 'border-primary-400' : ''}`} />
              </div>
              {errors.reason && <p className="mt-1.5 text-xs text-primary-600 font-medium">{errors.reason.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={15} /> Submit Application</>}
            </button>
          </form>
        </div>

        {/* Balance Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="section-title mb-4">Leave Balance</h3>
            {balance ? (
              <div className="space-y-4">
                {Object.entries(balance).map(([type, bal]) => (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-warm-600 capitalize font-medium">{type}</span>
                      <span className="text-warm-900 font-bold">{bal.remaining}/{bal.total}</span>
                    </div>
                    <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                        style={{ width: `${(bal.remaining / bal.total) * 100}%` }} />
                    </div>
                    <p className="text-warm-400 text-xs mt-0.5">{bal.used} used</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-warm-100 rounded-xl animate-pulse" />)}</div>
            )}
          </div>

          <div className="card p-4 border-l-4 border-l-amber-400">
            <p className="text-warm-800 text-sm font-bold mb-2">📋 Leave Policy</p>
            <ul className="text-warm-500 text-xs space-y-1.5">
              <li>• Apply at least 3 days in advance for planned leaves</li>
              <li>• Sick leaves require medical certificate for 3+ days</li>
              <li>• Half-day leaves are subject to manager approval</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplyLeave;
