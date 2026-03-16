import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Calendar, Users, Grid3X3, TrendingUp, TrendingDown, Clock, FileText, ChevronRight, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { reportApi } from '@/services/report.service';
import { Button } from '@/components/ui/button';

// Period filter types
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function StatsCard({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  loading,
  onClick
}) {
  return /*#__PURE__*/_jsx("div", {
    className: cn("bg-background-secondary border border-border rounded-xl p-5 hover:border-primary-500/50 transition-all", onClick && "cursor-pointer hover:shadow-lg"),
    onClick: onClick,
    children: /*#__PURE__*/_jsxs("div", {
      className: "flex items-start justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-sm text-foreground-secondary",
          children: title
        }), loading ? /*#__PURE__*/_jsx("div", {
          className: "h-8 w-24 bg-background-tertiary rounded animate-pulse mt-1"
        }) : /*#__PURE__*/_jsx("p", {
          className: "text-2xl font-bold text-foreground mt-1",
          children: value
        }), change !== undefined && /*#__PURE__*/_jsxs("div", {
          className: cn('flex items-center gap-1 mt-2 text-sm', trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-foreground-muted'),
          children: [trend === 'up' ? /*#__PURE__*/_jsx(TrendingUp, {
            className: "w-4 h-4"
          }) : trend === 'down' ? /*#__PURE__*/_jsx(TrendingDown, {
            className: "w-4 h-4"
          }) : null, /*#__PURE__*/_jsxs("span", {
            children: [change > 0 ? '+' : '', change, "%"]
          }), /*#__PURE__*/_jsx("span", {
            className: "text-foreground-muted",
            children: "so v\u1EDBi k\u1EF3 tr\u01B0\u1EDBc"
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center",
        children: icon
      })]
    })
  });
}

// Enhanced Chart Component with tooltips

function EnhancedBarChart({
  data,
  title,
  color = 'primary',
  showValues = true,
  height = 250
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const colorClasses = {
    primary: 'from-primary-500 to-primary-400',
    success: 'from-green-500 to-green-400',
    warning: 'from-yellow-500 to-yellow-400'
  };
  return /*#__PURE__*/_jsxs("div", {
    children: [title && /*#__PURE__*/_jsx("h3", {
      className: "font-semibold text-foreground mb-4",
      children: title
    }), /*#__PURE__*/_jsx("div", {
      className: "flex items-end gap-1 sm:gap-2",
      style: {
        height
      },
      children: data.map((item, i) => {
        const percentage = item.value / maxValue * 100;
        const isHovered = hoveredIndex === i;
        return /*#__PURE__*/_jsxs("div", {
          className: "flex-1 flex flex-col items-center gap-2 relative",
          onMouseEnter: () => setHoveredIndex(i),
          onMouseLeave: () => setHoveredIndex(null),
          children: [isHovered && /*#__PURE__*/_jsxs("div", {
            className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap z-10 shadow-lg",
            children: [/*#__PURE__*/_jsx("div", {
              className: "font-bold",
              children: formatCurrency(item.value)
            }), item.date && /*#__PURE__*/_jsx("div", {
              className: "opacity-70",
              children: item.date
            }), /*#__PURE__*/_jsx("div", {
              className: "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-foreground"
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "relative w-full flex items-end justify-center",
            style: {
              height: height - 30
            },
            children: /*#__PURE__*/_jsx("div", {
              className: cn('w-full max-w-[50px] rounded-t-lg transition-all duration-300 bg-gradient-to-t', colorClasses[color], isHovered && 'opacity-80 scale-105'),
              style: {
                height: `${Math.max(percentage, 3)}%`
              }
            })
          }), /*#__PURE__*/_jsx("span", {
            className: cn('text-xs transition-colors', isHovered ? 'text-primary-500 font-medium' : 'text-foreground-muted'),
            children: item.label
          }), showValues && /*#__PURE__*/_jsx("span", {
            className: "text-xs text-foreground-secondary font-medium",
            children: item.value >= 1000000 ? `${(item.value / 1000000).toFixed(1)}M` : item.value >= 1000 ? `${(item.value / 1000).toFixed(0)}K` : item.value
          })]
        }, i);
      })
    })]
  });
}

// Donut Chart for distribution
function DonutChart({
  data,
  title,
  size = 180
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;
  const segments = data.map(item => {
    const angle = item.value / total * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return {
      ...item,
      startAngle,
      angle
    };
  });
  const radius = size / 2;
  const strokeWidth = 30;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  return /*#__PURE__*/_jsxs("div", {
    className: "flex items-center gap-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "relative",
      style: {
        width: size,
        height: size
      },
      children: [/*#__PURE__*/_jsx("svg", {
        width: size,
        height: size,
        className: "-rotate-90",
        children: segments.map((segment, i) => {
          const offset = segment.startAngle / 360 * circumference;
          const length = segment.angle / 360 * circumference;
          return /*#__PURE__*/_jsx("circle", {
            cx: radius,
            cy: radius,
            r: normalizedRadius,
            fill: "transparent",
            stroke: segment.color,
            strokeWidth: strokeWidth,
            strokeDasharray: `${length} ${circumference - length}`,
            strokeDashoffset: -offset,
            className: "transition-all duration-300 hover:opacity-80"
          }, i);
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "absolute inset-0 flex flex-col items-center justify-center",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-2xl font-bold text-foreground",
          children: total
        }), /*#__PURE__*/_jsx("span", {
          className: "text-xs text-foreground-muted",
          children: title
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "flex-1 space-y-2",
      children: data.map((item, i) => /*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("span", {
            className: "w-3 h-3 rounded-full",
            style: {
              backgroundColor: item.color
            }
          }), /*#__PURE__*/_jsx("span", {
            className: "text-sm text-foreground",
            children: item.label
          })]
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-sm font-medium text-foreground",
          children: [item.value, " (", (item.value / total * 100).toFixed(0), "%)"]
        })]
      }, i))
    })]
  });
}

// Period Filter Tabs
function PeriodFilterTabs({
  value,
  onChange
}) {
  const options = [{
    value: 'day',
    label: 'Hôm nay'
  }, {
    value: 'week',
    label: 'Tuần này'
  }, {
    value: 'month',
    label: 'Tháng này'
  }];
  return /*#__PURE__*/_jsx("div", {
    className: "inline-flex bg-background-tertiary rounded-lg p-1",
    children: options.map(option => /*#__PURE__*/_jsx("button", {
      onClick: () => onChange(option.value),
      className: cn('px-4 py-2 text-sm font-medium rounded-md transition-all', value === option.value ? 'bg-primary-500 text-white shadow-md' : 'text-foreground-secondary hover:text-foreground'),
      children: option.label
    }, option.value))
  });
}
function BookingItem({
  customer,
  court,
  time,
  status,
  onClick
}) {
  const statusColors = {
    'CONFIRMED': 'bg-booking-confirmed',
    'IN_PROGRESS': 'bg-booking-in-progress',
    'PENDING': 'bg-booking-pending'
  };
  const statusLabels = {
    'CONFIRMED': 'Đã xác nhận',
    'IN_PROGRESS': 'Đang chơi',
    'PENDING': 'Chờ xác nhận'
  };
  return /*#__PURE__*/_jsxs("div", {
    className: cn("flex items-center justify-between py-3 border-b border-border last:border-0", onClick && "cursor-pointer hover:bg-background-tertiary px-2 -mx-2 rounded-lg"),
    onClick: onClick,
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-3",
      children: [/*#__PURE__*/_jsx("div", {
        className: "w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center",
        children: /*#__PURE__*/_jsx("span", {
          className: "text-primary-500 font-medium text-sm",
          children: customer.charAt(0)
        })
      }), /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("p", {
          className: "font-medium text-foreground",
          children: customer
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-sm text-foreground-muted",
          children: [court, " \u2022 ", time]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-2",
      children: [/*#__PURE__*/_jsx("span", {
        className: cn('w-2 h-2 rounded-full', statusColors[status] || 'bg-gray-400')
      }), /*#__PURE__*/_jsx("span", {
        className: "text-sm text-foreground-secondary",
        children: statusLabels[status] || status
      })]
    })]
  });
}
export default function DashboardPage() {
  const navigate = useNavigate();
  const [periodFilter, setPeriodFilter] = useState('day');

  // Fetch dashboard stats based on period
  const {
    data: stats,
    isLoading: loadingStats
  } = useQuery({
    queryKey: ['dashboard', 'stats', periodFilter],
    queryFn: () => reportApi.getDashboardStats()
  });

  // Fetch monthly revenue for growth %
  const {
    data: monthlyRevenue
  } = useQuery({
    queryKey: ['dashboard', 'monthly-revenue', periodFilter],
    queryFn: () => reportApi.getMonthlyRevenue()
  });

  // Fetch upcoming bookings
  const {
    data: upcomingBookings,
    isLoading: loadingBookings
  } = useQuery({
    queryKey: ['dashboard', 'upcoming-bookings'],
    queryFn: () => reportApi.getUpcomingBookings(5)
  });

  // Fetch revenue chart data based on period
  const getDaysForPeriod = () => {
    switch (periodFilter) {
      case 'day':
        return 1;
      case 'week':
        return 7;
      case 'month':
        return 30;
    }
  };
  const {
    data: revenueChart
  } = useQuery({
    queryKey: ['dashboard', 'revenue-chart', periodFilter],
    queryFn: () => reportApi.getRevenueChart(getDaysForPeriod())
  });

  // Chart data transformation
  const chartData = revenueChart?.map(item => ({
    label: periodFilter === 'month' ? item.date.split('-')[2] // Day only
    : item.date.split('-').slice(1).join('/'),
    // MM/DD
    value: item.revenue,
    date: item.date
  })) || [];

  // Booking distribution mock data
  const bookingDistribution = [{
    label: 'Sáng (6-12h)',
    value: 25,
    color: '#10b981'
  }, {
    label: 'Trưa (12-17h)',
    value: 15,
    color: '#f59e0b'
  }, {
    label: 'Tối (17-22h)',
    value: 45,
    color: '#6366f1'
  }];
  const statsCards = [{
    title: periodFilter === 'day' ? 'Doanh thu hôm nay' : periodFilter === 'week' ? 'Doanh thu tuần' : 'Doanh thu tháng',
    value: formatCurrency(stats?.todayRevenue || 0),
    change: monthlyRevenue?.growth,
    icon: /*#__PURE__*/_jsx(DollarSign, {
      className: "w-6 h-6 text-primary-500"
    }),
    trend: (monthlyRevenue?.growth || 0) >= 0 ? 'up' : 'down',
    onClick: () => navigate('/reports')
  }, {
    title: 'Lượt đặt sân',
    value: String(stats?.todayBookings || 0),
    icon: /*#__PURE__*/_jsx(Calendar, {
      className: "w-6 h-6 text-primary-500"
    }),
    trend: 'neutral',
    onClick: () => navigate('/calendar')
  }, {
    title: 'Khách hàng hoạt động',
    value: String(stats?.activeCustomers || 0),
    icon: /*#__PURE__*/_jsx(Users, {
      className: "w-6 h-6 text-primary-500"
    }),
    trend: 'neutral',
    onClick: () => navigate('/customers')
  }, {
    title: 'Sân trống / Đang chơi',
    value: `${stats?.courtsAvailable || 0} / ${stats?.courtsInUse || 0}`,
    icon: /*#__PURE__*/_jsx(Grid3X3, {
      className: "w-6 h-6 text-primary-500"
    }),
    trend: 'neutral',
    onClick: () => navigate('/courts')
  }];
  const chartTitle = periodFilter === 'day' ? 'Doanh thu theo giờ' : periodFilter === 'week' ? 'Doanh thu 7 ngày qua' : 'Doanh thu 30 ngày qua';
  return /*#__PURE__*/_jsxs("div", {
    className: "p-6 space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold text-foreground",
          children: "T\u1ED5ng quan"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-foreground-secondary",
          children: "Xin ch\xE0o! \u0110\xE2y l\xE0 t\u1ED5ng quan ho\u1EA1t \u0111\u1ED9ng c\u1EE7a b\u1EA1n."
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsx(PeriodFilterTabs, {
          value: periodFilter,
          onChange: setPeriodFilter
        }), stats?.pendingInvoices && stats.pendingInvoices > 0 && /*#__PURE__*/_jsxs("button", {
          onClick: () => navigate('/invoices'),
          className: "hidden sm:flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors",
          children: [/*#__PURE__*/_jsx(FileText, {
            className: "w-4 h-4"
          }), stats.pendingInvoices, " ch\u1EDD thanh to\xE1n"]
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
      children: statsCards.map((stat, i) => /*#__PURE__*/_jsx(StatsCard, {
        ...stat,
        loading: loadingStats
      }, i))
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "lg:col-span-2 bg-background-secondary border border-border rounded-xl p-5",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(BarChart3, {
              className: "w-5 h-5 text-primary-500"
            }), /*#__PURE__*/_jsx("h2", {
              className: "font-semibold text-foreground",
              children: chartTitle
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-sm text-foreground-secondary",
            children: ["T\u1ED5ng: ", /*#__PURE__*/_jsx("span", {
              className: "font-semibold text-foreground",
              children: formatCurrency(revenueChart?.reduce((sum, d) => sum + d.revenue, 0) || 0)
            })]
          })]
        }), chartData.length > 0 ? /*#__PURE__*/_jsx(EnhancedBarChart, {
          data: chartData,
          color: "primary",
          showValues: periodFilter !== 'month',
          height: periodFilter === 'month' ? 200 : 250
        }) : /*#__PURE__*/_jsx("div", {
          className: "h-[250px] flex items-center justify-center text-foreground-muted",
          children: /*#__PURE__*/_jsxs("div", {
            className: "text-center",
            children: [/*#__PURE__*/_jsx(BarChart3, {
              className: "w-12 h-12 mx-auto mb-2 opacity-50"
            }), /*#__PURE__*/_jsx("p", {
              children: "Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u"
            })]
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-xl p-5",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 mb-4",
          children: [/*#__PURE__*/_jsx(PieChartIcon, {
            className: "w-5 h-5 text-primary-500"
          }), /*#__PURE__*/_jsx("h2", {
            className: "font-semibold text-foreground",
            children: "Ph\xE2n b\u1ED5 \u0111\u1EB7t s\xE2n"
          })]
        }), /*#__PURE__*/_jsx(DonutChart, {
          data: bookingDistribution,
          title: "L\u01B0\u1EE3t \u0111\u1EB7t"
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-xl p-5",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Clock, {
              className: "w-5 h-5 text-primary-500"
            }), /*#__PURE__*/_jsx("h2", {
              className: "font-semibold text-foreground",
              children: "L\u1ECBch \u0111\u1EB7t s\xE2n s\u1EAFp t\u1EDBi"
            })]
          }), /*#__PURE__*/_jsxs(Button, {
            variant: "ghost",
            size: "sm",
            onClick: () => navigate('/calendar'),
            children: ["Xem t\u1EA5t c\u1EA3", /*#__PURE__*/_jsx(ChevronRight, {
              className: "w-4 h-4 ml-1"
            })]
          })]
        }), loadingBookings ? /*#__PURE__*/_jsx("div", {
          className: "space-y-4",
          children: [...Array(3)].map((_, i) => /*#__PURE__*/_jsx("div", {
            className: "h-16 bg-background-tertiary rounded animate-pulse"
          }, i))
        }) : upcomingBookings && upcomingBookings.length > 0 ? /*#__PURE__*/_jsx("div", {
          className: "space-y-1",
          children: upcomingBookings.map(booking => /*#__PURE__*/_jsx(BookingItem, {
            customer: booking.customerName,
            court: booking.courtName,
            time: `${booking.startTime} - ${booking.endTime}`,
            date: formatDate(booking.date),
            status: booking.status,
            onClick: () => navigate(`/calendar?booking=${booking.id}`)
          }, booking.id))
        }) : /*#__PURE__*/_jsxs("div", {
          className: "text-center py-8 text-foreground-muted",
          children: [/*#__PURE__*/_jsx(Calendar, {
            className: "w-12 h-12 mx-auto mb-2 opacity-50"
          }), /*#__PURE__*/_jsx("p", {
            children: "Kh\xF4ng c\xF3 l\u1ECBch \u0111\u1EB7t s\xE2n s\u1EAFp t\u1EDBi"
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-xl p-5",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 mb-4",
          children: [/*#__PURE__*/_jsx(Activity, {
            className: "w-5 h-5 text-primary-500"
          }), /*#__PURE__*/_jsx("h2", {
            className: "font-semibold text-foreground",
            children: "Thao t\xE1c nhanh"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-3",
          children: [/*#__PURE__*/_jsxs("button", {
            onClick: () => navigate('/calendar'),
            className: "flex flex-col items-center gap-2 p-4 rounded-xl bg-background-tertiary hover:bg-primary-500/10 hover:text-primary-500 transition-all group",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-12 h-12 rounded-xl bg-primary-500/10 group-hover:bg-primary-500/20 flex items-center justify-center transition-colors",
              children: /*#__PURE__*/_jsx(Calendar, {
                className: "w-6 h-6 text-primary-500"
              })
            }), /*#__PURE__*/_jsx("span", {
              className: "text-sm font-medium",
              children: "\u0110\u1EB7t s\xE2n m\u1EDBi"
            })]
          }), /*#__PURE__*/_jsxs("button", {
            onClick: () => navigate('/customers'),
            className: "flex flex-col items-center gap-2 p-4 rounded-xl bg-background-tertiary hover:bg-primary-500/10 hover:text-primary-500 transition-all group",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-12 h-12 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center transition-colors",
              children: /*#__PURE__*/_jsx(Users, {
                className: "w-6 h-6 text-green-500"
              })
            }), /*#__PURE__*/_jsx("span", {
              className: "text-sm font-medium",
              children: "Th\xEAm kh\xE1ch h\xE0ng"
            })]
          }), /*#__PURE__*/_jsxs("button", {
            onClick: () => navigate('/calendar'),
            className: "flex flex-col items-center gap-2 p-4 rounded-xl bg-background-tertiary hover:bg-primary-500/10 hover:text-primary-500 transition-all group",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-12 h-12 rounded-xl bg-yellow-500/10 group-hover:bg-yellow-500/20 flex items-center justify-center transition-colors",
              children: /*#__PURE__*/_jsx(Clock, {
                className: "w-6 h-6 text-yellow-500"
              })
            }), /*#__PURE__*/_jsx("span", {
              className: "text-sm font-medium",
              children: "Check-in"
            })]
          }), /*#__PURE__*/_jsxs("button", {
            onClick: () => navigate('/invoices'),
            className: "flex flex-col items-center gap-2 p-4 rounded-xl bg-background-tertiary hover:bg-primary-500/10 hover:text-primary-500 transition-all group",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-12 h-12 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors",
              children: /*#__PURE__*/_jsx(DollarSign, {
                className: "w-6 h-6 text-purple-500"
              })
            }), /*#__PURE__*/_jsx("span", {
              className: "text-sm font-medium",
              children: "Thanh to\xE1n"
            })]
          })]
        })]
      })]
    })]
  });
}