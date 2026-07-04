import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Mail, Phone, Building2, Briefcase, Calendar, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatusBadge, Avatar } from '../../components/ui/Badge';
import { employeeAPI } from '../../api/employees';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-warm-50 border border-warm-100 hover:bg-warm-100 transition-colors">
    <div className="w-8 h-8 rounded-xl bg-white border border-warm-200 flex items-center justify-center shrink-0 shadow-sm">
      <Icon size={14} className="text-warm-600" />
    </div>
    <div>
      <p className="text-warm-400 text-xs font-medium">{label}</p>
      <p className="text-warm-900 text-sm font-semibold">{value || '—'}</p>
    </div>
  </div>
);

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    employeeAPI.getById(id)
      .then(setEmployee)
      .catch(err => { toast.error(err.message); navigate(-1); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );
  if (!employee) return null;

  return (
    <DashboardLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-warm-500 hover:text-warm-900 text-sm mb-5 transition-colors font-medium">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <div className="card p-6 flex flex-col items-center text-center">
          <Avatar name={employee.name} size="xl" className="mb-4" />
          <h2 className="text-xl font-bold text-warm-900">{employee.name}</h2>
          <p className="text-warm-500 text-sm mt-1">{employee.position}</p>
          <div className="mt-2"><StatusBadge status={employee.status} /></div>

          <div className="w-full border-t border-warm-100 mt-5 pt-5 space-y-2.5 text-left">
            {[
              { label: 'Employee ID', value: `#${String(employee.id).padStart(4, '0')}` },
              { label: 'Gender',      value: employee.gender },
              { label: 'Joined',      value: formatDate(employee.joinDate) },
              { label: 'Department',  value: employee.department },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-warm-400">{label}</span>
                <span className="text-warm-900 font-semibold">{value}</span>
              </div>
            ))}
          </div>

          {user?.role === 'admin' && (
            <button onClick={() => navigate(`/employees/${id}/edit`)} className="btn-primary w-full justify-center mt-5">
              <Edit2 size={15} /> Edit Profile
            </button>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="section-title mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow icon={Mail}  label="Email" value={employee.email} />
              <InfoRow icon={Phone} label="Phone" value={employee.phone} />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="section-title mb-3">Work Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow icon={Building2}  label="Department" value={employee.department} />
              <InfoRow icon={Briefcase}  label="Position"   value={employee.position} />
              <InfoRow icon={Calendar}   label="Join Date"  value={formatDate(employee.joinDate)} />
              {user?.role === 'admin' && <InfoRow icon={DollarSign} label="Annual Salary" value={formatCurrency(employee.salary)} />}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="section-title mb-3">This Month's Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Days Present', value: '18', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                { label: 'Days Absent',  value: '2',  color: 'text-primary-600', bg: 'bg-primary-50 border-primary-100' },
                { label: 'Leaves Taken', value: '2',  color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-100' },
              ].map(s => (
                <div key={s.label} className={`text-center p-4 rounded-xl border ${s.bg}`}>
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-warm-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeProfile;
