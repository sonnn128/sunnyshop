import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TrendingUp, Users, Calendar, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight, Download, FileSpreadsheet } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { reportApi } from '@/services/report.service';
import { exportApi } from '@/services/export.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Simple bar component for charts
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function Bar({
  value,
  maxValue,
  label,
  color
}) {
  const height = maxValue > 0 ? value / maxValue * 100 : 0;
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col items-center gap-2",
    children: [/*#__PURE__*/_jsx("div", {
      className: "w-10 h-36 bg-background-tertiary rounded-lg overflow-hidden flex flex-col-reverse",
      children: /*#__PURE__*/_jsx("div", {
        className: cn('w-full transition-all duration-500', color),
        style: {
          height: `${height}%`
        }
      })
    }), /*#__PURE__*/_jsx("span", {
      className: "text-xs text-foreground-secondary",
      children: label
    }), /*#__PURE__*/_jsx("span", {
      className: "text-xs text-foreground font-medium",
      children: formatCurrency(value)
    })]
  });
}

// Stats card component
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
  loading
}) {
  return /*#__PURE__*/_jsx("div", {
    className: "bg-background-secondary border border-border rounded-lg p-6",
    children: /*#__PURE__*/_jsxs("div", {
      className: "flex items-start justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-foreground-secondary text-sm",
          children: title
        }), loading ? /*#__PURE__*/_jsx("div", {
          className: "h-8 w-24 bg-background-tertiary rounded animate-pulse mt-1"
        }) : /*#__PURE__*/_jsx("p", {
          className: "text-2xl font-bold text-foreground mt-1",
          children: value
        }), trend && trendValue && /*#__PURE__*/_jsxs("div", {
          className: cn('flex items-center gap-1 text-sm mt-2', trend === 'up' ? 'text-green-400' : 'text-red-400'),
          children: [trend === 'up' ? /*#__PURE__*/_jsx(ArrowUpRight, {
            className: "w-4 h-4"
          }) : /*#__PURE__*/_jsx(ArrowDownRight, {
            className: "w-4 h-4"
          }), trendValue]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: cn('p-3 rounded-lg', color),
        children: /*#__PURE__*/_jsx(Icon, {
          className: "w-6 h-6"
        })
      })]
    })
  });
}
export default function ReportsPage() {
  const [period, setPeriod] = useState('today');
  const {
    toast
  } = useToast();

  // Fetch dashboard stats
  const {
    data: dashboardStats,
    isLoading: loadingStats
  } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => reportApi.getDashboardStats()
  });

  // Fetch monthly revenue
  const {
    data: monthlyRevenue
  } = useQuery({
    queryKey: ['dashboard', 'monthly-revenue'],
    queryFn: () => reportApi.getMonthlyRevenue()
  });

  // Fetch revenue chart
  const {
    data: revenueChart
  } = useQuery({
    queryKey: ['dashboard', 'revenue-chart', 7],
    queryFn: () => reportApi.getRevenueChart(7)
  });

  // Fetch top customers
  const {
    data: topCustomers
  } = useQuery({
    queryKey: ['reports', 'top-customers'],
    queryFn: () => reportApi.getTopCustomers(5)
  });

  // Export mutations
  const exportInvoicesMutation = useMutation({
    mutationFn: () => exportApi.exportInvoices(),
    onSuccess: () => toast({
      title: 'Đã tải xuống file Excel hóa đơn'
    }),
    onError: () => toast({
      title: 'Lỗi khi xuất file',
      variant: 'error'
    })
  });
  const exportBookingsMutation = useMutation({
    mutationFn: () => exportApi.exportBookings(),
    onSuccess: () => toast({
      title: 'Đã tải xuống file Excel đặt sân'
    }),
    onError: () => toast({
      title: 'Lỗi khi xuất file',
      variant: 'error'
    })
  });
  const exportCustomersMutation = useMutation({
    mutationFn: () => exportApi.exportCustomers(),
    onSuccess: () => toast({
      title: 'Đã tải xuống file Excel khách hàng'
    }),
    onError: () => toast({
      title: 'Lỗi khi xuất file',
      variant: 'error'
    })
  });
  const exportRevenueMutation = useMutation({
    mutationFn: () => exportApi.exportRevenueReport(),
    onSuccess: () => toast({
      title: 'Đã tải xuống báo cáo doanh thu'
    }),
    onError: () => toast({
      title: 'Lỗi khi xuất file',
      variant: 'error'
    })
  });

  // Chart data
  const chartData = revenueChart || [];
  const maxRevenue = chartData.length > 0 ? Math.max(...chartData.map(d => d.revenue)) : 0;
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col h-full overflow-auto",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold text-foreground",
          children: "B\xE1o C\xE1o & Th\u1ED1ng K\xEA"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-foreground-secondary",
          children: "Ph\xE2n t\xEDch doanh thu v\xE0 ho\u1EA1t \u0111\u1ED9ng"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "relative group",
          children: [/*#__PURE__*/_jsxs(Button, {
            variant: "outline",
            className: "gap-2",
            children: [/*#__PURE__*/_jsx(Download, {
              className: "w-4 h-4"
            }), "Xu\u1EA5t Excel"]
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute right-0 top-full mt-2 w-56 bg-background-secondary border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10",
            children: /*#__PURE__*/_jsxs("div", {
              className: "p-2 space-y-1",
              children: [/*#__PURE__*/_jsxs("button", {
                onClick: () => exportInvoicesMutation.mutate(),
                disabled: exportInvoicesMutation.isPending,
                className: "flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-background-hover rounded-lg",
                children: [/*#__PURE__*/_jsx(FileSpreadsheet, {
                  className: "w-4 h-4"
                }), "Xu\u1EA5t h\xF3a \u0111\u01A1n"]
              }), /*#__PURE__*/_jsxs("button", {
                onClick: () => exportBookingsMutation.mutate(),
                disabled: exportBookingsMutation.isPending,
                className: "flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-background-hover rounded-lg",
                children: [/*#__PURE__*/_jsx(FileSpreadsheet, {
                  className: "w-4 h-4"
                }), "Xu\u1EA5t \u0111\u1EB7t s\xE2n"]
              }), /*#__PURE__*/_jsxs("button", {
                onClick: () => exportCustomersMutation.mutate(),
                disabled: exportCustomersMutation.isPending,
                className: "flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-background-hover rounded-lg",
                children: [/*#__PURE__*/_jsx(FileSpreadsheet, {
                  className: "w-4 h-4"
                }), "Xu\u1EA5t kh\xE1ch h\xE0ng"]
              }), /*#__PURE__*/_jsx("div", {
                className: "border-t border-border my-1"
              }), /*#__PURE__*/_jsxs("button", {
                onClick: () => exportRevenueMutation.mutate(),
                disabled: exportRevenueMutation.isPending,
                className: "flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-background-hover rounded-lg text-primary-500",
                children: [/*#__PURE__*/_jsx(FileSpreadsheet, {
                  className: "w-4 h-4"
                }), "B\xE1o c\xE1o doanh thu th\xE1ng"]
              })]
            })
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "flex bg-background-secondary border border-border rounded-lg overflow-hidden",
          children: ['today', 'week', 'month'].map(p => /*#__PURE__*/_jsx("button", {
            onClick: () => setPeriod(p),
            className: cn('px-4 py-2 text-sm transition-colors', period === p ? 'bg-primary-500 text-white' : 'text-foreground-secondary hover:bg-background-hover'),
            children: p === 'today' ? 'Hôm nay' : p === 'week' ? 'Tuần' : 'Tháng'
          }, p))
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-4 gap-4 mb-6",
      children: [/*#__PURE__*/_jsx(StatCard, {
        title: "Doanh thu h\xF4m nay",
        value: formatCurrency(dashboardStats?.todayRevenue || 0),
        icon: DollarSign,
        trend: monthlyRevenue?.growth && monthlyRevenue.growth >= 0 ? 'up' : 'down',
        trendValue: `${monthlyRevenue?.growth || 0}% so với tháng trước`,
        color: "bg-primary-500/20 text-primary-500",
        loading: loadingStats
      }), /*#__PURE__*/_jsx(StatCard, {
        title: "L\u01B0\u1EE3t \u0111\u1EB7t s\xE2n",
        value: String(dashboardStats?.todayBookings || 0),
        icon: Calendar,
        color: "bg-blue-500/20 text-blue-400",
        loading: loadingStats
      }), /*#__PURE__*/_jsx(StatCard, {
        title: "Kh\xE1ch h\xE0ng",
        value: String(dashboardStats?.activeCustomers || 0),
        icon: Users,
        color: "bg-green-500/20 text-green-400",
        loading: loadingStats
      }), /*#__PURE__*/_jsx(StatCard, {
        title: "Doanh thu th\xE1ng n\xE0y",
        value: formatCurrency(monthlyRevenue?.currentMonth || 0),
        icon: TrendingUp,
        color: "bg-purple-500/20 text-purple-400"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "bg-background-secondary border border-border rounded-lg p-6 mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mb-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(BarChart3, {
            className: "w-5 h-5 text-primary-500"
          }), /*#__PURE__*/_jsx("h3", {
            className: "font-semibold text-foreground",
            children: "Doanh thu 7 ng\xE0y qua"
          })]
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-sm text-foreground-secondary",
          children: ["T\u1ED5ng: ", formatCurrency(chartData.reduce((s, d) => s + d.revenue, 0))]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "flex items-end justify-around",
        children: chartData.map((data, i) => /*#__PURE__*/_jsx(Bar, {
          value: data.revenue,
          maxValue: maxRevenue,
          label: data.date,
          color: "bg-primary-500"
        }, i))
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "bg-background-secondary border border-border rounded-lg p-6",
      children: [/*#__PURE__*/_jsx("h3", {
        className: "font-semibold text-foreground mb-4",
        children: "Top kh\xE1ch h\xE0ng chi ti\xEAu"
      }), /*#__PURE__*/_jsxs("div", {
        className: "space-y-3",
        children: [topCustomers?.map((customer, i) => /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-4",
          children: [/*#__PURE__*/_jsx("span", {
            className: "w-6 h-6 rounded-full bg-primary-500/20 text-primary-500 text-sm flex items-center justify-center font-medium",
            children: i + 1
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex justify-between items-center mb-1",
              children: [/*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground font-medium",
                  children: customer.name
                }), customer.membershipTier && /*#__PURE__*/_jsx("span", {
                  className: cn('ml-2 px-2 py-0.5 text-xs rounded', customer.membershipTier === 'GOLD' ? 'bg-yellow-500/20 text-yellow-400' : customer.membershipTier === 'SILVER' ? 'bg-gray-400/20 text-gray-400' : 'bg-amber-700/20 text-amber-600'),
                  children: customer.membershipTier
                })]
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-sm text-foreground-secondary",
                children: [customer.totalBookings, " l\u01B0\u1EE3t"]
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "h-2 bg-background-tertiary rounded-full overflow-hidden",
              children: /*#__PURE__*/_jsx("div", {
                className: "h-full bg-primary-500 rounded-full transition-all",
                style: {
                  width: `${customer.totalSpent / (topCustomers[0]?.totalSpent || 1) * 100}%`
                }
              })
            })]
          }), /*#__PURE__*/_jsx("span", {
            className: "text-foreground font-medium w-28 text-right",
            children: formatCurrency(customer.totalSpent)
          })]
        }, customer.id)), (!topCustomers || topCustomers.length === 0) && /*#__PURE__*/_jsx("p", {
          className: "text-center text-foreground-muted py-4",
          children: "Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u kh\xE1ch h\xE0ng"
        })]
      })]
    })]
  });
}