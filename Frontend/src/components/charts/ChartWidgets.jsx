import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-warm-200 rounded-xl p-3 shadow-card-md text-sm">
      <p className="text-warm-600 mb-1.5 font-medium text-xs">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.value > 10000
            ? `$${p.value.toLocaleString()}`
            : p.value}
        </p>
      ))}
    </div>
  );
};

export const BarChartWidget = ({ data, bars, xKey = 'month', height = 220 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} barSize={22} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E1" vertical={false} />
      <XAxis dataKey={xKey} tick={{ fill: '#958E82', fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#958E82', fontSize: 12 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(220,0,45,0.04)' }} />
      {bars.map(b => (
        <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[6,6,0,0]} />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

export const AreaChartWidget = ({ data, lines, xKey = 'day', height = 220 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
      <defs>
        {lines.map(l => (
          <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={l.color} stopOpacity={0.15} />
            <stop offset="95%" stopColor={l.color} stopOpacity={0} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E1" vertical={false} />
      <XAxis dataKey={xKey} tick={{ fill: '#958E82', fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#958E82', fontSize: 12 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      {lines.map(l => (
        <Area key={l.key} type="monotone" dataKey={l.key} name={l.name}
          stroke={l.color} fill={`url(#grad-${l.key})`}
          strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: l.color, stroke: '#fff', strokeWidth: 2 }}
        />
      ))}
    </AreaChart>
  </ResponsiveContainer>
);

export const DonutChartWidget = ({ data, height = 220 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
        {data.map((entry, i) => (
          <Cell key={i} fill={entry.color} stroke="transparent" />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  </ResponsiveContainer>
);
