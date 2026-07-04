import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { leaveAPI } from '../../api/leaves';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';

const LeaveHistory = () => {
  const { user }  = useAuth();
  const [leaves,  setLeaves]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  useEffect(() => {
    leaveAPI.getMyLeaves(user?.id || 2).then(setLeaves).finally(() => setLoading(false));
  }, [user]);

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  const stats = {
    total:    leaves.length,
    approved: leaves.filter(l => l.status === 'approved').length,
    pending:  leaves.filter(l => l.status === 'pending').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
  };

  const columns = [
    { key: 'type',      label: 'Leave Type' },
    { key: 'from',      label: 'From',       render: (v) => formatDate(v) },
    { key: 'to',        label: 'To',         render: (v) => formatDate(v) },
    { key: 'days',      label: 'Days',       render: (v) => `${v}d` },
    { key: 'reason',    label: 'Reason',     render: (v) => <span className="text-warm-400 text-xs line-clamp-1 max-w-xs">{v}</span> },
    { key: 'appliedOn', label: 'Applied On', render: (v) => formatDate(v) },
    { key: 'status',    label: 'Status',     render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">Leaves</p>
        <h1 className="page-title">My Leave History</h1>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Applied', value: stats.total,    color: 'text-warm-900' },
          { label: 'Approved',      value: stats.approved, color: 'text-emerald-600' },
          { label: 'Pending',       value: stats.pending,  color: 'text-amber-600' },
          { label: 'Rejected',      value: stats.rejected, color: 'text-primary-600' },
        ].map(s => (
          <div key={s.label} className="card p-3.5 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-warm-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {['all','pending','approved','rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-pill text-sm font-semibold transition-colors capitalize ${
              filter === f ? 'bg-warm-900 text-white' : 'bg-white text-warm-500 border border-warm-200 hover:border-warm-400 hover:text-warm-900'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <Table columns={columns} data={filtered} loading={loading} emptyMessage="No leave records found" />
      </div>
    </DashboardLayout>
  );
};

export default LeaveHistory;
