import { TrendingUp, TrendingDown, Minus, Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function formatValue(value, format) {
  if (format === 'currency') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  }
  if (format === 'percent') {
    return `${value.toFixed(1)}%`;
  }
  return value.toLocaleString('vi-VN');
}
function getChangePercent(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return (current - previous) / previous * 100;
}
function getChangeIcon(change) {
  if (change > 0) return TrendingUp;
  if (change < 0) return TrendingDown;
  return Minus;
}
function getChangeColor(change) {
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-foreground-muted';
}
function getChangeBg(change) {
  if (change > 0) return 'bg-green-500/10';
  if (change < 0) return 'bg-red-500/10';
  return 'bg-foreground-muted/10';
}
const PERIOD_LABELS = {
  day: {
    current: 'Hôm nay',
    previous: 'Hôm qua'
  },
  week: {
    current: 'Tuần này',
    previous: 'Tuần trước'
  },
  month: {
    current: 'Tháng này',
    previous: 'Tháng trước'
  }
};
const STAT_ICONS = {
  'Doanh thu': DollarSign,
  'Lịch đặt': Calendar,
  'Khách hàng mới': Users,
  'Giờ sử dụng': Clock
};
export function PeriodComparison({
  title,
  subtitle,
  data,
  period = 'day',
  onPeriodChange
}) {
  const periodLabels = PERIOD_LABELS[period];
  return /*#__PURE__*/_jsxs("div", {
    className: "bg-background-secondary rounded-xl border border-border p-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h3", {
          className: "text-lg font-semibold text-foreground",
          children: title
        }), subtitle && /*#__PURE__*/_jsx("p", {
          className: "text-sm text-foreground-secondary",
          children: subtitle
        })]
      }), onPeriodChange && /*#__PURE__*/_jsx("div", {
        className: "flex bg-background-tertiary rounded-lg p-1",
        children: ['day', 'week', 'month'].map(p => /*#__PURE__*/_jsx("button", {
          onClick: () => onPeriodChange(p),
          className: cn('px-3 py-1.5 text-sm rounded-md transition-colors', period === p ? 'bg-primary-500 text-white' : 'text-foreground-secondary hover:text-foreground'),
          children: p === 'day' ? 'Ngày' : p === 'week' ? 'Tuần' : 'Tháng'
        }, p))
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
      children: data.map((item, idx) => {
        const change = getChangePercent(item.current, item.previous);
        const ChangeIcon = getChangeIcon(change);
        const StatIcon = STAT_ICONS[item.label] || Calendar;
        return /*#__PURE__*/_jsxs("div", {
          className: "bg-background-tertiary rounded-xl p-4 transition-all hover:shadow-md",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center",
              children: /*#__PURE__*/_jsx(StatIcon, {
                className: "w-4 h-4 text-primary-500"
              })
            }), /*#__PURE__*/_jsx("span", {
              className: "text-sm text-foreground-secondary",
              children: item.label
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "text-2xl font-bold text-foreground mb-2",
            children: formatValue(item.current, item.format)
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsxs("span", {
              className: cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', getChangeBg(change), getChangeColor(change)),
              children: [/*#__PURE__*/_jsx(ChangeIcon, {
                className: "w-3 h-3"
              }), change > 0 ? '+' : '', change.toFixed(1), "%"]
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-xs text-foreground-muted",
              children: ["vs ", periodLabels.previous]
            })]
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-xs text-foreground-muted mt-1",
            children: [periodLabels.previous, ": ", formatValue(item.previous, item.format)]
          })]
        }, idx);
      })
    })]
  });
}