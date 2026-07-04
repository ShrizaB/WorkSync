import { useEffect, useState } from 'react';
import { Users, CheckSquare, Calendar, CreditCard, ClipboardList, Building2, TrendingUp, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/ui/Card';
import { BarChartWidget, AreaChartWidget, DonutChartWidget } from '../../components/charts/ChartWidgets';
import { dashboardAPI } from '../../api/dashboard';
import { formatCurrency } from '../../utils/formatters';

const CHART_COLORS = {
  primary: '#DC002D',
  secondary: '#FF5578',
  blue: '#3B82F6',
  green: '#10B981',
  amber: '#F59E0B',
  purple: '#8B5CF6',
  sky: '#0EA5E9',
};

const AdminDashboard = () => {
  const [stats,    setStats]    = useState(null);
  const [trend,    setTrend]    = useState([]);
  const [deptDist, setDeptDist] = useState([]);
  const [payroll,  setPayroll]  = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardAPI.getAdminStats(),
      dashboardAPI.getAttendanceTrend(),
      dashboardAPI.getDepartmentDistribution(),
      dashboardAPI.getMonthlyPayroll(),
      dashboardAPI.getRecentActivity(),
    ]).then(([s, t, d, p, a]) => {
      setStats(s);
      setTrend(t);
      setDeptDist(d.map((item, i) => ({ ...item, color: [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.blue, CHART_COLORS.green, CHART_COLORS.amber][i] })));
      setPayroll(p);
      setActivity(a);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  const activityIcons = { calendar: Calendar, 'user-plus': Users, 'dollar-sign': CreditCard, 'check-circle': CheckSquare, edit: ClipboardList };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-2xl font-bold text-warm-900">Admin Dashboard</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-pill bg-white border border-warm-200 shadow-card text-xs text-warm-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Data
        </div>
      </div>

      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard title="Total Employees"  value={stats.totalEmployees} icon={Users}        color="indigo"  trend={5}  trendLabel="vs last month" />
        <StatCard title="Present Today"    value={stats.presentToday}   icon={CheckSquare}  color="emerald" trend={2}  trendLabel="of active staff" />
        <StatCard title="On Leave"         value={stats.onLeaveToday}   icon={Calendar}     color="amber"   trend={-1} trendLabel="today" />
        <StatCard title="Pending Leaves"   value={stats.pendingLeaves}  icon={ClipboardList} color="rose"             trendLabel="needs approval" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Employees" value={stats.activeEmployees} icon={TrendingUp}  color="violet" />
        <StatCard title="Departments"      value={stats.departments}     icon={Building2}   color="sky" />
        <StatCard title="Monthly Payroll"  value={formatCurrency(890000)} icon={CreditCard} color="emerald" trend={1.8} />
        <StatCard title="Avg Work Hours"   value="8.4h"                  icon={Clock}       color="indigo"  trendLabel="per employee" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Attendance Trend */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Attendance Trend</h3>
              <p className="text-warm-400 text-xs mt-0.5">Last 7 working days</p>
            </div>
            <span className="pill-tag">Weekly</span>
          </div>
          <AreaChartWidget
            data={trend}
            xKey="day"
            lines={[
              { key: 'present', name: 'Present', color: CHART_COLORS.primary },
              { key: 'absent',  name: 'Absent',  color: CHART_COLORS.blue },
            ]}
          />
        </div>

        {/* Department Distribution */}
        <div className="card p-5">
          <h3 className="section-title mb-0.5">Departments</h3>
          <p className="text-warm-400 text-xs mb-2">Employee distribution</p>
          <DonutChartWidget data={deptDist} height={180} />
          <div className="space-y-1.5 mt-2">
            {deptDist.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-warm-500">{d.name}</span>
                </div>
                <span className="text-warm-800 font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payroll + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5">
          <div className="mb-4">
            <h3 className="section-title">Monthly Payroll</h3>
            <p className="text-warm-400 text-xs mt-0.5">Total disbursed per month</p>
          </div>
          <BarChartWidget data={payroll} xKey="month" bars={[{ key: 'amount', name: 'Payroll', color: CHART_COLORS.primary }]} />
        </div>

        <div className="card p-5">
          <h3 className="section-title mb-4">Recent Activity</h3>
          <div className="space-y-3.5">
            {activity.map(item => {
              const Icon = activityIcons[item.icon] || ClipboardList;
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-warm-100 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-warm-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-warm-700 text-xs leading-relaxed">{item.message}</p>
                    <p className="text-warm-400 text-xs mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
