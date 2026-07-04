import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/ui/Table';
import { StatusBadge, Avatar } from '../../components/ui/Badge';
import { ConfirmModal } from '../../components/ui/Modal';
import { leaveAPI } from '../../api/leaves';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const LeaveApproval = () => {
  const [leaves,       setLeaves]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState('pending');
  const [confirm,      setConfirm]      = useState(null);
  const [actionLoading,setActionLoading]= useState(false);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try { const { data } = await leaveAPI.getAllLeaves({ status: filter }); setLeaves(data); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const handleAction = async () => {
    if (!confirm) return;
    setActionLoading(true);
    try {
      if (confirm.action === 'approve') { await leaveAPI.approve(confirm.id); toast.success(`Leave approved for ${confirm.name}`); }
      else { await leaveAPI.reject(confirm.id); toast.error(`Leave rejected for ${confirm.name}`); }
      setConfirm(null); fetchLeaves();
    } catch (err) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  const pendingCount = leaves.filter(l => l.status === 'pending').length;

  const columns = [
    {
      key: 'employeeName', label: 'Employee',
      render: (name) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={name} size="sm" />
          <p className="text-warm-900 text-sm font-semibold">{name}</p>
        </div>
      ),
    },
    { key: 'type',      label: 'Type' },
    { key: 'from',      label: 'From',    render: (v) => formatDate(v) },
    { key: 'to',        label: 'To',      render: (v) => formatDate(v) },
    { key: 'days',      label: 'Days',    render: (v) => `${v}d` },
    { key: 'reason',    label: 'Reason',  render: (v) => <span className="text-warm-400 text-xs line-clamp-1 max-w-[140px]">{v}</span> },
    { key: 'appliedOn', label: 'Applied', render: (v) => formatDate(v) },
    { key: 'status',    label: 'Status',  render: (v) => <StatusBadge status={v} /> },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => row.status === 'pending' ? (
        <div className="flex items-center gap-1">
          <button onClick={() => setConfirm({ id, name: row.employeeName, action: 'approve' })}
            className="p-1.5 rounded-lg text-warm-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve">
            <CheckCircle size={17} />
          </button>
          <button onClick={() => setConfirm({ id, name: row.employeeName, action: 'reject' })}
            className="p-1.5 rounded-lg text-warm-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Reject">
            <XCircle size={17} />
          </button>
        </div>
      ) : null,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="page-title">Leave Approval</h1>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold">
            <Clock size={14} /> {pendingCount} pending
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {['pending','approved','rejected','all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-pill text-sm font-semibold transition-colors capitalize ${
              filter === f ? 'bg-warm-900 text-white' : 'bg-white text-warm-500 border border-warm-200 hover:border-warm-400 hover:text-warm-900'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <Table columns={columns} data={leaves} loading={loading} emptyMessage="No leave requests found" />
      </div>

      <ConfirmModal isOpen={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleAction} loading={actionLoading}
        title={confirm?.action === 'approve' ? 'Approve Leave' : 'Reject Leave'}
        message={`Are you sure you want to ${confirm?.action} the leave request for ${confirm?.name}?`}
        confirmLabel={confirm?.action === 'approve' ? 'Approve' : 'Reject'}
        variant={confirm?.action === 'approve' ? 'success' : 'danger'} />
    </DashboardLayout>
  );
};

export default LeaveApproval;
