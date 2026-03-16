import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, User, Phone, Mail, Star, Trophy, ChevronLeft, ChevronRight, X, Edit2, Trash2 } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { customerApi } from '@/services/customer.service';
import { useToast } from '@/hooks/use-toast';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getMembershipColor(tier) {
  switch (tier) {
    case 'PLATINUM':
      return 'bg-gradient-to-r from-slate-400 to-slate-600 text-white';
    case 'GOLD':
      return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
    case 'SILVER':
      return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
    case 'BRONZE':
      return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
}
function getMembershipLabel(tier) {
  switch (tier) {
    case 'PLATINUM':
      return 'Bạch Kim';
    case 'GOLD':
      return 'Vàng';
    case 'SILVER':
      return 'Bạc';
    case 'BRONZE':
      return 'Đồng';
    default:
      return 'Thường';
  }
}
export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();

  // Fetch customers
  const {
    data: customersData,
    isLoading
  } = useQuery({
    queryKey: ['customers', searchQuery, selectedTier, page],
    queryFn: () => customerApi.getAll({
      search: searchQuery || undefined,
      membershipTier: selectedTier || undefined,
      page,
      limit: 10
    })
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: input => customerApi.create(input),
    onSuccess: () => {
      toast({
        title: 'Thêm khách hàng thành công!'
      });
      queryClient.invalidateQueries({
        queryKey: ['customers']
      });
      closeModal();
    },
    onError: () => {
      toast({
        title: 'Lỗi khi thêm khách hàng',
        variant: 'error'
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input
    }) => customerApi.update(id, input),
    onSuccess: () => {
      toast({
        title: 'Cập nhật thành công!'
      });
      queryClient.invalidateQueries({
        queryKey: ['customers']
      });
      closeModal();
    },
    onError: () => {
      toast({
        title: 'Lỗi khi cập nhật',
        variant: 'error'
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: id => customerApi.delete(id),
    onSuccess: () => {
      toast({
        title: 'Đã xóa khách hàng!'
      });
      queryClient.invalidateQueries({
        queryKey: ['customers']
      });
    },
    onError: () => {
      toast({
        title: 'Lỗi khi xóa',
        variant: 'error'
      });
    }
  });
  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      notes: ''
    });
    setIsModalOpen(true);
  };
  const openEditModal = customer => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      notes: customer.notes || ''
    });
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: ''
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (editingCustomer) {
      updateMutation.mutate({
        id: editingCustomer.id,
        input: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };
  const handleDelete = customer => {
    if (confirm(`Bạn có chắc muốn xóa khách hàng "${customer.name}"?`)) {
      deleteMutation.mutate(customer.id);
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col h-full",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold text-foreground",
          children: "Kh\xE1ch H\xE0ng"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-foreground-secondary",
          children: "Qu\u1EA3n l\xFD th\xF4ng tin kh\xE1ch h\xE0ng v\xE0 th\xE0nh vi\xEAn"
        })]
      }), /*#__PURE__*/_jsxs(Button, {
        className: "gap-2",
        onClick: openCreateModal,
        children: [/*#__PURE__*/_jsx(Plus, {
          className: "w-4 h-4"
        }), "Th\xEAm kh\xE1ch h\xE0ng"]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-4 mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative flex-1 max-w-md",
        children: [/*#__PURE__*/_jsx(Search, {
          className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary"
        }), /*#__PURE__*/_jsx("input", {
          type: "text",
          placeholder: "T\xECm theo t\xEAn ho\u1EB7c s\u1ED1 \u0111i\u1EC7n tho\u1EA1i...",
          value: searchQuery,
          onChange: e => {
            setSearchQuery(e.target.value);
            setPage(1);
          },
          className: "w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary-500"
        })]
      }), /*#__PURE__*/_jsxs("select", {
        value: selectedTier,
        onChange: e => {
          setSelectedTier(e.target.value);
          setPage(1);
        },
        className: "bg-background-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
        children: [/*#__PURE__*/_jsx("option", {
          value: "",
          children: "T\u1EA5t c\u1EA3 h\u1EA1ng"
        }), /*#__PURE__*/_jsx("option", {
          value: "PLATINUM",
          children: "B\u1EA1ch Kim"
        }), /*#__PURE__*/_jsx("option", {
          value: "GOLD",
          children: "V\xE0ng"
        }), /*#__PURE__*/_jsx("option", {
          value: "SILVER",
          children: "B\u1EA1c"
        }), /*#__PURE__*/_jsx("option", {
          value: "BRONZE",
          children: "\u0110\u1ED3ng"
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "flex-1 overflow-auto",
      children: isLoading ? /*#__PURE__*/_jsx("div", {
        className: "flex items-center justify-center h-64",
        children: /*#__PURE__*/_jsx("div", {
          className: "animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        })
      }) : customersData?.data.length === 0 ? /*#__PURE__*/_jsxs("div", {
        className: "flex flex-col items-center justify-center h-64 text-foreground-secondary",
        children: [/*#__PURE__*/_jsx(User, {
          className: "w-12 h-12 mb-4 opacity-50"
        }), /*#__PURE__*/_jsx("p", {
          children: "Ch\u01B0a c\xF3 kh\xE1ch h\xE0ng n\xE0o"
        })]
      }) : /*#__PURE__*/_jsx("div", {
        className: "grid gap-4",
        children: customersData?.data.map(customer => /*#__PURE__*/_jsx("div", {
          className: "bg-background-secondary border border-border rounded-lg p-4 hover:border-primary-500/50 transition-colors",
          children: /*#__PURE__*/_jsxs("div", {
            className: "flex items-start justify-between",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex gap-4",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center",
                children: /*#__PURE__*/_jsx(User, {
                  className: "w-6 h-6 text-primary-500"
                })
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx("h3", {
                    className: "font-semibold text-foreground",
                    children: customer.name
                  }), /*#__PURE__*/_jsx("span", {
                    className: cn('px-2 py-0.5 rounded-full text-xs font-medium', getMembershipColor(customer.membershipTier)),
                    children: getMembershipLabel(customer.membershipTier)
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-4 mt-1 text-sm text-foreground-secondary",
                  children: [/*#__PURE__*/_jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [/*#__PURE__*/_jsx(Phone, {
                      className: "w-3 h-3"
                    }), customer.phone]
                  }), customer.email && /*#__PURE__*/_jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [/*#__PURE__*/_jsx(Mail, {
                      className: "w-3 h-3"
                    }), customer.email]
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-4 mt-2",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-1 text-sm",
                    children: [/*#__PURE__*/_jsx(Trophy, {
                      className: "w-4 h-4 text-amber-500"
                    }), /*#__PURE__*/_jsxs("span", {
                      className: "text-foreground-secondary",
                      children: [customer.totalBookings, " l\u1EA7n \u0111\u1EB7t"]
                    })]
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-1 text-sm",
                    children: [/*#__PURE__*/_jsx(Star, {
                      className: "w-4 h-4 text-yellow-500"
                    }), /*#__PURE__*/_jsxs("span", {
                      className: "text-foreground-secondary",
                      children: [customer.points, " \u0111i\u1EC3m"]
                    })]
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-sm text-primary-500 font-medium",
                    children: formatCurrency(customer.totalSpent)
                  })]
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx("button", {
                onClick: () => openEditModal(customer),
                className: "p-2 hover:bg-background-tertiary rounded-lg transition-colors",
                children: /*#__PURE__*/_jsx(Edit2, {
                  className: "w-4 h-4 text-foreground-secondary"
                })
              }), /*#__PURE__*/_jsx("button", {
                onClick: () => handleDelete(customer),
                className: "p-2 hover:bg-red-500/10 rounded-lg transition-colors",
                children: /*#__PURE__*/_jsx(Trash2, {
                  className: "w-4 h-4 text-red-500"
                })
              })]
            })]
          })
        }, customer.id))
      })
    }), customersData && customersData.pagination.totalPages > 1 && /*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mt-4 pt-4 border-t border-border",
      children: [/*#__PURE__*/_jsxs("span", {
        className: "text-sm text-foreground-secondary",
        children: ["Hi\u1EC3n th\u1ECB ", customersData.data.length, " / ", customersData.pagination.total, " kh\xE1ch h\xE0ng"]
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
          children: ["Trang ", page, " / ", customersData.pagination.totalPages]
        }), /*#__PURE__*/_jsx(Button, {
          variant: "ghost",
          size: "sm",
          onClick: () => setPage(p => Math.min(customersData.pagination.totalPages, p + 1)),
          disabled: page === customersData.pagination.totalPages,
          children: /*#__PURE__*/_jsx(ChevronRight, {
            className: "w-4 h-4"
          })
        })]
      })]
    }), isModalOpen && /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-xl shadow-xl w-full max-w-md animate-slide-up",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between p-4 border-b border-border",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-lg font-semibold",
            children: editingCustomer ? 'Sửa khách hàng' : 'Thêm khách hàng'
          }), /*#__PURE__*/_jsx("button", {
            onClick: closeModal,
            className: "p-1 hover:bg-background-hover rounded",
            children: /*#__PURE__*/_jsx(X, {
              className: "w-5 h-5"
            })
          })]
        }), /*#__PURE__*/_jsxs("form", {
          onSubmit: handleSubmit,
          className: "p-4 space-y-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "block text-sm text-foreground-secondary mb-1",
              children: ["H\u1ECD t\xEAn ", /*#__PURE__*/_jsx("span", {
                className: "text-red-500",
                children: "*"
              })]
            }), /*#__PURE__*/_jsx("input", {
              type: "text",
              value: formData.name,
              onChange: e => setFormData({
                ...formData,
                name: e.target.value
              }),
              required: true,
              className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
              placeholder: "Nguy\u1EC5n V\u0103n A"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "block text-sm text-foreground-secondary mb-1",
              children: ["S\u1ED1 \u0111i\u1EC7n tho\u1EA1i ", /*#__PURE__*/_jsx("span", {
                className: "text-red-500",
                children: "*"
              })]
            }), /*#__PURE__*/_jsx("input", {
              type: "tel",
              value: formData.phone,
              onChange: e => setFormData({
                ...formData,
                phone: e.target.value
              }),
              required: true,
              className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
              placeholder: "0912345678"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm text-foreground-secondary mb-1",
              children: "Email"
            }), /*#__PURE__*/_jsx("input", {
              type: "email",
              value: formData.email || '',
              onChange: e => setFormData({
                ...formData,
                email: e.target.value
              }),
              className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
              placeholder: "email@example.com"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm text-foreground-secondary mb-1",
              children: "Ghi ch\xFA"
            }), /*#__PURE__*/_jsx("textarea", {
              value: formData.notes || '',
              onChange: e => setFormData({
                ...formData,
                notes: e.target.value
              }),
              rows: 3,
              className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none",
              placeholder: "Ghi ch\xFA v\u1EC1 kh\xE1ch h\xE0ng..."
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-2 pt-2",
            children: [/*#__PURE__*/_jsx(Button, {
              type: "button",
              variant: "ghost",
              className: "flex-1",
              onClick: closeModal,
              children: "H\u1EE7y"
            }), /*#__PURE__*/_jsx(Button, {
              type: "submit",
              className: "flex-1",
              disabled: createMutation.isPending || updateMutation.isPending,
              children: editingCustomer ? 'Lưu' : 'Thêm'
            })]
          })]
        })]
      })
    })]
  });
}