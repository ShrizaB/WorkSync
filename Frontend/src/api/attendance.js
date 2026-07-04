import { format, subDays, startOfMonth, eachDayOfInterval } from 'date-fns';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const generateAttendanceHistory = () => {
  const today = new Date();
  const start = startOfMonth(today);
  const days = eachDayOfInterval({ start, end: subDays(today, 1) });
  const statuses = ['present', 'present', 'present', 'present', 'absent', 'leave'];
  return days.map((day) => {
    const dow = day.getDay();
    if (dow === 0 || dow === 6) return null; // weekends
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      date: format(day, 'yyyy-MM-dd'),
      checkIn:  status === 'present' ? '09:' + String(Math.floor(Math.random() * 30)).padStart(2,'0') + ' AM' : null,
      checkOut: status === 'present' ? '06:' + String(Math.floor(Math.random() * 30)).padStart(2,'0') + ' PM' : null,
      hours: status === 'present' ? (8 + Math.random()).toFixed(1) : '0',
      status,
    };
  }).filter(Boolean);
};

let attendanceHistory = generateAttendanceHistory();

let todayStatus = {
  date: format(new Date(), 'yyyy-MM-dd'),
  checkIn: null,
  checkOut: null,
  status: 'not_checked_in',
};

export const attendanceAPI = {
  getTodayStatus: async () => {
    await delay(200);
    return { ...todayStatus };
  },

  checkIn: async () => {
    await delay(400);
    if (todayStatus.checkIn) throw new Error('Already checked in');
    todayStatus = {
      ...todayStatus,
      checkIn: format(new Date(), 'hh:mm a'),
      status: 'checked_in',
    };
    return { ...todayStatus };
  },

  checkOut: async () => {
    await delay(400);
    if (!todayStatus.checkIn) throw new Error('Not checked in yet');
    if (todayStatus.checkOut) throw new Error('Already checked out');
    todayStatus = {
      ...todayStatus,
      checkOut: format(new Date(), 'hh:mm a'),
      status: 'checked_out',
    };
    return { ...todayStatus };
  },

  getHistory: async (params = {}) => {
    await delay(400);
    let data = [...attendanceHistory];
    if (params.month) data = data.filter(r => r.date.startsWith(params.month));
    if (params.status && params.status !== 'all') data = data.filter(r => r.status === params.status);
    return { data, total: data.length };
  },

  getCalendar: async (month) => {
    await delay(300);
    const data = attendanceHistory.filter(r => r.date.startsWith(month));
    return data;
  },

  getStats: async () => {
    await delay(300);
    const total = attendanceHistory.length;
    const present = attendanceHistory.filter(r => r.status === 'present').length;
    const absent  = attendanceHistory.filter(r => r.status === 'absent').length;
    const leave   = attendanceHistory.filter(r => r.status === 'leave').length;
    return { total, present, absent, leave, percentage: total ? Math.round((present / total) * 100) : 0 };
  },
};
