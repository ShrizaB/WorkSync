import { useEffect, useState, useCallback } from 'react';
import { CreditCard, Users, TrendingUp, FileText } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/ui/Table';
import { StatCard } from '../../components/ui/Card';
import { StatusBadge, Avatar } from '../../components/ui/Badge';
import { BarChartWidget } from '../../components/charts/ChartWidgets';
import { payrollAPI } from '../../api/payroll';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const PayrollManagement = () => {
  const [records,  setRecords]  = useState([]);
  const [summary,  setSummary]  = useState(null);
  const [months,   setMonths]   = useState([]);
  const [month,    setMonth]    = useState('June 2024');
  const [status,   setStatus]   = useState('all');
  const [loading,  setLoading]  = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data }, s, m] = await Promise.all([payrollAPI.getAll({ month, status }), payrollAPI.getSummary(), payrollAPI.getAvailableMonths()]);
      setRecords(data); setSummary(s); setMonths(m);
    } finally { setLoading(false); }
  }, [month, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGenerate = async (id) => {
    setActionId(id);
    try { await payrollAPI.generateSlip(id); toast.success('Payslip generated & marked as paid'); fetchData(); }
    catch (err) { toast.error(err.message); }
    finally { setActionId(null); }
  };

  const columns = [
    {
      key: 'employeeName', label: 'Employee',
      render: (name, row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={name} size="sm" />
          <div>
            <p className="text-warm-900 font-semibold text-sm">{name}</p>
            <p className="text-warm-400 text-xs">{row.department}</p>
          </div>
        </div>
      ),
    },
    { key: 'basicSalary',     label: 'Basic',      render: (v) => formatCurrency(v) },
    { key: 'grossSalary',     label: 'Gross',      render: (v) => formatCurrency(v) },
    { key: 'totalDeductions', label: 'Deductions', render: (v) => <span className="text-primary-600 font-semibold">{formatCurrency(v)}</span> },
    { key: 'netSalary',       label: 'Net Pay',    render: (v) => <span className="text-emerald-600 font-bold">{formatCurrency(v)}</span> },
    { key: 'paidOn',          label: 'Paid On',    render: (v) => v ? formatDate(v) : '—' },
    { key: 'status',          label: 'Status',     render: (v) => <StatusBadge status={v} /> },
    {
      key: 'id', label: 'Action',
      render: (id, row) => (
        <button onClick={() => handleGenerate(id)} disabled={row.status === 'paid' || actionId === id}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold transition-all ${
            row.status === 'paid'
              ? 'bg-warm-100 text-warm-400 cursor-not-allowed'
              : 'bg-warm-900 text-white hover:bg-warm-700 shadow-pill'
          }`}>
          {actionId === id
            ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            : <FileText size={12} />
          }
          {row.status === 'paid' ? 'Paid' : 'Generate'}
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">Finance</p>
        <h1 className="page-title">Payroll Management</h1>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard title="Total Payroll"  value={formatCurrency(summary.totalPayroll)} icon={CreditCard} color="indigo" />
          <StatCard title="Employees Paid" value={summary.paid}    icon={Users}      color="emerald" />
          <StatCard title="Pending"        value={summary.pending} icon={TrendingUp}  color="amber" />
          <StatCard title="Month"          value={month.split(' ')[0]} icon={FileText} color="rose" trendLabel={month.split(' ')[1]} />
        </div>
      )}

      {summary && (
        <div className="card p-5 mb-5">
          <h3 className="section-title mb-1">Monthly Payroll Trend</h3>
          <p className="text-warm-400 text-xs mb-4">Total disbursed per month</p>
          <BarChartWidget data={summary.monthlyTrend} xKey="month" bars={[{ key: 'amount', name: 'Payroll', color: '#DC002D' }]} />
        </div>
      )}

      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={month} onChange={e => setMonth(e.target.value)} className="input-field w-36">
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="input-field w-32">
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <Table columns={columns} data={records} loading={loading} emptyMessage="No payroll records found" />
      </div>
    </DashboardLayout>
  );
};

export default PayrollManagement;
