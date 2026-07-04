import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Filter } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { attendanceAPI } from '../../api/attendance';

const AttendanceHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month,   setMonth]   = useState(format(new Date(), 'yyyy-MM'));
  const [status,  setStatus]  = useState('all');
  const [stats,   setStats]   = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data }, s] = await Promise.all([attendanceAPI.getHistory({ month, status }), attendanceAPI.getStats()]);
      setRecords(data); setStats(s);
    } finally { setLoading(false); }
  }, [month, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    {
      key: 'date', label: 'Date',
      render: (v) => (
        <div>
          <p className="text-warm-900 font-semibold">{format(new Date(v), 'EEE, MMM d')}</p>
          <p className="text-warm-400 text-xs">{format(new Date(v), 'yyyy')}</p>
        </div>
      ),
    },
    { key: 'checkIn',  label: 'Check In',  render: (v) => v ? <span className="text-emerald-700 font-medium">{v}</span> : '—' },
    { key: 'checkOut', label: 'Check Out', render: (v) => v ? <span className="text-sky-700 font-medium">{v}</span> : '—' },
    { key: 'hours',    label: 'Hours',     render: (v) => v ? <span className="font-semibold text-warm-800">{v}h</span> : '—' },
    { key: 'status',   label: 'Status',    render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">Records</p>
        <h1 className="page-title">Attendance History</h1>
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Working Days', value: stats.total,   color: 'text-warm-900' },
            { label: 'Present',      value: stats.present, color: 'text-emerald-600' },
            { label: 'Absent',       value: stats.absent,  color: 'text-primary-600' },
            { label: 'On Leave',     value: stats.leave,   color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="card p-3.5 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-warm-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card p-4 mb-4 flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 text-warm-500">
          <Filter size={14} />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="input-field sm:w-44" />
        <select value={status} onChange={e => setStatus(e.target.value)} className="input-field sm:w-36">
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">On Leave</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <Table columns={columns} data={records} loading={loading} emptyMessage="No attendance records found" />
      </div>
    </DashboardLayout>
  );
};

export default AttendanceHistory;
