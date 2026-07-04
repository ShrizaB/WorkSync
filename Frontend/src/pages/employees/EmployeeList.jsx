import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/ui/Table';
import { ConfirmModal } from '../../components/ui/Modal';
import { StatusBadge, Avatar } from '../../components/ui/Badge';
import { employeeAPI } from '../../api/employees';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['all', 'Engineering', 'Design', 'Sales', 'Marketing', 'Finance', 'Management'];

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees,     setEmployees]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [dept,          setDept]          = useState('all');
  const [status,        setStatus]        = useState('all');
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleting,      setDeleting]      = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try { const { data } = await employeeAPI.getAll({ search, department: dept, status }); setEmployees(data); }
    finally { setLoading(false); }
  }, [search, dept, status]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await employeeAPI.delete(deleteTarget.id); toast.success(`${deleteTarget.name} removed`); setDeleteTarget(null); fetchEmployees(); }
    catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  };

  const columns = [
    {
      key: 'name', label: 'Employee',
      render: (name, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={name} size="sm" />
          <div>
            <p className="text-warm-900 font-semibold text-sm">{name}</p>
            <p className="text-warm-400 text-xs">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department' },
    { key: 'position',   label: 'Position' },
    { key: 'salary',     label: 'Salary',  render: (v) => <span className="font-semibold text-warm-800">{formatCurrency(v)}</span> },
    { key: 'joinDate',   label: 'Joined',  render: (v) => formatDate(v) },
    { key: 'status',     label: 'Status',  render: (v) => <StatusBadge status={v} /> },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(`/employees/${id}`)} className="p-1.5 rounded-lg text-warm-400 hover:text-sky-600 hover:bg-sky-50 transition-colors" title="View"><Eye size={15} /></button>
          <button onClick={() => navigate(`/employees/${id}/edit`)} className="p-1.5 rounded-lg text-warm-400 hover:text-warm-900 hover:bg-warm-100 transition-colors" title="Edit"><Edit2 size={15} /></button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded-lg text-warm-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Delete"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">People</p>
          <h1 className="page-title">Employees <span className="text-warm-400 font-normal text-xl">({employees.length})</span></h1>
        </div>
        <button onClick={() => navigate('/employees/new')} className="btn-primary">
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
          <input type="text" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={dept} onChange={e => setDept(e.target.value)} className="input-field sm:w-44">
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="input-field sm:w-36">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        <Table columns={columns} data={employees} loading={loading} emptyMessage="No employees found" />
      </div>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Remove Employee" message={`Are you sure you want to remove ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Remove" variant="danger" />
    </DashboardLayout>
  );
};

export default EmployeeList;
