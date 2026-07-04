import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute, GuestRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard';

// Employees
import EmployeeList from '../pages/employees/EmployeeList';
import EmployeeProfile from '../pages/employees/EmployeeProfile';
import EmployeeForm from '../pages/employees/EmployeeForm';

// Attendance
import AttendanceCheckIn from '../pages/attendance/AttendanceCheckIn';
import AttendanceCalendar from '../pages/attendance/AttendanceCalendar';
import AttendanceHistory from '../pages/attendance/AttendanceHistory';

// Leaves
import ApplyLeave from '../pages/leaves/ApplyLeave';
import LeaveHistory from '../pages/leaves/LeaveHistory';
import LeaveApproval from '../pages/leaves/LeaveApproval';

// Payroll
import SalarySlip from '../pages/payroll/SalarySlip';
import PayrollManagement from '../pages/payroll/PayrollManagement';

const DashboardRedirect = () => {
  const { user } = useAuth();
  return (
    <Navigate
      to={user?.role === 'admin'
        ? '/dashboard/admin'
        : '/dashboard/employee'}
      replace
    />
  );
};

const AppRouter = () => (
  <Routes>

    {/* Landing Page + Guest Routes */}
    <Route element={<GuestRoute />}>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Admin */}
      <Route element={<RoleRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/new" element={<EmployeeForm />} />
        <Route path="/employees/:id/edit" element={<EmployeeForm />} />
        <Route path="/leaves/approval" element={<LeaveApproval />} />
        <Route path="/payroll" element={<PayrollManagement />} />
      </Route>

      {/* Employee */}
      <Route element={<RoleRoute allowedRoles={['employee', 'admin']} />}>
        <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
        <Route path="/employees/:id" element={<EmployeeProfile />} />
        <Route path="/attendance/checkin" element={<AttendanceCheckIn />} />
        <Route path="/attendance/calendar" element={<AttendanceCalendar />} />
        <Route path="/attendance/history" element={<AttendanceHistory />} />
        <Route path="/leaves/apply" element={<ApplyLeave />} />
        <Route path="/leaves/history" element={<LeaveHistory />} />
        <Route path="/payroll/slip" element={<SalarySlip />} />
      </Route>
    </Route>

    {/* Default */}
    <Route path="*" element={<Navigate to="/" replace />} />

  </Routes>
);

export default AppRouter;