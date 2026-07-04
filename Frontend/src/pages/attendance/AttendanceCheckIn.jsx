import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { LogIn, LogOut, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/Badge';
import { attendanceAPI } from '../../api/attendance';
import toast from 'react-hot-toast';

const AttendanceCheckIn = () => {
  const [status,        setStatus]        = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentTime,   setCurrentTime]   = useState(new Date());

  useEffect(() => {
    attendanceAPI.getTodayStatus().then(setStatus).finally(() => setLoading(false));
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try { const updated = await attendanceAPI.checkIn(); setStatus(updated); toast.success('Checked in! Have a great day 🎉'); }
    catch (err) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try { const updated = await attendanceAPI.checkOut(); setStatus(updated); toast.success('Checked out! See you tomorrow 👋'); }
    catch (err) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  const isCheckedIn  = status?.status === 'checked_in';
  const isCheckedOut = status?.status === 'checked_out';

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">Daily Tracking</p>
        <h1 className="page-title">Attendance Check-In</h1>
      </div>

      <div className="max-w-md mx-auto">
        {/* Clock */}
        <div className="card p-8 text-center mb-5 border-t-4 border-t-primary-500">
          <p className="text-warm-500 text-sm font-medium mb-2">{format(currentTime, 'EEEE, MMMM d, yyyy')}</p>
          <p className="text-6xl font-bold text-warm-900 font-mono tracking-tight">
            {format(currentTime, 'HH:mm')}
            <span className="text-3xl text-warm-300">:{format(currentTime, 'ss')}</span>
          </p>
        </div>

        {/* Status */}
        <div className="card p-5 mb-5">
          <h3 className="section-title mb-4">Today's Status</h3>
          {[
            { label: 'Status',    value: <StatusBadge status={status?.status || 'not_checked_in'} /> },
            { label: 'Check In',  value: status?.checkIn  ? <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-sm"><CheckCircle2 size={14} />{status.checkIn}</span>  : <span className="text-warm-300">—</span> },
            { label: 'Check Out', value: status?.checkOut ? <span className="flex items-center gap-1.5 text-sky-700 font-semibold text-sm"><CheckCircle2 size={14} />{status.checkOut}</span> : <span className="text-warm-300">—</span> },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-warm-100 last:border-0">
              <span className="text-warm-500 text-sm">{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {isCheckedOut ? (
          <div className="card p-6 text-center border-t-4 border-t-emerald-500">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-3" />
            <p className="text-warm-900 font-bold text-lg">Work Complete!</p>
            <p className="text-warm-500 text-sm mt-1">You've checked in and out for today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleCheckIn} disabled={actionLoading || isCheckedIn}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 font-semibold
                ${isCheckedIn
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600 cursor-not-allowed'
                  : 'border-warm-900 bg-warm-900 text-white hover:bg-warm-700 hover:-translate-y-1 shadow-pill'
                }`}>
              {actionLoading ? <span className="w-7 h-7 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <LogIn size={26} />}
              <span>{isCheckedIn ? '✓ Checked In' : 'Check In'}</span>
            </button>

            <button onClick={handleCheckOut} disabled={actionLoading || !isCheckedIn || isCheckedOut}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 font-semibold
                ${!isCheckedIn
                  ? 'border-warm-200 bg-warm-50 text-warm-300 cursor-not-allowed'
                  : 'border-primary-600 bg-primary-600 text-white hover:bg-primary-500 hover:-translate-y-1 shadow-accent'
                }`}>
              {actionLoading ? <span className="w-7 h-7 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <LogOut size={26} />}
              <span>Check Out</span>
            </button>
          </div>
        )}

        <div className="mt-4 flex items-start gap-2 text-xs text-warm-400">
          <AlertCircle size={12} className="shrink-0 mt-0.5" />
          <p>Attendance is recorded automatically. Contact HR for any corrections.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceCheckIn;
