import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, User, Phone, Mail, Calendar, Trophy, Star, Edit2, Trash2, CreditCard, TrendingUp, Gift } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { customerApi } from '@/services/customer.service';
import { CustomerBookingHistory } from '@/components/customer';
import { useToast } from '@/hooks/use-toast';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getMembershipConfig(tier) {
  switch (tier) {
    case 'PLATINUM':
      return {
        label: 'Platinum',
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      };
    case 'GOLD':
      return {
        label: 'Vàng',
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      };
    case 'SILVER':
      return {
        label: 'Bạc',
        color: 'bg-gray-400/20 text-gray-300 border-gray-400/50'
      };
    case 'BRONZE':
      return {
        label: 'Đồng',
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      };
    default:
      return {
        label: 'Thường',
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
      };
  }
}
export default function CustomerDetailPage() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('history');
  const {
    data: customer,
    isLoading,
    error
  } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getById(id),
    enabled: !!id
  });
  const deleteMutation = useMutation({
    mutationFn: customerId => customerApi.delete(customerId),
    onSuccess: () => {
      toast({
        title: 'Đã xóa khách hàng'
      });
      queryClient.invalidateQueries({
        queryKey: ['customers']
      });
      navigate('/customers');
    },
    onError: () => {
      toast({
        title: 'Lỗi khi xóa khách hàng',
        variant: 'error'
      });
    }
  });
  if (isLoading) {
    return /*#__PURE__*/_jsxs("div", {
      className: "p-6 space-y-6",
      children: [/*#__PURE__*/_jsx("div", {
        className: "h-8 w-48 bg-background-tertiary rounded animate-pulse"
      }), /*#__PURE__*/_jsx("div", {
        className: "h-64 bg-background-tertiary rounded-xl animate-pulse"
      })]
    });
  }
  if (error || !customer) {
    return /*#__PURE__*/_jsx("div", {
      className: "p-6",
      children: /*#__PURE__*/_jsxs("div", {
        className: "text-center py-16",
        children: [/*#__PURE__*/_jsx(User, {
          className: "w-12 h-12 mx-auto mb-4 text-foreground-muted opacity-50"
        }), /*#__PURE__*/_jsx("h2", {
          className: "text-lg font-semibold text-foreground mb-2",
          children: "Kh\xF4ng t\xECm th\u1EA5y kh\xE1ch h\xE0ng"
        }), /*#__PURE__*/_jsx(Button, {
          onClick: () => navigate('/customers'),
          children: "Quay l\u1EA1i"
        })]
      })
    });
  }
  const membershipConfig = getMembershipConfig(customer.membershipTier);
  const tabs = [{
    id: 'history',
    label: 'Lịch sử đặt sân'
  }, {
    id: 'points',
    label: 'Điểm tích lũy'
  }, {
    id: 'notes',
    label: 'Ghi chú'
  }];
  return /*#__PURE__*/_jsxs("div", {
    className: "p-6 space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-4",
      children: [/*#__PURE__*/_jsx("button", {
        onClick: () => navigate('/customers'),
        className: "p-2 rounded-lg hover:bg-background-tertiary transition-colors",
        children: /*#__PURE__*/_jsx(ArrowLeft, {
          className: "w-5 h-5 text-foreground-secondary"
        })
      }), /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold text-foreground",
          children: "Chi ti\u1EBFt kh\xE1ch h\xE0ng"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-foreground-secondary",
          children: "Xem v\xE0 qu\u1EA3n l\xFD th\xF4ng tin kh\xE1ch h\xE0ng"
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "bg-background-secondary border border-border rounded-xl p-6",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex flex-col md:flex-row gap-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-4",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center",
            children: /*#__PURE__*/_jsx("span", {
              className: "text-primary-500 font-bold text-3xl",
              children: customer.name.charAt(0)
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx("h2", {
                className: "text-xl font-semibold text-foreground",
                children: customer.name
              }), /*#__PURE__*/_jsxs("span", {
                className: cn('text-xs px-2 py-0.5 rounded-full font-medium border', membershipConfig.color),
                children: [/*#__PURE__*/_jsx(Trophy, {
                  className: "w-3 h-3 inline mr-1"
                }), membershipConfig.label]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-4 mt-2 text-sm text-foreground-secondary",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(Phone, {
                  className: "w-4 h-4"
                }), customer.phone]
              }), customer.email && /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(Mail, {
                  className: "w-4 h-4"
                }), customer.email]
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 md:ml-auto",
          children: [/*#__PURE__*/_jsxs(Button, {
            variant: "secondary",
            size: "sm",
            className: "gap-2",
            children: [/*#__PURE__*/_jsx(Edit2, {
              className: "w-4 h-4"
            }), "S\u1EEDa"]
          }), /*#__PURE__*/_jsxs(Button, {
            variant: "destructive",
            size: "sm",
            className: "gap-2",
            onClick: () => {
              if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
                deleteMutation.mutate(customer.id);
              }
            },
            children: [/*#__PURE__*/_jsx(Trash2, {
              className: "w-4 h-4"
            }), "X\xF3a"]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "bg-background-tertiary rounded-lg p-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 text-sm text-foreground-secondary mb-1",
            children: [/*#__PURE__*/_jsx(Calendar, {
              className: "w-4 h-4"
            }), "L\u01B0\u1EE3t \u0111\u1EB7t"]
          }), /*#__PURE__*/_jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: customer.totalBookings || 0
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-background-tertiary rounded-lg p-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 text-sm text-foreground-secondary mb-1",
            children: [/*#__PURE__*/_jsx(CreditCard, {
              className: "w-4 h-4"
            }), "T\u1ED5ng chi ti\xEAu"]
          }), /*#__PURE__*/_jsx("p", {
            className: "text-2xl font-bold text-primary-500",
            children: formatCurrency(customer.totalSpent || 0)
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-background-tertiary rounded-lg p-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 text-sm text-foreground-secondary mb-1",
            children: [/*#__PURE__*/_jsx(Star, {
              className: "w-4 h-4"
            }), "\u0110i\u1EC3m t\xEDch l\u0169y"]
          }), /*#__PURE__*/_jsx("p", {
            className: "text-2xl font-bold text-yellow-500",
            children: customer.points?.toLocaleString() || 0
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-background-tertiary rounded-lg p-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 text-sm text-foreground-secondary mb-1",
            children: [/*#__PURE__*/_jsx(TrendingUp, {
              className: "w-4 h-4"
            }), "TB/th\xE1ng"]
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-2xl font-bold text-foreground",
            children: [Math.round((customer.totalBookings || 0) / 12), " l\u01B0\u1EE3t"]
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "bg-background-secondary border border-border rounded-xl",
      children: [/*#__PURE__*/_jsx("div", {
        className: "flex border-b border-border",
        children: tabs.map(tab => /*#__PURE__*/_jsxs("button", {
          onClick: () => setActiveTab(tab.id),
          className: cn('px-6 py-3 text-sm font-medium transition-colors relative', activeTab === tab.id ? 'text-primary-500' : 'text-foreground-secondary hover:text-foreground'),
          children: [tab.label, activeTab === tab.id && /*#__PURE__*/_jsx("div", {
            className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
          })]
        }, tab.id))
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-4",
        children: [activeTab === 'history' && /*#__PURE__*/_jsx(CustomerBookingHistory, {
          customerId: customer.id
        }), activeTab === 'points' && /*#__PURE__*/_jsxs("div", {
          className: "py-8 text-center text-foreground-muted",
          children: [/*#__PURE__*/_jsx(Gift, {
            className: "w-12 h-12 mx-auto mb-4 opacity-50"
          }), /*#__PURE__*/_jsx("h3", {
            className: "font-medium text-foreground mb-2",
            children: "L\u1ECBch s\u1EED \u0111i\u1EC3m"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-sm",
            children: ["\u0110i\u1EC3m hi\u1EC7n t\u1EA1i: ", /*#__PURE__*/_jsx("strong", {
              className: "text-yellow-500",
              children: customer.points?.toLocaleString() || 0
            })]
          })]
        }), activeTab === 'notes' && /*#__PURE__*/_jsxs("div", {
          className: "py-8 text-center text-foreground-muted",
          children: [/*#__PURE__*/_jsx(Edit2, {
            className: "w-12 h-12 mx-auto mb-4 opacity-50"
          }), /*#__PURE__*/_jsx("h3", {
            className: "font-medium text-foreground mb-2",
            children: "Ghi ch\xFA"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm",
            children: "Ch\u01B0a c\xF3 ghi ch\xFA n\xE0o"
          })]
        })]
      })]
    })]
  });
}