import { AlertTriangle, Package, TrendingDown, Bell, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function InventoryAlert({
  lowStockItems,
  onDismiss,
  onViewAll,
  onRestock
}) {
  if (lowStockItems.length === 0) {
    return null;
  }
  const criticalItems = lowStockItems.filter(item => item.currentStock === 0);
  const warningItems = lowStockItems.filter(item => item.currentStock > 0);
  return /*#__PURE__*/_jsxs("div", {
    className: "bg-background-secondary rounded-xl border border-border overflow-hidden",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between p-4 border-b border-border bg-orange-500/5",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center",
          children: /*#__PURE__*/_jsx(Bell, {
            className: "w-5 h-5 text-orange-500"
          })
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("h3", {
            className: "font-semibold text-foreground flex items-center gap-2",
            children: ["C\u1EA3nh b\xE1o t\u1ED3n kho", /*#__PURE__*/_jsx("span", {
              className: "bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full",
              children: lowStockItems.length
            })]
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-sm text-foreground-secondary",
            children: [criticalItems.length > 0 && /*#__PURE__*/_jsxs("span", {
              className: "text-red-500",
              children: [criticalItems.length, " h\u1EBFt h\xE0ng, "]
            }), warningItems.length, " s\u1EAFp h\u1EBFt"]
          })]
        })]
      }), onViewAll && /*#__PURE__*/_jsxs(Button, {
        variant: "ghost",
        size: "sm",
        onClick: onViewAll,
        className: "gap-1",
        children: ["Xem t\u1EA5t c\u1EA3", /*#__PURE__*/_jsx(ChevronRight, {
          className: "w-4 h-4"
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "divide-y divide-border max-h-72 overflow-auto",
      children: [criticalItems.map(item => /*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 transition-colors",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center",
            children: /*#__PURE__*/_jsx(AlertTriangle, {
              className: "w-5 h-5 text-red-500"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("p", {
              className: "font-medium text-foreground",
              children: item.name
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 text-sm",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-red-500 font-semibold",
                children: "H\u1EBFt h\xE0ng"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground-muted",
                children: "\u2022"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground-secondary",
                children: item.category
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [onRestock && /*#__PURE__*/_jsx(Button, {
            size: "sm",
            onClick: () => onRestock(item.id),
            children: "Nh\u1EADp h\xE0ng"
          }), onDismiss && /*#__PURE__*/_jsx("button", {
            onClick: () => onDismiss(item.id),
            className: "p-1 hover:bg-background-hover rounded",
            children: /*#__PURE__*/_jsx(X, {
              className: "w-4 h-4 text-foreground-muted"
            })
          })]
        })]
      }, item.id)), warningItems.map(item => {
        const stockPercent = item.currentStock / item.minStock * 100;
        return /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between p-4 hover:bg-background-hover transition-colors",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center",
              children: /*#__PURE__*/_jsx(TrendingDown, {
                className: "w-5 h-5 text-orange-500"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("p", {
                className: "font-medium text-foreground",
                children: item.name
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 text-sm",
                children: [/*#__PURE__*/_jsxs("span", {
                  className: cn('font-semibold', stockPercent < 50 ? 'text-orange-500' : 'text-yellow-500'),
                  children: ["C\xF2n ", item.currentStock, " ", item.unit]
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-foreground-muted",
                  children: "\u2022"
                }), /*#__PURE__*/_jsxs("span", {
                  className: "text-foreground-secondary",
                  children: ["T\u1ED1i thi\u1EC3u: ", item.minStock]
                })]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-20 h-2 bg-background-tertiary rounded-full overflow-hidden",
              children: /*#__PURE__*/_jsx("div", {
                className: cn('h-full rounded-full transition-all', stockPercent < 50 ? 'bg-orange-500' : 'bg-yellow-500'),
                style: {
                  width: `${Math.min(stockPercent, 100)}%`
                }
              })
            }), onDismiss && /*#__PURE__*/_jsx("button", {
              onClick: () => onDismiss(item.id),
              className: "p-1 hover:bg-background-hover rounded",
              children: /*#__PURE__*/_jsx(X, {
                className: "w-4 h-4 text-foreground-muted"
              })
            })]
          })]
        }, item.id);
      })]
    })]
  });
}

// Compact version for sidebar/dashboard
export function InventoryAlertBadge({
  count,
  onClick
}) {
  if (count === 0) return null;
  return /*#__PURE__*/_jsxs("button", {
    onClick: onClick,
    className: "flex items-center gap-2 px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg transition-colors",
    children: [/*#__PURE__*/_jsx(Package, {
      className: "w-4 h-4 text-orange-500"
    }), /*#__PURE__*/_jsxs("span", {
      className: "text-sm font-medium text-orange-500",
      children: [count, " s\u1EA3n ph\u1EA9m s\u1EAFp h\u1EBFt"]
    })]
  });
}