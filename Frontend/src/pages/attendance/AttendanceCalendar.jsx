import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { attendanceAPI } from '../../api/attendance';

const STATUS_STYLES = {
  present: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'P' },
  absent:  { bg: 'bg-primary-50 border-primary-200 text-primary-700', label: 'A' },
  leave:   { bg: 'bg-amber-50 border-amber-200 text-amber-700',       label: 'L' },
  weekend: { bg: 'bg-warm-50 border-warm-100 text-warm-300',          label: '' },
  future:  { bg: 'bg-white border-warm-100 text-warm-200',            label: '' },
};

const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const AttendanceCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    setLoading(true);
    attendanceAPI.getCalendar(format(currentMonth, 'yyyy-MM')).then(setCalendarData).finally(() => setLoading(false));
  }, [currentMonth]);

  const days     = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startPad = getDay(startOfMonth(currentMonth));

  const getStatus = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const today   = format(new Date(), 'yyyy-MM-dd');
    const dow     = getDay(day);
    if (dow === 0 || dow === 6) return 'weekend';
    if (dateStr > today)        return 'future';
    return calendarData.find(r => r.date === dateStr)?.status || 'absent';
  };

  const stats = calendarData.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">Attendance</p>
        <h1 className="page-title">Attendance Calendar</h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="card p-5">
          {/* Month navigator */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="p-2 rounded-xl hover:bg-warm-100 text-warm-400 hover:text-warm-900 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-warm-900">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="p-2 rounded-xl hover:bg-warm-100 text-warm-400 hover:text-warm-900 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-warm-400 py-2">{d}</div>)}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5">
              {Array(startPad).fill(null).map((_, i) => <div key={`pad-${i}`} />)}
              {days.map(day => {
                const st      = getStatus(day);
                const s       = STATUS_STYLES[st];
                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                return (
                  <div key={day.toISOString()}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl border text-xs font-semibold transition-transform hover:scale-105 ${s.bg} ${isToday ? 'ring-2 ring-warm-900 ring-offset-1' : ''}`}>
                    <span className="text-[10px] font-normal opacity-60">{format(day, 'd')}</span>
                    <span>{s.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend + Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="text-warm-700 text-sm font-semibold mb-3">Legend</h3>
            <div className="space-y-2">
              {[
                { label: 'Present',  style: STATUS_STYLES.present },
                { label: 'Absent',   style: STATUS_STYLES.absent  },
                { label: 'On Leave', style: STATUS_STYLES.leave   },
                { label: 'Weekend',  style: STATUS_STYLES.weekend  },
              ].map(({ label, style }) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <div className={`w-5 h-5 rounded-md border ${style.bg} flex items-center justify-center text-[10px] font-bold`}>{style.label}</div>
                  <span className="text-warm-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-warm-700 text-sm font-semibold mb-3">This Month</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Present', value: stats.present || 0, color: 'text-emerald-600' },
                { label: 'Absent',  value: stats.absent  || 0, color: 'text-primary-600' },
                { label: 'Leave',   value: stats.leave   || 0, color: 'text-amber-600'   },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-warm-500 text-sm">{s.label}</span>
                  <span className={`font-bold text-sm ${s.color}`}>{s.value} days</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceCalendar;
