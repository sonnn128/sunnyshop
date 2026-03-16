import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Receipt, Search, ChevronLeft, ChevronRight, CheckCircle, Clock, Eye, X, CreditCard, Ban, RotateCcw, Printer, TrendingUp, Download } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { invoiceApi } from '@/services/invoice.service';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { exportReport } from '@/services/export.service';

// Date period filter type
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function getStatusInfo(paymentStatus) {
  switch (paymentStatus) {
    case 'PAID':
      return {
        label: 'Đã thanh toán',
        color: 'bg-green-500/20 text-green-400 border-green-500',
        icon: CheckCircle
      };
    case 'REFUNDED':
      return {
        label: 'Đã hoàn',
        color: 'bg-red-500/20 text-red-400 border-red-500',
        icon: RotateCcw
      };
    case 'PARTIAL':
      return {
        label: 'Thanh toán 1 phần',
        color: 'bg-orange-500/20 text-orange-400 border-orange-500',
        icon: Clock
      };
    default:
      return {
        label: 'Chờ thanh toán',
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
        icon: Clock
      };
  }
}

// Get date range for period
function getDateRange(period) {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  switch (period) {
    case 'today':
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(start.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
    case 'custom':
      start.setMonth(start.getMonth() - 1);
      break;
  }
  return {
    start,
    end
  };
}

// Period Filter Tabs
function PeriodFilter({
  value,
  onChange
}) {
  const options = [{
    value: 'today',
    label: 'Hôm nay'
  }, {
    value: 'week',
    label: 'Tuần'
  }, {
    value: 'month',
    label: 'Tháng'
  }, {
    value: 'quarter',
    label: 'Quý'
  }, {
    value: 'year',
    label: 'Năm'
  }];
  return /*#__PURE__*/_jsx("div", {
    className: "inline-flex bg-background-tertiary rounded-lg p-1",
    children: options.map(option => /*#__PURE__*/_jsx("button", {
      onClick: () => onChange(option.value),
      className: cn('px-3 py-1.5 text-sm font-medium rounded-md transition-all', value === option.value ? 'bg-primary-500 text-white shadow-md' : 'text-foreground-secondary hover:text-foreground'),
      children: option.label
    }, option.value))
  });
}
export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [datePeriod, setDatePeriod] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get date range
  const dateRange = useMemo(() => getDateRange(datePeriod), [datePeriod]);

  // Fetch invoices
  const {
    data: invoicesData,
    isLoading
  } = useQuery({
    queryKey: ['invoices', statusFilter, datePeriod, page],
    queryFn: () => invoiceApi.getAll({
      paymentStatus: statusFilter || undefined,
      startDate: dateRange.start.toISOString(),
      endDate: dateRange.end.toISOString(),
      page,
      limit: 15
    })
  });

  // Pay mutation
  const payMutation = useMutation({
    mutationFn: id => invoiceApi.pay(id),
    onSuccess: () => {
      toast({
        title: 'Thanh toán thành công!',
        variant: 'success'
      });
      queryClient.invalidateQueries({
        queryKey: ['invoices']
      });
      setSelectedInvoice(null);
    },
    onError: () => {
      toast({
        title: 'Lỗi khi thanh toán',
        variant: 'error'
      });
    }
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: id => invoiceApi.cancel(id),
    onSuccess: () => {
      toast({
        title: 'Đã hủy hóa đơn!',
        variant: 'success'
      });
      queryClient.invalidateQueries({
        queryKey: ['invoices']
      });
      setSelectedInvoice(null);
    },
    onError: () => {
      toast({
        title: 'Lỗi khi hủy',
        variant: 'error'
      });
    }
  });
  const handleExport = async () => {
    try {
      await exportReport({
        reportType: 'bookings',
        format: 'csv',
        dateRange: {
          start: dateRange.start.toISOString().split('T')[0],
          end: dateRange.end.toISOString().split('T')[0]
        }
      });
      toast({
        title: 'Đã xuất báo cáo!',
        variant: 'success'
      });
    } catch {
      toast({
        title: 'Lỗi khi xuất báo cáo',
        variant: 'error'
      });
    }
  };

  // Calculate stats
  const stats = useMemo(() => ({
    total: invoicesData?.pagination.total || 0,
    pending: invoicesData?.data.filter(i => i.paymentStatus === 'PENDING').length || 0,
    paid: invoicesData?.data.filter(i => i.paymentStatus === 'PAID').length || 0,
    totalRevenue: invoicesData?.data.filter(i => i.paymentStatus === 'PAID').reduce((sum, i) => sum + i.total, 0) || 0
  }), [invoicesData]);

  // Filter by search
  const filteredInvoices = invoicesData?.data.filter(invoice => !searchQuery || invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  // Get period label
  const getPeriodLabel = () => {
    switch (datePeriod) {
      case 'today':
        return 'hôm nay';
      case 'week':
        return '7 ngày qua';
      case 'month':
        return '30 ngày qua';
      case 'quarter':
        return '3 tháng qua';
      case 'year':
        return '1 năm qua';
      default:
        return '';
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col h-full p-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold text-foreground",
          children: "H\xF3a \u0111\u01A1n"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-foreground-secondary",
          children: "Qu\u1EA3n l\xFD h\xF3a \u0111\u01A1n v\xE0 thanh to\xE1n"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsx(PeriodFilter, {
          value: datePeriod,
          onChange: setDatePeriod
        }), /*#__PURE__*/_jsxs(Button, {
          variant: "outline",
          className: "gap-2",
          onClick: handleExport,
          children: [/*#__PURE__*/_jsx(Download, {
            className: "w-4 h-4"
          }), "Xu\u1EA5t b\xE1o c\xE1o"]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-xl p-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 text-foreground-secondary text-sm mb-1",
          children: [/*#__PURE__*/_jsx(Receipt, {
            className: "w-4 h-4"
          }), "T\u1ED5ng h\xF3a \u0111\u01A1n"]
        }), /*#__PURE__*/_jsx("div", {
          className: "text-2xl font-bold text-foreground",
          children: stats.total
        }), /*#__PURE__*/_jsx("div", {
          className: "text-xs text-foreground-muted mt-1",
          children: getPeriodLabel()
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-xl p-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 text-foreground-secondary text-sm mb-1",
          children: [/*#__PURE__*/_jsx(Clock, {
            className: "w-4 h-4"
          }), "Ch\u1EDD thanh to\xE1n"]
        }), /*#__PURE__*/_jsx("div", {
          className: "text-2xl font-bold text-yellow-400",
          children: stats.pending
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-xl p-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 text-foreground-secondary text-sm mb-1",
          children: [/*#__PURE__*/_jsx(CheckCircle, {
            className: "w-4 h-4"
          }), "\u0110\xE3 thanh to\xE1n"]
        }), /*#__PURE__*/_jsx("div", {
          className: "text-2xl font-bold text-green-400",
          children: stats.paid
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-xl p-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 text-foreground-secondary text-sm mb-1",
          children: [/*#__PURE__*/_jsx(TrendingUp, {
            className: "w-4 h-4"
          }), "Doanh thu"]
        }), /*#__PURE__*/_jsx("div", {
          className: "text-2xl font-bold text-primary-500",
          children: formatCurrency(stats.totalRevenue)
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-wrap items-center gap-4 mb-6",
      children: [/*#__PURE__*/_jsxs("select", {
        value: statusFilter,
        onChange: e => {
          setStatusFilter(e.target.value);
          setPage(1);
        },
        className: "bg-background-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
        children: [/*#__PURE__*/_jsx("option", {
          value: "",
          children: "T\u1EA5t c\u1EA3 tr\u1EA1ng th\xE1i"
        }), /*#__PURE__*/_jsx("option", {
          value: "PENDING",
          children: "Ch\u1EDD thanh to\xE1n"
        }), /*#__PURE__*/_jsx("option", {
          value: "PAID",
          children: "\u0110\xE3 thanh to\xE1n"
        }), /*#__PURE__*/_jsx("option", {
          value: "PARTIAL",
          children: "Thanh to\xE1n 1 ph\u1EA7n"
        }), /*#__PURE__*/_jsx("option", {
          value: "REFUNDED",
          children: "\u0110\xE3 ho\xE0n"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative flex-1 max-w-md",
        children: [/*#__PURE__*/_jsx(Search, {
          className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary"
        }), /*#__PURE__*/_jsx("input", {
          type: "text",
          placeholder: "T\xECm theo m\xE3 h\xF3a \u0111\u01A1n...",
          value: searchQuery,
          onChange: e => setSearchQuery(e.target.value),
          className: "w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary-500"
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "flex-1 overflow-auto",
      children: isLoading ? /*#__PURE__*/_jsx("div", {
        className: "flex items-center justify-center h-64",
        children: /*#__PURE__*/_jsx("div", {
          className: "animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        })
      }) : !filteredInvoices.length ? /*#__PURE__*/_jsxs("div", {
        className: "flex flex-col items-center justify-center h-64 text-foreground-secondary",
        children: [/*#__PURE__*/_jsx(Receipt, {
          className: "w-12 h-12 mb-4 opacity-50"
        }), /*#__PURE__*/_jsx("p", {
          children: "Ch\u01B0a c\xF3 h\xF3a \u0111\u01A1n n\xE0o"
        })]
      }) : /*#__PURE__*/_jsx("div", {
        className: "bg-background-secondary border border-border rounded-xl overflow-hidden",
        children: /*#__PURE__*/_jsx("div", {
          className: "overflow-x-auto",
          children: /*#__PURE__*/_jsxs("table", {
            className: "w-full",
            children: [/*#__PURE__*/_jsx("thead", {
              children: /*#__PURE__*/_jsxs("tr", {
                className: "border-b border-border bg-background-tertiary",
                children: [/*#__PURE__*/_jsx("th", {
                  className: "text-left px-4 py-3 text-sm font-medium text-foreground-secondary",
                  children: "M\xE3 H\u0110"
                }), /*#__PURE__*/_jsx("th", {
                  className: "text-left px-4 py-3 text-sm font-medium text-foreground-secondary",
                  children: "Kh\xE1ch h\xE0ng"
                }), /*#__PURE__*/_jsx("th", {
                  className: "text-left px-4 py-3 text-sm font-medium text-foreground-secondary",
                  children: "T\u1ED5ng ti\u1EC1n"
                }), /*#__PURE__*/_jsx("th", {
                  className: "text-left px-4 py-3 text-sm font-medium text-foreground-secondary",
                  children: "Tr\u1EA1ng th\xE1i"
                }), /*#__PURE__*/_jsx("th", {
                  className: "text-left px-4 py-3 text-sm font-medium text-foreground-secondary",
                  children: "Ng\xE0y t\u1EA1o"
                }), /*#__PURE__*/_jsx("th", {
                  className: "text-center px-4 py-3 text-sm font-medium text-foreground-secondary",
                  children: "Thao t\xE1c"
                })]
              })
            }), /*#__PURE__*/_jsx("tbody", {
              children: filteredInvoices.map(invoice => {
                const statusInfo = getStatusInfo(invoice.paymentStatus);
                const StatusIcon = statusInfo.icon;
                return /*#__PURE__*/_jsxs("tr", {
                  className: "border-b border-border/50 hover:bg-background-hover transition-colors",
                  children: [/*#__PURE__*/_jsx("td", {
                    className: "px-4 py-3",
                    children: /*#__PURE__*/_jsx("span", {
                      className: "font-mono text-sm text-foreground",
                      children: invoice.invoiceNumber
                    })
                  }), /*#__PURE__*/_jsx("td", {
                    className: "px-4 py-3",
                    children: /*#__PURE__*/_jsxs("div", {
                      children: [/*#__PURE__*/_jsx("div", {
                        className: "text-foreground",
                        children: invoice.customer?.name || 'Khách lẻ'
                      }), invoice.customer?.phone && /*#__PURE__*/_jsx("div", {
                        className: "text-sm text-foreground-secondary",
                        children: invoice.customer.phone
                      })]
                    })
                  }), /*#__PURE__*/_jsx("td", {
                    className: "px-4 py-3",
                    children: /*#__PURE__*/_jsx("span", {
                      className: "font-semibold text-primary-500",
                      children: formatCurrency(invoice.total)
                    })
                  }), /*#__PURE__*/_jsx("td", {
                    className: "px-4 py-3",
                    children: /*#__PURE__*/_jsxs("span", {
                      className: cn('inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border', statusInfo.color),
                      children: [/*#__PURE__*/_jsx(StatusIcon, {
                        className: "w-3 h-3"
                      }), statusInfo.label]
                    })
                  }), /*#__PURE__*/_jsx("td", {
                    className: "px-4 py-3 text-sm text-foreground-secondary",
                    children: formatDate(new Date(invoice.createdAt))
                  }), /*#__PURE__*/_jsx("td", {
                    className: "px-4 py-3",
                    children: /*#__PURE__*/_jsxs("div", {
                      className: "flex items-center justify-center gap-2",
                      children: [/*#__PURE__*/_jsx("button", {
                        onClick: () => setSelectedInvoice(invoice),
                        className: "p-2 hover:bg-background-tertiary rounded-lg transition-colors",
                        title: "Xem chi ti\u1EBFt",
                        children: /*#__PURE__*/_jsx(Eye, {
                          className: "w-4 h-4 text-foreground-secondary"
                        })
                      }), invoice.paymentStatus === 'PENDING' && /*#__PURE__*/_jsxs(_Fragment, {
                        children: [/*#__PURE__*/_jsx("button", {
                          onClick: () => payMutation.mutate(invoice.id),
                          className: "p-2 hover:bg-green-500/10 rounded-lg transition-colors",
                          title: "Thanh to\xE1n",
                          children: /*#__PURE__*/_jsx(CreditCard, {
                            className: "w-4 h-4 text-green-400"
                          })
                        }), /*#__PURE__*/_jsx("button", {
                          onClick: () => cancelMutation.mutate(invoice.id),
                          className: "p-2 hover:bg-red-500/10 rounded-lg transition-colors",
                          title: "H\u1EE7y",
                          children: /*#__PURE__*/_jsx(Ban, {
                            className: "w-4 h-4 text-red-400"
                          })
                        })]
                      })]
                    })
                  })]
                }, invoice.id);
              })
            })]
          })
        })
      })
    }), invoicesData && invoicesData.pagination.totalPages > 1 && /*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mt-4 pt-4 border-t border-border",
      children: [/*#__PURE__*/_jsxs("span", {
        className: "text-sm text-foreground-secondary",
        children: ["Hi\u1EC3n th\u1ECB ", invoicesData.data.length, " / ", invoicesData.pagination.total, " h\xF3a \u0111\u01A1n"]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsx(Button, {
          variant: "ghost",
          size: "sm",
          onClick: () => setPage(p => Math.max(1, p - 1)),
          disabled: page === 1,
          children: /*#__PURE__*/_jsx(ChevronLeft, {
            className: "w-4 h-4"
          })
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-sm",
          children: ["Trang ", page, " / ", invoicesData.pagination.totalPages]
        }), /*#__PURE__*/_jsx(Button, {
          variant: "ghost",
          size: "sm",
          onClick: () => setPage(p => Math.min(invoicesData.pagination.totalPages, p + 1)),
          disabled: page === invoicesData.pagination.totalPages,
          children: /*#__PURE__*/_jsx(ChevronRight, {
            className: "w-4 h-4"
          })
        })]
      })]
    }), selectedInvoice && /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-auto animate-scaleIn",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background-secondary z-10",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h3", {
              className: "text-lg font-semibold text-foreground",
              children: "Chi ti\u1EBFt h\xF3a \u0111\u01A1n"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-foreground-secondary font-mono",
              children: selectedInvoice.invoiceNumber
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsxs("button", {
              onClick: () => navigate(`/invoices/${selectedInvoice.id}/print`),
              className: "flex items-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors",
              title: "In h\xF3a \u0111\u01A1n",
              children: [/*#__PURE__*/_jsx(Printer, {
                className: "w-4 h-4"
              }), "In"]
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => setSelectedInvoice(null),
              className: "p-2 hover:bg-background-hover rounded-lg",
              children: /*#__PURE__*/_jsx(X, {
                className: "w-5 h-5"
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 space-y-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "bg-background-tertiary rounded-xl p-4",
            children: [/*#__PURE__*/_jsx("h4", {
              className: "font-medium text-foreground mb-3",
              children: "Th\xF4ng tin kh\xE1ch h\xE0ng"
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-2 gap-4 text-sm",
              children: [/*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "H\u1ECD t\xEAn:"
                }), /*#__PURE__*/_jsx("span", {
                  className: "ml-2 text-foreground",
                  children: selectedInvoice.customer?.name || 'Khách lẻ'
                })]
              }), selectedInvoice.customer?.phone && /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i:"
                }), /*#__PURE__*/_jsx("span", {
                  className: "ml-2 text-foreground",
                  children: selectedInvoice.customer.phone
                })]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h4", {
              className: "font-medium text-foreground mb-3",
              children: "Chi ti\u1EBFt \u0111\u01A1n h\xE0ng"
            }), /*#__PURE__*/_jsx("div", {
              className: "bg-background-tertiary rounded-xl overflow-hidden",
              children: /*#__PURE__*/_jsxs("table", {
                className: "w-full text-sm",
                children: [/*#__PURE__*/_jsx("thead", {
                  className: "border-b border-border",
                  children: /*#__PURE__*/_jsxs("tr", {
                    children: [/*#__PURE__*/_jsx("th", {
                      className: "text-left px-4 py-3 text-foreground-secondary",
                      children: "M\xF4 t\u1EA3"
                    }), /*#__PURE__*/_jsx("th", {
                      className: "text-center px-4 py-3 text-foreground-secondary",
                      children: "SL"
                    }), /*#__PURE__*/_jsx("th", {
                      className: "text-right px-4 py-3 text-foreground-secondary",
                      children: "\u0110\u01A1n gi\xE1"
                    }), /*#__PURE__*/_jsx("th", {
                      className: "text-right px-4 py-3 text-foreground-secondary",
                      children: "Th\xE0nh ti\u1EC1n"
                    })]
                  })
                }), /*#__PURE__*/_jsx("tbody", {
                  children: selectedInvoice.items.map(item => /*#__PURE__*/_jsxs("tr", {
                    className: "border-b border-border/50",
                    children: [/*#__PURE__*/_jsx("td", {
                      className: "px-4 py-3 text-foreground",
                      children: item.description
                    }), /*#__PURE__*/_jsx("td", {
                      className: "px-4 py-3 text-center text-foreground",
                      children: item.quantity
                    }), /*#__PURE__*/_jsx("td", {
                      className: "px-4 py-3 text-right text-foreground-secondary",
                      children: formatCurrency(item.unitPrice)
                    }), /*#__PURE__*/_jsx("td", {
                      className: "px-4 py-3 text-right text-foreground font-medium",
                      children: formatCurrency(item.total)
                    })]
                  }, item.id))
                })]
              })
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "bg-background-tertiary rounded-xl p-4",
            children: /*#__PURE__*/_jsxs("div", {
              className: "space-y-2 text-sm",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "T\u1EA1m t\xEDnh:"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-foreground",
                  children: formatCurrency(selectedInvoice.subtotal)
                })]
              }), selectedInvoice.discount > 0 && /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "Gi\u1EA3m gi\xE1:"
                }), /*#__PURE__*/_jsxs("span", {
                  className: "text-red-400",
                  children: ["-", formatCurrency(selectedInvoice.discount)]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between text-lg font-bold pt-2 border-t border-border",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground",
                  children: "T\u1ED5ng c\u1ED9ng:"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-primary-500",
                  children: formatCurrency(selectedInvoice.total)
                })]
              })]
            })
          }), selectedInvoice.notes && /*#__PURE__*/_jsxs("div", {
            className: "bg-background-tertiary rounded-xl p-4",
            children: [/*#__PURE__*/_jsx("h4", {
              className: "font-medium text-foreground mb-2",
              children: "Ghi ch\xFA"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-foreground-secondary",
              children: selectedInvoice.notes
            })]
          })]
        }), selectedInvoice.paymentStatus === 'PENDING' && /*#__PURE__*/_jsxs("div", {
          className: "flex gap-3 p-4 border-t border-border",
          children: [/*#__PURE__*/_jsx(Button, {
            variant: "ghost",
            className: "flex-1",
            onClick: () => cancelMutation.mutate(selectedInvoice.id),
            children: "H\u1EE7y h\xF3a \u0111\u01A1n"
          }), /*#__PURE__*/_jsx(Button, {
            className: "flex-1",
            onClick: () => payMutation.mutate(selectedInvoice.id),
            children: "Thanh to\xE1n"
          })]
        })]
      })
    })]
  });
}