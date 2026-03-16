import { X, Clock, User, Phone, CreditCard, FileText, Printer, CheckCircle, XCircle, DollarSign, Receipt, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const STATUS_CONFIG = {
  PAID: {
    label: 'Đã thanh toán',
    color: 'bg-green-500/20 text-green-500',
    icon: CheckCircle
  },
  PENDING: {
    label: 'Chờ thanh toán',
    color: 'bg-yellow-500/20 text-yellow-500',
    icon: Clock
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'bg-red-500/20 text-red-500',
    icon: XCircle
  },
  REFUNDED: {
    label: 'Hoàn tiền',
    color: 'bg-purple-500/20 text-purple-500',
    icon: DollarSign
  }
};
const PAYMENT_METHODS = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  MOMO: 'Ví MoMo',
  CARD: 'Thẻ tín dụng'
};
function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
export function InvoiceDetailPanel({
  invoice,
  isOpen,
  onClose,
  onPrint,
  onMarkPaid,
  onRefund
}) {
  if (!isOpen || !invoice) return null;
  const statusConfig = STATUS_CONFIG[invoice.status];
  const StatusIcon = statusConfig.icon;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-40 bg-black/30 lg:hidden",
      onClick: onClose
    }), /*#__PURE__*/_jsxs("div", {
      className: cn('fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background-secondary border-l border-border shadow-2xl', 'transform transition-transform duration-300 ease-out', isOpen ? 'translate-x-0' : 'translate-x-full'),
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between p-4 border-b border-border",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center",
            children: /*#__PURE__*/_jsx(Receipt, {
              className: "w-5 h-5 text-primary-500"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "font-semibold text-foreground",
              children: invoice.invoiceNumber
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-foreground-secondary",
              children: formatDateTime(invoice.createdAt)
            })]
          })]
        }), /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "p-2 hover:bg-background-hover rounded-lg transition-colors",
          children: /*#__PURE__*/_jsx(X, {
            className: "w-5 h-5"
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex-1 overflow-auto p-4 space-y-4",
        style: {
          maxHeight: 'calc(100vh - 160px)'
        },
        children: [/*#__PURE__*/_jsx("div", {
          className: "flex items-center gap-2",
          children: /*#__PURE__*/_jsxs("span", {
            className: cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium', statusConfig.color),
            children: [/*#__PURE__*/_jsx(StatusIcon, {
              className: "w-4 h-4"
            }), statusConfig.label]
          })
        }), invoice.customer && /*#__PURE__*/_jsxs("div", {
          className: "p-4 bg-background-tertiary rounded-xl",
          children: [/*#__PURE__*/_jsxs("h3", {
            className: "text-sm font-medium text-foreground-secondary mb-3 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(User, {
              className: "w-4 h-4"
            }), "Kh\xE1ch h\xE0ng"]
          }), /*#__PURE__*/_jsx("p", {
            className: "font-medium text-foreground",
            children: invoice.customer.name
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mt-1 text-sm text-foreground-secondary",
            children: [/*#__PURE__*/_jsx(Phone, {
              className: "w-3 h-3"
            }), /*#__PURE__*/_jsx("span", {
              children: invoice.customer.phone
            })]
          })]
        }), invoice.court && /*#__PURE__*/_jsxs("div", {
          className: "p-4 bg-background-tertiary rounded-xl",
          children: [/*#__PURE__*/_jsxs("h3", {
            className: "text-sm font-medium text-foreground-secondary mb-3 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(MapPin, {
              className: "w-4 h-4"
            }), "S\xE2n"]
          }), /*#__PURE__*/_jsx("p", {
            className: "font-medium text-foreground",
            children: invoice.court.name
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 bg-background-tertiary rounded-xl",
          children: [/*#__PURE__*/_jsxs("h3", {
            className: "text-sm font-medium text-foreground-secondary mb-3 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(FileText, {
              className: "w-4 h-4"
            }), "Chi ti\u1EBFt \u0111\u01A1n h\xE0ng"]
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-3",
            children: invoice.items.map(item => /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between",
              children: [/*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("p", {
                  className: "font-medium text-foreground",
                  children: item.name
                }), /*#__PURE__*/_jsxs("p", {
                  className: "text-sm text-foreground-secondary",
                  children: [item.quantity, " x ", formatCurrency(item.unitPrice)]
                })]
              }), /*#__PURE__*/_jsx("span", {
                className: "font-medium text-foreground",
                children: formatCurrency(item.total)
              })]
            }, item.id))
          }), /*#__PURE__*/_jsxs("div", {
            className: "mt-4 pt-4 border-t border-border space-y-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex justify-between text-sm",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-foreground-secondary",
                children: "T\u1EA1m t\xEDnh"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground",
                children: formatCurrency(invoice.subtotal)
              })]
            }), invoice.discount > 0 && /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between text-sm",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-foreground-secondary",
                children: "Gi\u1EA3m gi\xE1"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-green-500",
                children: ["-", formatCurrency(invoice.discount)]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between text-lg font-bold",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-foreground",
                children: "T\u1ED5ng c\u1ED9ng"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-primary-500",
                children: formatCurrency(invoice.total)
              })]
            })]
          })]
        }), invoice.paymentMethod && /*#__PURE__*/_jsxs("div", {
          className: "p-4 bg-background-tertiary rounded-xl",
          children: [/*#__PURE__*/_jsxs("h3", {
            className: "text-sm font-medium text-foreground-secondary mb-2 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(CreditCard, {
              className: "w-4 h-4"
            }), "Ph\u01B0\u01A1ng th\u1EE9c thanh to\xE1n"]
          }), /*#__PURE__*/_jsx("p", {
            className: "font-medium text-foreground",
            children: PAYMENT_METHODS[invoice.paymentMethod] || invoice.paymentMethod
          })]
        }), invoice.notes && /*#__PURE__*/_jsxs("div", {
          className: "p-4 bg-background-tertiary rounded-xl",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-sm font-medium text-foreground-secondary mb-2",
            children: "Ghi ch\xFA"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-foreground",
            children: invoice.notes
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background-secondary",
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex gap-2",
          children: [invoice.status === 'PENDING' && onMarkPaid && /*#__PURE__*/_jsxs(Button, {
            className: "flex-1 gap-2",
            onClick: () => onMarkPaid(invoice.id),
            children: [/*#__PURE__*/_jsx(CheckCircle, {
              className: "w-4 h-4"
            }), "X\xE1c nh\u1EADn thanh to\xE1n"]
          }), invoice.status === 'PAID' && onRefund && /*#__PURE__*/_jsxs(Button, {
            variant: "outline",
            className: "flex-1 gap-2",
            onClick: () => onRefund(invoice.id),
            children: [/*#__PURE__*/_jsx(DollarSign, {
              className: "w-4 h-4"
            }), "Ho\xE0n ti\u1EC1n"]
          }), onPrint && /*#__PURE__*/_jsxs(Button, {
            variant: "outline",
            className: "gap-2",
            onClick: () => onPrint(invoice.id),
            children: [/*#__PURE__*/_jsx(Printer, {
              className: "w-4 h-4"
            }), "In h\xF3a \u0111\u01A1n"]
          })]
        })
      })]
    })]
  });
}