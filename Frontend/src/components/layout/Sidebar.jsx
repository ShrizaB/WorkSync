import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, ClipboardList,
  CreditCard, CheckSquare, LogOut, X, Briefcase,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials, getAvatarColor } from '../../utils/formatters';

const navAdmin = [
  { label: 'Dashboard',    to: '/dashboard/admin',    icon: LayoutDashboard },
  { label: 'Employees',    to: '/employees',           icon: Users },
  { label: 'Attendance',   to: '/attendance/checkin',  icon: CheckSquare },
  { label: 'Calendar',     to: '/attendance/calendar', icon: Calendar },
  { label: 'Leave Approval',to: '/leaves/approval',   icon: ClipboardList },
  { label: 'Payroll',      to: '/payroll',             icon: CreditCard },
];

const navEmployee = [
  { label: 'Dashboard',    to: '/dashboard/employee',  icon: LayoutDashboard },
  { label: 'My Profile',   to: '/employees/2',          icon: Users },
  { label: 'Check In/Out', to: '/attendance/checkin',   icon: CheckSquare },
  { label: 'Calendar',     to: '/attendance/calendar',  icon: Calendar },
  { label: 'History',      to: '/attendance/history',   icon: ClipboardList },
  { label: 'Apply Leave',  to: '/leaves/apply',         icon: Briefcase },
  { label: 'My Leaves',    to: '/leaves/history',       icon: ClipboardList },
  { label: 'Salary Slip',  to: '/payroll/slip',         icon: CreditCard },
];

const avatarColors = [
  'bg-primary-100 text-primary-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
];

const getAvatarClass = (name = '') => {
  let hash = 0;
  for (const c of name) hash += c.charCodeAt(0);
  return avatarColors[hash % avatarColors.length];
};

const Sidebar = ({ open, setOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navLinks = user?.role === 'admin' ? navAdmin : navEmployee;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col
        bg-white border-r border-warm-200
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-warm-100">
          <div className="flex items-center gap-2.5">
            {/* Red dot logo like Auraform */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-accent">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <div>
              <p className="text-warm-900 font-bold text-base leading-none tracking-tight">WorkSync</p>
              <p className="text-warm-500 text-xs mt-0.5">HRM Platform</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-warm-400 hover:text-warm-700 p-1 rounded-lg hover:bg-warm-100">
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            user?.role === 'admin'
              ? 'bg-primary-50 text-primary-700 border border-primary-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {user?.role === 'admin' ? '● Administrator' : '● Employee'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `sidebar-link group ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-warm-900 text-white'
                      : 'bg-warm-100 text-warm-500 group-hover:bg-warm-200'
                  }`}>
                    <Icon size={15} />
                  </div>
                  <span className="flex-1">{label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-warm-100 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-warm-50 border border-warm-100">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarClass(user?.name)}`}>
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-warm-900 text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-warm-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <LogOut size={15} className="text-primary-600" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
