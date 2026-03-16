import { Activity, Users, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function formatStatValue(value, format) {
  if (typeof value === 'string') return value;
  if (format === 'currency') return formatCurrency(value);
  if (format === 'time') {
    const hours = Math.floor(value / 60);
    const mins = value % 60;
    return `${hours}h ${mins}m`;
  }
  return value.toLocaleString('vi-VN');
}
export function LiveStatsBar({
  stats,
  compact = false
}) {
  return /*#__PURE__*/_jsx("div", {
    className: cn('grid gap-4', compact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'),
    children: stats.map(stat => {
      const Icon = stat.icon;
      return /*#__PURE__*/_jsxs("div", {
        className: cn('relative bg-background-secondary rounded-xl border border-border p-4 transition-all hover:shadow-md', stat.pulse && 'ring-2 ring-green-500/20 animate-pulse'),
        children: [stat.pulse && /*#__PURE__*/_jsxs("div", {
          className: "absolute top-2 right-2 flex items-center gap-1",
          children: [/*#__PURE__*/_jsx("span", {
            className: "w-2 h-2 bg-green-500 rounded-full animate-ping"
          }), /*#__PURE__*/_jsx("span", {
            className: "w-2 h-2 bg-green-500 rounded-full absolute"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', stat.color),
            children: /*#__PURE__*/_jsx(Icon, {
              className: "w-5 h-5"
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "min-w-0",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-sm text-foreground-secondary truncate",
              children: stat.label
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xl font-bold text-foreground",
              children: formatStatValue(stat.value, stat.format)
            })]
          })]
        }), stat.change !== undefined && /*#__PURE__*/_jsxs("div", {
          className: cn('mt-2 flex items-center gap-1 text-xs font-medium', stat.change >= 0 ? 'text-green-500' : 'text-red-500'),
          children: [/*#__PURE__*/_jsx(TrendingUp, {
            className: cn('w-3 h-3', stat.change < 0 && 'rotate-180')
          }), /*#__PURE__*/_jsxs("span", {
            children: [stat.change >= 0 ? '+' : '', stat.change, "% so v\u1EDBi h\xF4m qua"]
          })]
        })]
      }, stat.id);
    })
  });
}

// Presets for common dashboard stats
export function useDashboardStats(data) {
  return [{
    id: 'active',
    label: 'Đang chơi',
    value: data?.activeBookings ?? 0,
    icon: Activity,
    color: 'bg-green-500/20 text-green-500',
    pulse: (data?.activeBookings ?? 0) > 0
  }, {
    id: 'today',
    label: 'Lịch đặt hôm nay',
    value: data?.todayBookings ?? 0,
    icon: Calendar,
    color: 'bg-blue-500/20 text-blue-500'
  }, {
    id: 'customers',
    label: 'Khách mới hôm nay',
    value: data?.newCustomers ?? 0,
    icon: Users,
    color: 'bg-purple-500/20 text-purple-500'
  }, {
    id: 'revenue',
    label: 'Doanh thu hôm nay',
    value: data?.todayRevenue ?? 0,
    format: 'currency',
    icon: DollarSign,
    color: 'bg-yellow-500/20 text-yellow-500'
  }, {
    id: 'usage',
    label: 'Thời gian sử dụng',
    value: data?.courtUsageMinutes ?? 0,
    format: 'time',
    icon: Clock,
    color: 'bg-cyan-500/20 text-cyan-500'
  }, {
    id: 'pending',
    label: 'Chờ thanh toán',
    value: data?.pendingPayments ?? 0,
    icon: DollarSign,
    color: 'bg-orange-500/20 text-orange-500'
  }];
}