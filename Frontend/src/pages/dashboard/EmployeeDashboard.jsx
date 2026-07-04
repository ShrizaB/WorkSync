import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Calendar, CreditCard, ClipboardList, TrendingUp, Clock, ArrowRight, LogIn } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { attendanceAPI } from '../../api/attendance';
import { leaveAPI } from '../../api/leaves';
import { payrollAPI } from '../../api/payroll';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatCurrency } from '../../utils/formatters';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [attendStats,  setAttendStats]  = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [todayStatus,  setTodayStatus]  = useState(null);
  const [myLeaves,     setMyLeaves]     = useState([]);
  const [paySlip,      setPaySlip]      = useState(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      attendanceAPI.getStats(),
      leaveAPI.getBalance(),
      attendanceAPI.getTodayStatus(),
      leaveAPI.getMyLeaves(user?.id || 2),
      payrollAPI.getMySlip(user?.id || 2),
    ]).then(([as, lb, ts, ml, ps]) => {
      setAttendStats(as); setLeaveBalance(lb); setTodayStatus(ts);
      setMyLeaves(ml.slice(0, 4)); setPaySlip(ps);
    }).finally(() => setLoading(false));
  }, [user]);

  const quickActions = [
    { label: 'Check In/Out', to: '/attendance/checkin', icon: LogIn,        color: 'bg-warm-900 text-white hover:bg-warm-700' },
    { label: 'Apply Leave',  to: '/leaves/apply',       icon: ClipboardList, color: 'bg-primary-600 text-white hover:bg-primary-500' },
    { label: 'Att. Calendar',to: '/attendance/calendar',icon: Calendar,     color: 'bg-sky-600 text-white hover:bg-sky-500' },
    { label: 'Salary Slip',  to: '/payroll/slip',       icon: CreditCard,   color: 'bg-emerald-600 text-white hover:bg-emerald-500' },
  ];

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">My Workspace</p>
        <h1 className="text-2xl font-bold text-warm-900">
          Good morning, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
        </h1>
      </div>

      {/* Today status banner */}
      <div className="card p-4 mb-6 flex items-center justify-between gap-4 border-l-4 border-l-primary-500">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <Clock size={18} className="text-primary-600" />
          </div>
          <div>
            <p className="text-warm-900 font-semibold text-sm">Today's Attendance</p>
            <p className="text-warm-500 text-xs">
              {todayStatus?.checkIn ? `Checked in at ${todayStatus.checkIn}` : 'Not checked in yet'}
              {todayStatus?.checkOut ? ` · Out at ${todayStatus.checkOut}` : ''}
            </p>
          </div>
        </div>
        <StatusBadge status={todayStatus?.status || 'not_checked_in'} />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Attendance Rate" value={`${attendStats?.percentage || 0}%`} icon={TrendingUp} color="emerald" trend={3} />
        <StatCard title="Present Days"    value={attendStats?.present || 0}           icon={CheckSquare} color="indigo" trendLabel="this month" />
        <StatCard title="Leaves Left"     value={leaveBalance?.annual?.remaining || 0} icon={Calendar}  color="violet" trendLabel="annual leaves" />
        <StatCard title="Net Salary"      value={formatCurrency(paySlip?.netSalary || 0)} icon={CreditCard} color="amber" trendLabel="this month" />
      </div>

      {/* Quick actions */}
      <div className="mb-6">
        <h3 className="section-title mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ label, to, icon: Icon, color }) => (
            <Link key={to} to={to}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl ${color} hover:-translate-y-0.5 transition-all duration-200 shadow-card font-semibold text-sm text-center`}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Leave balance + Recent leaves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leave Balance */}
        <div className="card p-5">
          <h3 className="section-title mb-4">Leave Balance</h3>
          <div className="space-y-4">
            {leaveBalance && Object.entries(leaveBalance).map(([type, bal]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-warm-600 capitalize font-medium">{type} Leave</span>
                  <span className="text-warm-900 font-bold">{bal.remaining} / {bal.total}</span>
                </div>
                <div className="h-2 bg-warm-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all"
                    style={{ width: `${(bal.remaining / bal.total) * 100}%` }} />
                </div>
                <p className="text-warm-400 text-xs mt-0.5">{bal.used} used</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leaves */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Recent Leaves</h3>
            <Link to="/leaves/history" className="text-primary-600 text-xs hover:text-primary-700 flex items-center gap-1 font-semibold">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {myLeaves.length === 0 ? (
              <p className="text-warm-400 text-sm text-center py-6">No leave records yet</p>
            ) : (
              myLeaves.map(leave => (
                <div key={leave.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-warm-50 border border-warm-100">
                  <div className="min-w-0">
                    <p className="text-warm-800 text-sm font-semibold truncate">{leave.type}</p>
                    <p className="text-warm-400 text-xs">{formatDate(leave.from)} — {formatDate(leave.to)}</p>
                  </div>
                  <StatusBadge status={leave.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
