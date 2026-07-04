import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';
import { format } from 'date-fns';

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

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-warm-100 px-4 sm:px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-warm-500 hover:text-warm-900 hover:bg-warm-100 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-sm hidden sm:flex items-center gap-2 bg-warm-50 border border-warm-200 rounded-pill px-4 py-2">
          <Search size={14} className="text-warm-400 shrink-0" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-sm text-warm-700 placeholder-warm-400 focus:outline-none w-full"
          />
        </div>

        <div className="flex-1 sm:flex-none" />

        {/* Date */}
        <div className="hidden md:block text-sm text-warm-500 font-medium">
          {format(new Date(), 'EEE, MMM d')}
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-warm-500 hover:text-warm-900 hover:bg-warm-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-600 rounded-full" />
        </button>

        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer shadow-sm ${getAvatarClass(user?.name)}`}>
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
