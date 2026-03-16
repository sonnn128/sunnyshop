import { Activity, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const STATUS_CONFIG = {
  available: {
    label: 'Trống',
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-500',
    pulseColor: 'bg-green-500'
  },
  occupied: {
    label: 'Đang chơi',
    icon: Activity,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-500',
    pulseColor: 'bg-blue-500'
  },
  maintenance: {
    label: 'Bảo trì',
    icon: AlertTriangle,
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-500',
    pulseColor: 'bg-orange-500'
  },
  reserved: {
    label: 'Đã đặt',
    icon: Clock,
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-500',
    pulseColor: 'bg-purple-500'
  }
};
function formatTimeRemaining(minutes) {
  if (minutes < 60) {
    return `${minutes} phút nữa`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m nữa` : `${hours} giờ nữa`;
}
export function CourtStatusGrid({
  courts,
  onCourtClick
}) {
  return /*#__PURE__*/_jsx("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    children: courts.map(court => {
      const config = STATUS_CONFIG[court.status];
      const StatusIcon = config.icon;
      return /*#__PURE__*/_jsxs("button", {
        onClick: () => onCourtClick?.(court.id),
        className: cn('relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg hover:scale-[1.02]', config.bgColor, config.borderColor),
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute top-3 right-3 flex items-center gap-1",
          children: court.status === 'occupied' && /*#__PURE__*/_jsxs("span", {
            className: "relative flex h-3 w-3",
            children: [/*#__PURE__*/_jsx("span", {
              className: cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.pulseColor)
            }), /*#__PURE__*/_jsx("span", {
              className: cn('relative inline-flex rounded-full h-3 w-3', config.pulseColor)
            })]
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3 mb-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold', config.bgColor, config.textColor),
            children: court.name.replace(/[^0-9]/g, '') || '?'
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-semibold text-foreground",
              children: court.name
            }), /*#__PURE__*/_jsxs("span", {
              className: cn('inline-flex items-center gap-1 text-sm font-medium', config.textColor),
              children: [/*#__PURE__*/_jsx(StatusIcon, {
                className: "w-4 h-4"
              }), config.label]
            })]
          })]
        }), court.status === 'occupied' && court.currentBooking && /*#__PURE__*/_jsxs("div", {
          className: "p-3 bg-background-tertiary rounded-lg mb-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 text-sm",
            children: [/*#__PURE__*/_jsx(Users, {
              className: "w-4 h-4 text-foreground-muted"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-foreground font-medium truncate",
              children: court.currentBooking.customerName
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mt-1 text-xs text-foreground-secondary",
            children: [/*#__PURE__*/_jsx(Clock, {
              className: "w-3 h-3"
            }), /*#__PURE__*/_jsxs("span", {
              children: [court.currentBooking.startTime, " - ", court.currentBooking.endTime]
            })]
          }), court.currentBooking.remainingMinutes !== undefined && /*#__PURE__*/_jsxs("div", {
            className: "mt-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex justify-between text-xs mb-1",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-foreground-muted",
                children: "C\xF2n l\u1EA1i"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-blue-500 font-medium",
                children: formatTimeRemaining(court.currentBooking.remainingMinutes)
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "h-1.5 bg-background-tertiary rounded-full overflow-hidden",
              children: /*#__PURE__*/_jsx("div", {
                className: "h-full bg-blue-500 rounded-full transition-all",
                style: {
                  width: `${Math.max(10, court.currentBooking.remainingMinutes / 60 * 100)}%`
                }
              })
            })]
          })]
        }), court.nextBooking && court.status !== 'occupied' && /*#__PURE__*/_jsxs("div", {
          className: "p-3 bg-background-tertiary rounded-lg mb-3",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-xs text-foreground-muted mb-1",
            children: "L\u1ECBch ti\u1EBFp theo"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 text-sm",
            children: [/*#__PURE__*/_jsx(Clock, {
              className: "w-4 h-4 text-foreground-muted"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-foreground",
              children: court.nextBooking.startTime
            }), /*#__PURE__*/_jsx("span", {
              className: "text-foreground-secondary",
              children: "-"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-foreground truncate",
              children: court.nextBooking.customerName
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between pt-3 border-t border-border/50",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "text-center",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-lg font-bold text-foreground",
              children: court.todayBookingsCount ?? 0
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-foreground-muted",
              children: "l\u01B0\u1EE3t h\xF4m nay"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-center",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-lg font-bold text-primary-500",
              children: formatCurrency(court.todayRevenue ?? 0)
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-foreground-muted",
              children: "doanh thu"
            })]
          })]
        })]
      }, court.id);
    })
  });
}

// Single court card for compact views
export function CourtStatusCard({
  court,
  onClick
}) {
  const config = STATUS_CONFIG[court.status];
  const StatusIcon = config.icon;
  return /*#__PURE__*/_jsxs("button", {
    onClick: onClick,
    className: cn('flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-md', config.bgColor, config.borderColor),
    children: [/*#__PURE__*/_jsx("div", {
      className: cn('w-10 h-10 rounded-lg flex items-center justify-center font-bold', config.textColor),
      children: court.name.replace(/[^0-9]/g, '') || '?'
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex-1 text-left min-w-0",
      children: [/*#__PURE__*/_jsx("p", {
        className: "font-medium text-foreground truncate",
        children: court.name
      }), /*#__PURE__*/_jsxs("span", {
        className: cn('inline-flex items-center gap-1 text-xs', config.textColor),
        children: [/*#__PURE__*/_jsx(StatusIcon, {
          className: "w-3 h-3"
        }), config.label]
      })]
    }), court.status === 'occupied' && /*#__PURE__*/_jsxs("span", {
      className: "relative flex h-2 w-2",
      children: [/*#__PURE__*/_jsx("span", {
        className: cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.pulseColor)
      }), /*#__PURE__*/_jsx("span", {
        className: cn('relative inline-flex rounded-full h-2 w-2', config.pulseColor)
      })]
    })]
  });
}