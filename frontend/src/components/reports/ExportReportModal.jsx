import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { exportReport } from '@/services/export.service';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const REPORT_TYPES = [{
  id: 'revenue',
  label: 'Báo cáo doanh thu',
  description: 'Tổng hợp doanh thu theo thời gian'
}, {
  id: 'bookings',
  label: 'Báo cáo đặt sân',
  description: 'Chi tiết các lượt đặt sân'
}, {
  id: 'customers',
  label: 'Báo cáo khách hàng',
  description: 'Danh sách và thống kê khách hàng'
}, {
  id: 'inventory',
  label: 'Báo cáo tồn kho',
  description: 'Xuất nhập tồn sản phẩm'
}];
const EXPORT_FORMATS = [{
  id: 'excel',
  label: 'Excel (.xlsx)',
  icon: FileSpreadsheet,
  color: 'text-green-500 bg-green-500/10'
}, {
  id: 'pdf',
  label: 'PDF',
  icon: FileText,
  color: 'text-red-500 bg-red-500/10'
}, {
  id: 'csv',
  label: 'CSV',
  icon: FileText,
  color: 'text-blue-500 bg-blue-500/10'
}];
function getDefaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
}
export function ExportReportModal({
  isOpen,
  onClose,
  onExport,
  availableReports = ['revenue', 'bookings', 'customers', 'inventory']
}) {
  const [reportType, setReportType] = useState('revenue');
  const [format, setFormat] = useState('excel');
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const options = {
        reportType,
        format,
        dateRange,
        includeDetails
      };
      if (onExport) {
        await onExport(options);
      } else {
        await exportReport(options);
      }
      onClose();
    } finally {
      setIsExporting(false);
    }
  };
  if (!isOpen) return null;
  const filteredReports = REPORT_TYPES.filter(r => availableReports.includes(r.id));
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn",
      onClick: onClose
    }), /*#__PURE__*/_jsx("div", {
      className: "fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg animate-scaleIn",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary rounded-2xl border border-border shadow-2xl overflow-hidden",
        children: [/*#__PURE__*/_jsx("div", {
          className: "flex items-center justify-between p-4 border-b border-border",
          children: /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center",
              children: /*#__PURE__*/_jsx(Download, {
                className: "w-5 h-5 text-primary-500"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h2", {
                className: "font-semibold text-foreground",
                children: "Xu\u1EA5t b\xE1o c\xE1o"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-foreground-secondary",
                children: "Ch\u1ECDn lo\u1EA1i b\xE1o c\xE1o v\xE0 \u0111\u1ECBnh d\u1EA1ng"
              })]
            })]
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 space-y-6 max-h-[60vh] overflow-auto",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "block text-sm font-medium text-foreground mb-2",
              children: [/*#__PURE__*/_jsx(Filter, {
                className: "w-4 h-4 inline mr-1"
              }), "Lo\u1EA1i b\xE1o c\xE1o"]
            }), /*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-2 gap-2",
              children: filteredReports.map(type => /*#__PURE__*/_jsxs("button", {
                onClick: () => setReportType(type.id),
                className: cn('p-3 rounded-lg border text-left transition-all', reportType === type.id ? 'bg-primary-500/10 border-primary-500 text-primary-500' : 'bg-background-tertiary border-border hover:border-primary-500/50'),
                children: [/*#__PURE__*/_jsx("p", {
                  className: "font-medium",
                  children: type.label
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xs opacity-70 mt-0.5",
                  children: type.description
                })]
              }, type.id))
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "block text-sm font-medium text-foreground mb-2",
              children: [/*#__PURE__*/_jsx(Calendar, {
                className: "w-4 h-4 inline mr-1"
              }), "Kho\u1EA3ng th\u1EDDi gian"]
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-2 gap-3",
              children: [/*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("label", {
                  className: "block text-xs text-foreground-muted mb-1",
                  children: "T\u1EEB ng\xE0y"
                }), /*#__PURE__*/_jsx("input", {
                  type: "date",
                  value: dateRange.start,
                  onChange: e => setDateRange(prev => ({
                    ...prev,
                    start: e.target.value
                  })),
                  className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-sm"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("label", {
                  className: "block text-xs text-foreground-muted mb-1",
                  children: "\u0110\u1EBFn ng\xE0y"
                }), /*#__PURE__*/_jsx("input", {
                  type: "date",
                  value: dateRange.end,
                  onChange: e => setDateRange(prev => ({
                    ...prev,
                    end: e.target.value
                  })),
                  className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-sm"
                })]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm font-medium text-foreground mb-2",
              children: "\u0110\u1ECBnh d\u1EA1ng xu\u1EA5t"
            }), /*#__PURE__*/_jsx("div", {
              className: "flex gap-2",
              children: EXPORT_FORMATS.map(f => {
                const Icon = f.icon;
                return /*#__PURE__*/_jsxs("button", {
                  onClick: () => setFormat(f.id),
                  className: cn('flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all', format === f.id ? `${f.color} border-current` : 'bg-background-tertiary border-border hover:border-foreground-muted'),
                  children: [/*#__PURE__*/_jsx(Icon, {
                    className: cn('w-5 h-5', format === f.id ? '' : 'opacity-50')
                  }), /*#__PURE__*/_jsx("span", {
                    className: "font-medium text-sm",
                    children: f.label
                  })]
                }, f.id);
              })
            })]
          }), /*#__PURE__*/_jsx("div", {
            children: /*#__PURE__*/_jsxs("label", {
              className: "flex items-center gap-3 cursor-pointer",
              children: [/*#__PURE__*/_jsx("input", {
                type: "checkbox",
                checked: includeDetails,
                onChange: e => setIncludeDetails(e.target.checked),
                className: "w-4 h-4 rounded border-border bg-background-tertiary text-primary-500 focus:ring-primary-500"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-sm",
                children: "Bao g\u1ED3m chi ti\u1EBFt giao d\u1ECBch"
              })]
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-3 p-4 border-t border-border",
          children: [/*#__PURE__*/_jsx(Button, {
            variant: "ghost",
            className: "flex-1",
            onClick: onClose,
            children: "H\u1EE7y"
          }), /*#__PURE__*/_jsxs(Button, {
            className: "flex-1 gap-2",
            onClick: handleExport,
            disabled: isExporting,
            children: [isExporting ? /*#__PURE__*/_jsx(Loader2, {
              className: "w-4 h-4 animate-spin"
            }) : /*#__PURE__*/_jsx(Download, {
              className: "w-4 h-4"
            }), isExporting ? 'Đang xuất...' : 'Xuất báo cáo']
          })]
        })]
      })
    })]
  });
}

// Quick export button
export function ExportButton({
  onClick,
  label = 'Xuất báo cáo'
}) {
  return /*#__PURE__*/_jsxs(Button, {
    variant: "outline",
    className: "gap-2",
    onClick: onClick,
    children: [/*#__PURE__*/_jsx(Download, {
      className: "w-4 h-4"
    }), label]
  });
}