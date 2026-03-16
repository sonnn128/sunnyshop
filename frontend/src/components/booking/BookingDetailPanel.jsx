import { X, User, Phone, Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, Play, AlertCircle, Repeat, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function getStatusConfig(status) {
  switch (status) {
    case 'CONFIRMED':
      return {
        label: 'Đã xác nhận',
        color: 'text-blue-400 bg-blue-500/20',
        icon: CheckCircle
      };
    case 'IN_PROGRESS':
      return {
        label: 'Đang chơi',
        color: 'text-green-400 bg-green-500/20',
        icon: Play
      };
    case 'PENDING':
      return {
        label: 'Chờ xác nhận',
        color: 'text-yellow-400 bg-yellow-500/20',
        icon: AlertCircle
      };
    case 'COMPLETED':
      return {
        label: 'Hoàn thành',
        color: 'text-gray-400 bg-gray-500/20',
        icon: CheckCircle
      };
    case 'CANCELLED':
      return {
        label: 'Đã hủy',
        color: 'text-red-400 bg-red-500/20',
        icon: XCircle
      };
    default:
      return {
        label: status,
        color: 'text-gray-400 bg-gray-500/20',
        icon: AlertCircle
      };
  }
}
export function BookingDetailPanel({
  booking,
  isOpen,
  onClose,
  onCheckIn,
  onCheckOut,
  onCancel,
  onEdit,
  isLoading = false
}) {
  if (!booking) return null;
  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;
  const canCheckIn = booking.status === 'CONFIRMED' || booking.status === 'PENDING';
  const canCheckOut = booking.status === 'IN_PROGRESS';
  const canCancel = booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED';
  const canEdit = booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && booking.status !== 'IN_PROGRESS';
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      className: cn('fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity', isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'),
      onClick: onClose
    }), /*#__PURE__*/_jsxs("div", {
      className: cn('fixed right-0 top-0 h-full w-full max-w-md bg-background-secondary border-l border-border z-50 transition-transform duration-300 overflow-y-auto', isOpen ? 'translate-x-0' : 'translate-x-full'),
      children: [/*#__PURE__*/_jsxs("div", {
        className: "sticky top-0 bg-background-secondary z-10 flex items-center justify-between p-4 border-b border-border",
        children: [/*#__PURE__*/_jsx("h2", {
          className: "text-lg font-semibold text-foreground",
          children: "Chi ti\u1EBFt \u0111\u1EB7t s\xE2n"
        }), /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "p-1 rounded-lg hover:bg-background-tertiary transition-colors",
          children: /*#__PURE__*/_jsx(X, {
            className: "w-5 h-5 text-foreground-secondary"
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-4 space-y-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: cn('flex items-center gap-2 px-3 py-2 rounded-lg w-fit', statusConfig.color),
          children: [/*#__PURE__*/_jsx(StatusIcon, {
            className: "w-4 h-4"
          }), /*#__PURE__*/_jsx("span", {
            className: "font-medium",
            children: statusConfig.label
          })]
        }), booking.isRecurring && /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-400 w-fit",
          children: [/*#__PURE__*/_jsx(Repeat, {
            className: "w-4 h-4"
          }), /*#__PURE__*/_jsx("span", {
            className: "text-sm font-medium",
            children: "L\u1ECBch c\u1ED1 \u0111\u1ECBnh"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-background-tertiary rounded-xl p-4",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-sm font-medium text-foreground-secondary mb-3",
            children: "Th\xF4ng tin kh\xE1ch h\xE0ng"
          }), booking.customer ? /*#__PURE__*/_jsxs("div", {
            className: "flex items-start gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center",
              children: /*#__PURE__*/_jsx("span", {
                className: "text-primary-500 font-semibold text-lg",
                children: booking.customer.name.charAt(0)
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("p", {
                className: "font-semibold text-foreground",
                children: booking.customer.name
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1 text-sm text-foreground-secondary mt-1",
                children: [/*#__PURE__*/_jsx(Phone, {
                  className: "w-3 h-3"
                }), booking.customer.phone]
              }), booking.customer.membershipTier && /*#__PURE__*/_jsx("span", {
                className: cn('inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium', booking.customer.membershipTier === 'PLATINUM' ? 'bg-purple-500/20 text-purple-400' : booking.customer.membershipTier === 'GOLD' ? 'bg-yellow-500/20 text-yellow-400' : booking.customer.membershipTier === 'SILVER' ? 'bg-gray-400/20 text-gray-300' : 'bg-orange-500/20 text-orange-400'),
                children: booking.customer.membershipTier
              })]
            })]
          }) : /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3 text-foreground-secondary",
            children: [/*#__PURE__*/_jsx(User, {
              className: "w-5 h-5"
            }), /*#__PURE__*/_jsx("span", {
              children: "Kh\xE1ch v\xE3ng lai"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-3",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-sm font-medium text-foreground-secondary",
            children: "Chi ti\u1EBFt \u0111\u1EB7t s\xE2n"
          }), /*#__PURE__*/_jsxs("div", {
            className: "bg-background-tertiary rounded-xl divide-y divide-border",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 p-3",
              children: [/*#__PURE__*/_jsx(MapPin, {
                className: "w-5 h-5 text-foreground-muted"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-sm text-foreground-secondary",
                  children: "S\xE2n"
                }), /*#__PURE__*/_jsx("p", {
                  className: "font-medium text-foreground",
                  children: booking.court?.name
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 p-3",
              children: [/*#__PURE__*/_jsx(Calendar, {
                className: "w-5 h-5 text-foreground-muted"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-sm text-foreground-secondary",
                  children: "Ng\xE0y"
                }), /*#__PURE__*/_jsx("p", {
                  className: "font-medium text-foreground",
                  children: formatDate(booking.date)
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 p-3",
              children: [/*#__PURE__*/_jsx(Clock, {
                className: "w-5 h-5 text-foreground-muted"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-sm text-foreground-secondary",
                  children: "Gi\u1EDD"
                }), /*#__PURE__*/_jsxs("p", {
                  className: "font-medium text-foreground",
                  children: [booking.startTime, " - ", booking.endTime]
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 p-3",
              children: [/*#__PURE__*/_jsx(DollarSign, {
                className: "w-5 h-5 text-foreground-muted"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-sm text-foreground-secondary",
                  children: "Th\xE0nh ti\u1EC1n"
                }), /*#__PURE__*/_jsx("p", {
                  className: "font-semibold text-primary-500 text-lg",
                  children: formatCurrency(booking.totalAmount)
                })]
              })]
            })]
          })]
        }), booking.notes && /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-sm font-medium text-foreground-secondary mb-2",
            children: "Ghi ch\xFA"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-foreground bg-background-tertiary rounded-lg p-3",
            children: booking.notes
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-sm font-medium text-foreground-secondary mb-3",
            children: "L\u1ECBch s\u1EED"
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-2 h-2 rounded-full bg-green-500"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-sm text-foreground-secondary",
                children: ["T\u1EA1o l\xFAc ", new Date(booking.createdAt).toLocaleString('vi-VN')]
              })]
            }), booking.checkedInAt && /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-2 h-2 rounded-full bg-blue-500"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-sm text-foreground-secondary",
                children: ["Check-in l\xFAc ", new Date(booking.checkedInAt).toLocaleString('vi-VN')]
              })]
            }), booking.checkedOutAt && /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-2 h-2 rounded-full bg-gray-500"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-sm text-foreground-secondary",
                children: ["Check-out l\xFAc ", new Date(booking.checkedOutAt).toLocaleString('vi-VN')]
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-2 pt-4 border-t border-border",
          children: [canCheckIn && /*#__PURE__*/_jsxs(Button, {
            className: "w-full",
            onClick: () => onCheckIn(booking.id),
            isLoading: isLoading,
            children: [/*#__PURE__*/_jsx(CheckCircle, {
              className: "w-4 h-4 mr-2"
            }), "Check-in"]
          }), canCheckOut && /*#__PURE__*/_jsxs(Button, {
            className: "w-full",
            onClick: () => onCheckOut(booking.id),
            isLoading: isLoading,
            children: [/*#__PURE__*/_jsx(CheckCircle, {
              className: "w-4 h-4 mr-2"
            }), "Check-out & Thanh to\xE1n"]
          }), canEdit && onEdit && /*#__PURE__*/_jsxs(Button, {
            variant: "secondary",
            className: "w-full",
            onClick: () => onEdit(booking),
            children: [/*#__PURE__*/_jsx(Pencil, {
              className: "w-4 h-4 mr-2"
            }), "Ch\u1EC9nh s\u1EEDa"]
          }), canCancel && /*#__PURE__*/_jsxs(Button, {
            variant: "destructive",
            className: "w-full",
            onClick: () => onCancel(booking.id),
            isLoading: isLoading,
            children: [/*#__PURE__*/_jsx(XCircle, {
              className: "w-4 h-4 mr-2"
            }), "H\u1EE7y \u0111\u1EB7t s\xE2n"]
          })]
        })]
      })]
    })]
  });
}