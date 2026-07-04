const avatarBg = [
  'bg-primary-100 text-primary-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
];
const getAvatarClass = (name = '') => {
  let h = 0; for (const c of name) h += c.charCodeAt(0);
  return avatarBg[h % avatarBg.length];
};
const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const Avatar = ({ name, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold shrink-0 ${getAvatarClass(name)} ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export const Badge = ({ variant = 'neutral', children, className = '' }) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger:  'badge-danger',
    info:    'badge-info',
    neutral: 'badge-neutral',
  };
  return <span className={`${variants[variant] || 'badge-neutral'} ${className}`}>{children}</span>;
};

export const StatusBadge = ({ status }) => {
  const map = {
    active:         { variant: 'success', label: 'Active' },
    inactive:       { variant: 'neutral', label: 'Inactive' },
    present:        { variant: 'success', label: 'Present' },
    absent:         { variant: 'danger',  label: 'Absent' },
    leave:          { variant: 'warning', label: 'On Leave' },
    checked_in:     { variant: 'success', label: 'Checked In' },
    checked_out:    { variant: 'info',    label: 'Checked Out' },
    not_checked_in: { variant: 'neutral', label: 'Not Started' },
    paid:           { variant: 'success', label: 'Paid' },
    pending:        { variant: 'warning', label: 'Pending' },
    approved:       { variant: 'success', label: 'Approved' },
    rejected:       { variant: 'danger',  label: 'Rejected' },
  };
  const { variant, label } = map[status] || { variant: 'neutral', label: status };
  return <Badge variant={variant}>{label}</Badge>;
};
