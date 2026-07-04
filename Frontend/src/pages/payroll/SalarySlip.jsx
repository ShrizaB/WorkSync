import { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { payrollAPI } from '../../api/payroll';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Avatar } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const Row = ({ label, value, bold = false, highlight = false }) => (
  <div className={`flex justify-between py-2.5 border-b border-warm-100 last:border-0 text-sm ${highlight ? '-mx-4 px-4 bg-warm-50 rounded-xl' : ''}`}>
    <span className={bold ? 'text-warm-800 font-semibold' : 'text-warm-500'}>{label}</span>
    <span className={`font-medium ${highlight ? 'text-primary-700 font-bold text-base' : bold ? 'text-warm-900 font-bold' : 'text-warm-800'}`}>{value}</span>
  </div>
);

const SalarySlip = () => {
  const { user }  = useAuth();
  const [slip,    setSlip]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [months,  setMonths]  = useState([]);
  const [month,   setMonth]   = useState('June 2024');

  useEffect(() => { payrollAPI.getAvailableMonths().then(setMonths); }, []);
  useEffect(() => {
    setLoading(true);
    payrollAPI.getMySlip(user?.id || 2, month).then(setSlip).catch(err => toast.error(err.message)).finally(() => setLoading(false));
  }, [user, month]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between gap-4 mb-6 no-print">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">Payroll</p>
          <h1 className="page-title">Salary Slip</h1>
        </div>
        <div className="flex gap-2">
          <select value={month} onChange={e => setMonth(e.target.value)} className="input-field w-36">
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button onClick={() => window.print()} className="btn-outline"><Printer size={15} /> Print</button>
        </div>
      </div>

      {slip && (
        <div className="max-w-2xl mx-auto print-area">
          <div className="card overflow-hidden p-0">
            {/* Header gradient */}
            <div className="bg-gradient-to-r from-warm-900 to-warm-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">W</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">WorkSync Inc.</p>
                    <p className="text-white/60 text-sm">Salary Statement</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl">{slip.month}</p>
                  <p className="text-white/60 text-sm">Pay Period</p>
                </div>
              </div>
            </div>

            {/* Employee info */}
            <div className="p-6 border-b border-warm-100 bg-warm-50">
              <div className="flex items-center gap-4">
                <Avatar name={slip.employeeName} size="lg" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 flex-1">
                  {[
                    { label: 'Employee Name', value: slip.employeeName },
                    { label: 'Employee ID',   value: `#${String(slip.employeeId).padStart(4,'0')}` },
                    { label: 'Department',    value: slip.department },
                    { label: 'Pay Date',      value: formatDate(slip.paidOn) },
                    { label: 'Status',        value: <span className="text-emerald-600 font-bold capitalize">{slip.status}</span> },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-warm-400 text-xs">{label}</p>
                      <p className="text-warm-900 font-semibold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Earnings
                  </h3>
                  <div className="bg-warm-50 border border-warm-100 rounded-xl p-4 space-y-0">
                    <Row label="Basic Salary"     value={formatCurrency(slip.basicSalary)} />
                    <Row label="HRA"              value={formatCurrency(slip.hra)} />
                    <Row label="Conveyance"       value={formatCurrency(slip.conveyance)} />
                    <Row label="Medical Allow."   value={formatCurrency(slip.medicalAllowance)} />
                    <Row label="Other Allow."     value={formatCurrency(slip.otherAllowance)} />
                    <Row label="Gross Salary"     value={formatCurrency(slip.grossSalary)} bold />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" /> Deductions
                  </h3>
                  <div className="bg-warm-50 border border-warm-100 rounded-xl p-4 space-y-0">
                    <Row label="Provident Fund"   value={formatCurrency(slip.pf)} />
                    <Row label="Prof. Tax"        value={formatCurrency(slip.professionalTax)} />
                    <Row label="TDS"              value={formatCurrency(slip.tds)} />
                    <Row label="Loan Deduction"   value={formatCurrency(slip.loanDeduction)} />
                    <Row label="Total Deductions" value={formatCurrency(slip.totalDeductions)} bold />
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="rounded-2xl border-2 border-warm-900 p-5 flex items-center justify-between bg-warm-900">
                <div>
                  <p className="text-white/70 text-sm">Net Salary (Take Home)</p>
                  <p className="text-white/50 text-xs mt-0.5">After all deductions</p>
                </div>
                <p className="text-4xl font-bold text-white">{formatCurrency(slip.netSalary)}</p>
              </div>

              <p className="text-warm-300 text-xs text-center mt-5">
                Computer-generated salary slip — no signature required.
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SalarySlip;
