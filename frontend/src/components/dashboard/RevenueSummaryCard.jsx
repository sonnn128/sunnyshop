import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Building2 } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PERIOD_LABELS = {
  day: 'hôm nay',
  week: 'tuần này',
  month: 'tháng này'
};
const PAYMENT_METHODS = [{
  key: 'cash',
  label: 'Tiền mặt',
  icon: Wallet,
  color: 'text-green-500 bg-green-500/10'
}, {
  key: 'bankTransfer',
  label: 'Chuyển khoản',
  icon: Building2,
  color: 'text-blue-500 bg-blue-500/10'
}, {
  key: 'momo',
  label: 'MoMo',
  icon: CreditCard,
  color: 'text-pink-500 bg-pink-500/10'
}, {
  key: 'card',
  label: 'Thẻ',
  icon: CreditCard,
  color: 'text-purple-500 bg-purple-500/10'
}];
function getChangePercent(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return (current - previous) / previous * 100;
}
export function RevenueSummaryCard({
  totalRevenue,
  previousRevenue,
  period = 'day',
  paymentBreakdown,
  pendingAmount = 0,
  refundedAmount = 0
}) {
  const change = previousRevenue !== undefined ? getChangePercent(totalRevenue, previousRevenue) : undefined;
  const isPositive = change !== undefined && change >= 0;
  return /*#__PURE__*/_jsxs("div", {
    className: "bg-background-secondary rounded-xl border border-border overflow-hidden",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "p-6 bg-gradient-to-br from-primary-500/10 to-primary-600/5",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mb-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center",
            children: /*#__PURE__*/_jsx(DollarSign, {
              className: "w-6 h-6 text-primary-500"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("p", {
              className: "text-sm text-foreground-secondary",
              children: ["Doanh thu ", PERIOD_LABELS[period]]
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-3xl font-bold text-foreground",
              children: formatCurrency(totalRevenue)
            })]
          })]
        }), change !== undefined && /*#__PURE__*/_jsxs("div", {
          className: cn('flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium', isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'),
          children: [isPositive ? /*#__PURE__*/_jsx(TrendingUp, {
            className: "w-4 h-4"
          }) : /*#__PURE__*/_jsx(TrendingDown, {
            className: "w-4 h-4"
          }), isPositive ? '+' : '', change.toFixed(1), "%"]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-2 gap-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "bg-background-tertiary/50 backdrop-blur rounded-lg p-3",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-xs text-foreground-muted",
            children: "Ch\u1EDD thanh to\xE1n"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-lg font-semibold text-yellow-500",
            children: formatCurrency(pendingAmount)
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-background-tertiary/50 backdrop-blur rounded-lg p-3",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-xs text-foreground-muted",
            children: "Ho\xE0n ti\u1EC1n"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-lg font-semibold text-red-500",
            children: formatCurrency(refundedAmount)
          })]
        })]
      })]
    }), paymentBreakdown && /*#__PURE__*/_jsxs("div", {
      className: "p-4 border-t border-border",
      children: [/*#__PURE__*/_jsx("h4", {
        className: "text-sm font-medium text-foreground-secondary mb-3",
        children: "Ph\u01B0\u01A1ng th\u1EE9c thanh to\xE1n"
      }), /*#__PURE__*/_jsx("div", {
        className: "space-y-3",
        children: PAYMENT_METHODS.map(method => {
          const amount = paymentBreakdown[method.key] || 0;
          const percent = totalRevenue > 0 ? amount / totalRevenue * 100 : 0;
          const Icon = method.icon;
          return /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between mb-1",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2",
                children: [/*#__PURE__*/_jsx("div", {
                  className: cn('w-6 h-6 rounded flex items-center justify-center', method.color),
                  children: /*#__PURE__*/_jsx(Icon, {
                    className: "w-3 h-3"
                  })
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-sm text-foreground",
                  children: method.label
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "text-right",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-sm font-medium text-foreground",
                  children: formatCurrency(amount)
                }), /*#__PURE__*/_jsxs("span", {
                  className: "text-xs text-foreground-muted ml-2",
                  children: ["(", percent.toFixed(0), "%)"]
                })]
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "h-1.5 bg-background-tertiary rounded-full overflow-hidden",
              children: /*#__PURE__*/_jsx("div", {
                className: cn('h-full rounded-full transition-all', method.color.replace('text-', 'bg-').replace('/10', '')),
                style: {
                  width: `${percent}%`
                }
              })
            })]
          }, method.key);
        })
      })]
    })]
  });
}