import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import api from '@/services/api';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getStatusConfig(status) {
  switch (status) {
    case 'CONFIRMED':
      return {
        label: 'Đã xác nhận',
        color: 'bg-blue-500/20 text-blue-400'
      };
    case 'IN_PROGRESS':
      return {
        label: 'Đang chơi',
        color: 'bg-green-500/20 text-green-400'
      };
    case 'PENDING':
      return {
        label: 'Chờ xác nhận',
        color: 'bg-yellow-500/20 text-yellow-400'
      };
    case 'COMPLETED':
      return {
        label: 'Hoàn thành',
        color: 'bg-gray-500/20 text-gray-400'
      };
    case 'CANCELLED':
      return {
        label: 'Đã hủy',
        color: 'bg-red-500/20 text-red-400'
      };
    case 'NO_SHOW':
      return {
        label: 'Không đến',
        color: 'bg-orange-500/20 text-orange-400'
      };
    default:
      return {
        label: status,
        color: 'bg-gray-500/20 text-gray-400'
      };
  }
}
export function CustomerBookingHistory({
  customerId,
  limit = 10
}) {
  const {
    data: bookings,
    isLoading,
    error
  } = useQuery({
    queryKey: ['customer-bookings', customerId],
    queryFn: async () => {
      const response = await api.get(`/bookings?customerId=${customerId}&limit=${limit}&sort=date:desc`);
      return response.data.data || [];
    },
    enabled: !!customerId
  });
  if (isLoading) {
    return /*#__PURE__*/_jsx("div", {
      className: "space-y-3",
      children: [...Array(3)].map((_, i) => /*#__PURE__*/_jsx("div", {
        className: "h-20 bg-background-tertiary rounded-lg animate-pulse"
      }, i))
    });
  }
  if (error) {
    return /*#__PURE__*/_jsxs("div", {
      className: "text-center py-8 text-foreground-muted",
      children: [/*#__PURE__*/_jsx(AlertCircle, {
        className: "w-8 h-8 mx-auto mb-2 opacity-50"
      }), /*#__PURE__*/_jsx("p", {
        children: "Kh\xF4ng th\u1EC3 t\u1EA3i l\u1ECBch s\u1EED \u0111\u1EB7t s\xE2n"
      })]
    });
  }
  if (!bookings || bookings.length === 0) {
    return /*#__PURE__*/_jsxs("div", {
      className: "text-center py-8 text-foreground-muted",
      children: [/*#__PURE__*/_jsx(Calendar, {
        className: "w-8 h-8 mx-auto mb-2 opacity-50"
      }), /*#__PURE__*/_jsx("p", {
        children: "Ch\u01B0a c\xF3 l\u1ECBch s\u1EED \u0111\u1EB7t s\xE2n"
      })]
    });
  }
  return /*#__PURE__*/_jsx("div", {
    className: "space-y-3",
    children: bookings.map(booking => {
      const statusConfig = getStatusConfig(booking.status);
      return /*#__PURE__*/_jsx("div", {
        className: "bg-background-tertiary rounded-lg p-4 hover:bg-background-hover transition-colors",
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-start justify-between gap-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex-1 min-w-0",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 mb-2",
              children: [/*#__PURE__*/_jsx("span", {
                className: "font-medium text-foreground",
                children: formatDate(booking.date)
              }), /*#__PURE__*/_jsx("span", {
                className: cn('text-xs px-2 py-0.5 rounded-full font-medium', statusConfig.color),
                children: statusConfig.label
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground-secondary",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(Clock, {
                  className: "w-3.5 h-3.5"
                }), /*#__PURE__*/_jsxs("span", {
                  children: [booking.startTime, " - ", booking.endTime]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(MapPin, {
                  className: "w-3.5 h-3.5"
                }), /*#__PURE__*/_jsx("span", {
                  children: booking.court?.name
                })]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-right",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-1 font-semibold text-primary-500",
              children: [/*#__PURE__*/_jsx(DollarSign, {
                className: "w-4 h-4"
              }), /*#__PURE__*/_jsx("span", {
                children: formatCurrency(booking.totalAmount)
              })]
            }), booking.status === 'COMPLETED' && /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-1 text-xs text-success mt-1",
              children: [/*#__PURE__*/_jsx(CheckCircle, {
                className: "w-3 h-3"
              }), /*#__PURE__*/_jsx("span", {
                children: "\u0110\xE3 thanh to\xE1n"
              })]
            }), booking.status === 'CANCELLED' && /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-1 text-xs text-error mt-1",
              children: [/*#__PURE__*/_jsx(XCircle, {
                className: "w-3 h-3"
              }), /*#__PURE__*/_jsx("span", {
                children: "\u0110\xE3 h\u1EE7y"
              })]
            })]
          })]
        })
      }, booking.id);
    })
  });
}