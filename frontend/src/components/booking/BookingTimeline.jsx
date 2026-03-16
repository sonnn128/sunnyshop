import { Clock, User, MapPin, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const STATUS_CONFIG = {
  'upcoming': {
    label: 'Sắp tới',
    icon: Clock,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    dotColor: 'bg-blue-500'
  },
  'in-progress': {
    label: 'Đang chơi',
    icon: AlertCircle,
    color: 'text-green-500 bg-green-500/10 border-green-500/30',
    dotColor: 'bg-green-500 animate-pulse'
  },
  'completed': {
    label: 'Hoàn thành',
    icon: CheckCircle,
    color: 'text-foreground-muted bg-background-tertiary border-border',
    dotColor: 'bg-foreground-muted'
  },
  'cancelled': {
    label: 'Đã hủy',
    icon: XCircle,
    color: 'text-red-500 bg-red-500/10 border-red-500/30',
    dotColor: 'bg-red-500'
  },
  'no-show': {
    label: 'Vắng mặt',
    icon: XCircle,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    dotColor: 'bg-orange-500'
  }
};
export function BookingTimeline({
  bookings,
  onBookingClick,
  onCheckIn,
  showActions = true,
  maxItems
}) {
  const displayBookings = maxItems ? bookings.slice(0, maxItems) : bookings;
  if (bookings.length === 0) {
    return /*#__PURE__*/_jsxs("div", {
      className: "py-12 text-center",
      children: [/*#__PURE__*/_jsx(Clock, {
        className: "w-12 h-12 mx-auto mb-2 text-foreground-muted opacity-30"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-foreground-secondary",
        children: "Kh\xF4ng c\xF3 l\u1ECBch \u0111\u1EB7t"
      })]
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "relative",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute left-[19px] top-4 bottom-4 w-0.5 bg-border"
    }), /*#__PURE__*/_jsx("div", {
      className: "space-y-4",
      children: displayBookings.map(booking => {
        const config = STATUS_CONFIG[booking.status];
        const StatusIcon = config.icon;
        return /*#__PURE__*/_jsxs("div", {
          className: "relative flex gap-4",
          children: [/*#__PURE__*/_jsx("div", {
            className: "relative z-10 flex flex-col items-center",
            children: /*#__PURE__*/_jsx("div", {
              className: cn('w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background-secondary', booking.status === 'in-progress' ? 'border-green-500' : 'border-border'),
              children: /*#__PURE__*/_jsx("span", {
                className: cn('w-3 h-3 rounded-full', config.dotColor)
              })
            })
          }), /*#__PURE__*/_jsxs("button", {
            onClick: () => onBookingClick?.(booking.id),
            className: cn('flex-1 p-4 rounded-xl border text-left transition-all hover:shadow-md', config.color),
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-start justify-between gap-4",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex-1 min-w-0",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2 mb-2",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-lg font-bold",
                    children: booking.time
                  }), /*#__PURE__*/_jsx(ArrowRight, {
                    className: "w-4 h-4 opacity-50"
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-lg font-bold",
                    children: booking.endTime
                  }), booking.isRecurring && /*#__PURE__*/_jsx("span", {
                    className: "px-2 py-0.5 text-xs bg-purple-500/20 text-purple-500 rounded-full",
                    children: "C\u1ED1 \u0111\u1ECBnh"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2 mb-1",
                  children: [/*#__PURE__*/_jsx(User, {
                    className: "w-4 h-4 opacity-60"
                  }), /*#__PURE__*/_jsx("span", {
                    className: "font-medium truncate",
                    children: booking.customerName
                  }), booking.customerPhone && /*#__PURE__*/_jsxs("span", {
                    className: "text-sm opacity-60",
                    children: ["(", booking.customerPhone, ")"]
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx(MapPin, {
                    className: "w-4 h-4 opacity-60"
                  }), /*#__PURE__*/_jsx("span", {
                    children: booking.courtName
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "text-right shrink-0",
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-lg font-bold",
                  children: formatCurrency(booking.amount)
                }), /*#__PURE__*/_jsxs("span", {
                  className: cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1', config.color),
                  children: [/*#__PURE__*/_jsx(StatusIcon, {
                    className: "w-3 h-3"
                  }), config.label]
                })]
              })]
            }), showActions && booking.status === 'upcoming' && onCheckIn && /*#__PURE__*/_jsx("div", {
              className: "mt-3 pt-3 border-t border-current/10",
              children: /*#__PURE__*/_jsxs(Button, {
                size: "sm",
                className: "gap-1",
                onClick: e => {
                  e.stopPropagation();
                  onCheckIn(booking.id);
                },
                children: [/*#__PURE__*/_jsx(CheckCircle, {
                  className: "w-4 h-4"
                }), "Check-in"]
              })
            })]
          })]
        }, booking.id);
      })
    }), maxItems && bookings.length > maxItems && /*#__PURE__*/_jsx("div", {
      className: "mt-4 text-center",
      children: /*#__PURE__*/_jsxs(Button, {
        variant: "ghost",
        className: "gap-2",
        children: ["Xem th\xEAm ", bookings.length - maxItems, " l\u1ECBch \u0111\u1EB7t", /*#__PURE__*/_jsx(ArrowRight, {
          className: "w-4 h-4"
        })]
      })
    })]
  });
}