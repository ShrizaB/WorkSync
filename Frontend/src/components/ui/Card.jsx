const Card = ({ children, className = '', hover = false }) => (
  <div className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}>
    {children}
  </div>
);

export const StatCard = ({ title, value, icon: Icon, color, trend, trendLabel }) => {
  const colorMap = {
    indigo:  { icon: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100' },
    violet:  { icon: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100' },
    emerald: { icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    amber:   { icon: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
    rose:    { icon: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100' },
    sky:     { icon: 'text-sky-600',     bg: 'bg-sky-50',     border: 'border-sky-100' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className={`card p-5 hover:-translate-y-1 hover:shadow-card-md transition-all duration-200 cursor-default`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon size={19} className={c.icon} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-primary-700 bg-primary-50 border border-primary-200'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-warm-900 mb-1">{value}</p>
      <p className="text-sm text-warm-500">{title}</p>
      {trendLabel && <p className="text-xs text-warm-400 mt-0.5">{trendLabel}</p>}
    </div>
  );
};

export default Card;
