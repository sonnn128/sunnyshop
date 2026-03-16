import { Calendar, Clock, MapPin, User, DollarSign, CheckCircle, XCircle, Play, AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getStatusConfig(status) {
  switch (status) {
    case 'CONFIRMED':
      return {
        label: 'Đã xác nhận',
        color: 'bg-blue-500/20 text-blue-400',
        icon: CheckCircle
      };
    case 'IN_PROGRESS':
      return {
        label: 'Đang chơi',
        color: 'bg-green-500/20 text-green-400',
        icon: Play
      };
    case 'PENDING':
      return {
        label: 'Chờ xác nhận',
        color: 'bg-yellow-500/20 text-yellow-400',
        icon: AlertCircle
      };
    case 'COMPLETED':
      return {
        label: 'Hoàn thành',
        color: 'bg-gray-500/20 text-gray-400',
        icon: CheckCircle
      };
    case 'CANCELLED':
      return {
        label: 'Đã hủy',
        color: 'bg-red-500/20 text-red-400',
        icon: XCircle
      };
    default:
      return {
        label: status,
        color: 'bg-gray-500/20 text-gray-400',
        icon: AlertCircle
      };
  }
}
export function ListView({
  bookings,
  onBookingClick
}) {
  // Group bookings by time
  const sortedBookings = [...bookings].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  if (sortedBookings.length === 0) {
    return /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col items-center justify-center py-16 text-foreground-secondary",
      children: [/*#__PURE__*/_jsx(Calendar, {
        className: "w-12 h-12 mb-4 opacity-50"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-lg font-medium",
        children: "Kh\xF4ng c\xF3 l\u1ECBch \u0111\u1EB7t"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm",
        children: "Ch\u01B0a c\xF3 l\u1ECBch \u0111\u1EB7t n\xE0o trong ng\xE0y n\xE0y"
      })]
    });
  }
  return /*#__PURE__*/_jsx("div", {
    className: "space-y-3 p-4",
    children: sortedBookings.map(booking => {
      const statusConfig = getStatusConfig(booking.status);
      const StatusIcon = statusConfig.icon;
      return /*#__PURE__*/_jsxs("div", {
        onClick: () => onBookingClick(booking),
        className: "bg-background-tertiary hover:bg-background-hover rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg border border-transparent hover:border-border",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-start justify-between gap-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex-1 min-w-0",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 mb-2",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1 text-lg font-semibold text-foreground",
                children: [/*#__PURE__*/_jsx(Clock, {
                  className: "w-4 h-4 text-foreground-muted"
                }), /*#__PURE__*/_jsxs("span", {
                  children: [booking.startTime, " - ", booking.endTime]
                })]
              }), /*#__PURE__*/_jsxs("span", {
                className: cn('flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', statusConfig.color),
                children: [/*#__PURE__*/_jsx(StatusIcon, {
                  className: "w-3 h-3"
                }), statusConfig.label]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 text-sm text-foreground-secondary mb-2",
              children: [/*#__PURE__*/_jsx(MapPin, {
                className: "w-4 h-4"
              }), /*#__PURE__*/_jsx("span", {
                children: booking.court?.name
              })]
            }), booking.customer ? /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 text-sm",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center",
                children: /*#__PURE__*/_jsx("span", {
                  className: "text-primary-500 text-xs font-medium",
                  children: booking.customer.name.charAt(0)
                })
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground",
                children: booking.customer.name
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground-muted",
                children: "\u2022"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground-secondary",
                children: booking.customer.phone
              })]
            }) : /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 text-sm text-foreground-secondary",
              children: [/*#__PURE__*/_jsx(User, {
                className: "w-4 h-4"
              }), /*#__PURE__*/_jsx("span", {
                children: "Kh\xE1ch v\xE3ng lai"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-right",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-1 text-lg font-bold text-primary-500",
              children: [/*#__PURE__*/_jsx(DollarSign, {
                className: "w-4 h-4"
              }), formatCurrency(booking.totalAmount)]
            }), booking.isRecurring && /*#__PURE__*/_jsx("span", {
              className: "text-xs text-purple-400",
              children: "L\u1ECBch c\u1ED1 \u0111\u1ECBnh"
            })]
          })]
        }), booking.notes && /*#__PURE__*/_jsx("p", {
          className: "mt-2 text-sm text-foreground-secondary italic line-clamp-1",
          children: booking.notes
        })]
      }, booking.id);
    })
  });
}