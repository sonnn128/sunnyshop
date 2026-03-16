import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
function getStatusColor(status) {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-blue-500/80 hover:bg-blue-500';
    case 'IN_PROGRESS':
      return 'bg-green-500/80 hover:bg-green-500';
    case 'PENDING':
      return 'bg-yellow-500/80 hover:bg-yellow-500';
    case 'COMPLETED':
      return 'bg-gray-500/80 hover:bg-gray-500';
    case 'CANCELLED':
      return 'bg-red-500/80 hover:bg-red-500';
    default:
      return 'bg-gray-500/80 hover:bg-gray-500';
  }
}
function formatDateShort(date) {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}
export function WeekView({
  weekStartDate,
  courts,
  bookings,
  onSlotClick,
  onBookingClick
}) {
  // Generate 7 days starting from weekStartDate
  const weekDays = useMemo(() => {
    return Array.from({
      length: 7
    }, (_, i) => {
      const date = new Date(weekStartDate);
      date.setDate(date.getDate() + i);
      return date;
    });
  }, [weekStartDate]);

  // Group bookings by date and court
  const bookingsByDateAndCourt = useMemo(() => {
    const map = {};
    bookings.forEach(booking => {
      const dateKey = new Date(booking.date).toISOString().split('T')[0];
      if (!map[dateKey]) map[dateKey] = {};
      if (!map[dateKey][booking.courtId]) map[dateKey][booking.courtId] = [];
      map[dateKey][booking.courtId].push(booking);
    });
    return map;
  }, [bookings]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return /*#__PURE__*/_jsxs("div", {
    className: "flex-1 overflow-auto",
    children: [courts.map(court => /*#__PURE__*/_jsxs("div", {
      className: "mb-6",
      children: [/*#__PURE__*/_jsx("div", {
        className: "sticky top-0 z-10 bg-background-secondary py-2 px-4 border-b border-border",
        children: /*#__PURE__*/_jsx("h3", {
          className: "font-semibold text-foreground",
          children: court.name
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "grid grid-cols-7 gap-1 p-2",
        children: weekDays.map((date, dayIdx) => {
          const dateKey = date.toISOString().split('T')[0];
          const dayBookings = bookingsByDateAndCourt[dateKey]?.[court.id] || [];
          const isToday = date.toDateString() === today.toDateString();
          return /*#__PURE__*/_jsxs("div", {
            className: cn('min-h-[120px] rounded-lg border border-border p-2', isToday ? 'bg-primary-500/10 border-primary-500/50' : 'bg-background-tertiary'),
            children: [/*#__PURE__*/_jsxs("div", {
              className: "text-center mb-2 pb-2 border-b border-border",
              children: [/*#__PURE__*/_jsx("div", {
                className: cn('text-xs font-medium', isToday ? 'text-primary-500' : 'text-foreground-muted'),
                children: WEEKDAYS[date.getDay()]
              }), /*#__PURE__*/_jsx("div", {
                className: cn('text-sm font-semibold', isToday ? 'text-primary-500' : 'text-foreground'),
                children: formatDateShort(date)
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "space-y-1",
              children: dayBookings.length === 0 ? /*#__PURE__*/_jsx("button", {
                onClick: () => onSlotClick(court.id, date, '08:00'),
                className: "w-full text-xs text-foreground-muted py-4 rounded hover:bg-background-hover transition-colors",
                children: "+ \u0110\u1EB7t s\xE2n"
              }) : dayBookings.map(booking => /*#__PURE__*/_jsxs("button", {
                onClick: () => onBookingClick(booking),
                className: cn('w-full text-left px-2 py-1 rounded text-xs text-white transition-colors', getStatusColor(booking.status)),
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "font-medium truncate",
                  children: [booking.startTime.slice(0, 5), " - ", booking.endTime.slice(0, 5)]
                }), /*#__PURE__*/_jsx("div", {
                  className: "truncate opacity-80",
                  children: booking.customer?.name || 'Khách vãng lai'
                })]
              }, booking.id))
            })]
          }, dayIdx);
        })
      })]
    }, court.id)), courts.length === 0 && /*#__PURE__*/_jsx("div", {
      className: "flex items-center justify-center h-64 text-foreground-secondary",
      children: "Ch\u01B0a c\xF3 s\xE2n n\xE0o \u0111\u01B0\u1EE3c thi\u1EBFt l\u1EADp"
    })]
  });
}