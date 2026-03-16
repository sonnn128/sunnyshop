import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Building2, Clock, MapPin, Phone, Pencil, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { venueApi } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const defaultFormData = {
  name: '',
  address: '',
  phone: '',
  openTime: '06:00',
  closeTime: '23:00'
};
export default function VenuesPage() {
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch venues
  const {
    data: venuesData,
    isLoading
  } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venueApi.getAll({})
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: data => venueApi.create(data),
    onSuccess: () => {
      toast({
        title: 'Đã tạo cơ sở mới!'
      });
      queryClient.invalidateQueries({
        queryKey: ['venues']
      });
      handleCloseModal();
    },
    onError: () => {
      toast({
        title: 'Lỗi khi tạo cơ sở',
        variant: 'error'
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }) => venueApi.update(id, data),
    onSuccess: () => {
      toast({
        title: 'Đã cập nhật cơ sở!'
      });
      queryClient.invalidateQueries({
        queryKey: ['venues']
      });
      handleCloseModal();
    },
    onError: () => {
      toast({
        title: 'Lỗi khi cập nhật cơ sở',
        variant: 'error'
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: id => venueApi.delete(id),
    onSuccess: () => {
      toast({
        title: 'Đã xóa cơ sở!'
      });
      queryClient.invalidateQueries({
        queryKey: ['venues']
      });
      setDeleteConfirm(null);
    },
    onError: () => {
      toast({
        title: 'Lỗi khi xóa cơ sở',
        variant: 'error'
      });
    }
  });
  const handleOpenModal = venue => {
    if (venue) {
      setEditingVenue(venue);
      setFormData({
        name: venue.name,
        address: venue.address,
        phone: venue.phone || '',
        openTime: venue.openTime,
        closeTime: venue.closeTime
      });
    } else {
      setEditingVenue(null);
      setFormData(defaultFormData);
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVenue(null);
    setFormData(defaultFormData);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: 'Vui lòng nhập tên cơ sở',
        variant: 'error'
      });
      return;
    }
    if (!formData.address.trim()) {
      toast({
        title: 'Vui lòng nhập địa chỉ',
        variant: 'error'
      });
      return;
    }
    const data = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim() || undefined,
      openTime: formData.openTime,
      closeTime: formData.closeTime
    };
    if (editingVenue) {
      updateMutation.mutate({
        id: editingVenue.id,
        data
      });
    } else {
      createMutation.mutate(data);
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold text-foreground",
          children: "Qu\u1EA3n l\xFD c\u01A1 s\u1EDF"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-foreground-secondary",
          children: "Qu\u1EA3n l\xFD c\xE1c c\u01A1 s\u1EDF, chi nh\xE1nh c\u1EE7a b\u1EA1n"
        })]
      }), /*#__PURE__*/_jsxs(Button, {
        className: "gap-2",
        onClick: () => handleOpenModal(),
        children: [/*#__PURE__*/_jsx(Plus, {
          className: "w-4 h-4"
        }), "Th\xEAm c\u01A1 s\u1EDF"]
      })]
    }), isLoading ? /*#__PURE__*/_jsx("div", {
      className: "flex items-center justify-center h-64",
      children: /*#__PURE__*/_jsx("div", {
        className: "animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
      })
    }) : venuesData?.data.length === 0 ? /*#__PURE__*/_jsxs("div", {
      className: "bg-background-secondary rounded-xl border border-border p-12 text-center",
      children: [/*#__PURE__*/_jsx(Building2, {
        className: "w-12 h-12 text-foreground-muted mx-auto mb-4"
      }), /*#__PURE__*/_jsx("h3", {
        className: "text-lg font-medium text-foreground mb-2",
        children: "Ch\u01B0a c\xF3 c\u01A1 s\u1EDF n\xE0o"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-foreground-secondary mb-4",
        children: "T\u1EA1o c\u01A1 s\u1EDF \u0111\u1EA7u ti\xEAn \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u qu\u1EA3n l\xFD"
      }), /*#__PURE__*/_jsxs(Button, {
        onClick: () => handleOpenModal(),
        children: [/*#__PURE__*/_jsx(Plus, {
          className: "w-4 h-4 mr-2"
        }), "Th\xEAm c\u01A1 s\u1EDF"]
      })]
    }) : /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      children: venuesData?.data.map(venue => /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary rounded-xl border border-border p-6 hover:border-primary-500/50 transition-colors",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-start justify-between mb-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center",
              children: /*#__PURE__*/_jsx(Building2, {
                className: "w-6 h-6 text-primary-500"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "font-semibold text-foreground",
                children: venue.name
              }), /*#__PURE__*/_jsx("span", {
                className: cn('text-xs px-2 py-0.5 rounded-full', venue.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'),
                children: venue.isActive ? 'Hoạt động' : 'Đóng cửa'
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1",
            children: [/*#__PURE__*/_jsx("button", {
              onClick: () => handleOpenModal(venue),
              className: "p-2 rounded-lg hover:bg-background-tertiary transition-colors",
              title: "Ch\u1EC9nh s\u1EEDa",
              children: /*#__PURE__*/_jsx(Pencil, {
                className: "w-4 h-4 text-foreground-secondary"
              })
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => setDeleteConfirm(venue.id),
              className: "p-2 rounded-lg hover:bg-red-500/10 transition-colors",
              title: "X\xF3a",
              children: /*#__PURE__*/_jsx(Trash2, {
                className: "w-4 h-4 text-red-400"
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-3 text-sm",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-start gap-2",
            children: [/*#__PURE__*/_jsx(MapPin, {
              className: "w-4 h-4 text-foreground-muted mt-0.5"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-foreground-secondary",
              children: venue.address
            })]
          }), venue.phone && /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Phone, {
              className: "w-4 h-4 text-foreground-muted"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-foreground-secondary",
              children: venue.phone
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Clock, {
              className: "w-4 h-4 text-foreground-muted"
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-foreground-secondary",
              children: [venue.openTime, " - ", venue.closeTime]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-2xl font-bold text-foreground",
              children: venue._count?.courts || 0
            }), /*#__PURE__*/_jsx("div", {
              className: "text-xs text-foreground-secondary",
              children: "S\xE2n"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-2xl font-bold text-foreground",
              children: venue._count?.pricingRules || 0
            }), /*#__PURE__*/_jsx("div", {
              className: "text-xs text-foreground-secondary",
              children: "B\u1EA3ng gi\xE1"
            })]
          })]
        }), deleteConfirm === venue.id && /*#__PURE__*/_jsxs("div", {
          className: "mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 text-red-400 mb-2",
            children: [/*#__PURE__*/_jsx(AlertCircle, {
              className: "w-4 h-4"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-sm font-medium",
              children: "X\xE1c nh\u1EADn x\xF3a?"
            })]
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-foreground-secondary mb-3",
            children: "H\xE0nh \u0111\u1ED9ng n\xE0y kh\xF4ng th\u1EC3 ho\xE0n t\xE1c!"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-2",
            children: [/*#__PURE__*/_jsx(Button, {
              size: "sm",
              variant: "secondary",
              onClick: () => setDeleteConfirm(null),
              children: "H\u1EE7y"
            }), /*#__PURE__*/_jsx(Button, {
              size: "sm",
              variant: "destructive",
              onClick: () => deleteMutation.mutate(venue.id),
              isLoading: deleteMutation.isPending,
              children: "X\xF3a"
            })]
          })]
        })]
      }, venue.id))
    }), showModal && /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx("div", {
        className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50",
        onClick: handleCloseModal
      }), /*#__PURE__*/_jsx("div", {
        className: "fixed inset-0 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/_jsxs("div", {
          className: "bg-background-secondary rounded-2xl shadow-2xl w-full max-w-md",
          onClick: e => e.stopPropagation(),
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between p-4 border-b border-border",
            children: [/*#__PURE__*/_jsx("h2", {
              className: "text-lg font-semibold text-foreground",
              children: editingVenue ? 'Chỉnh sửa cơ sở' : 'Thêm cơ sở mới'
            }), /*#__PURE__*/_jsx("button", {
              onClick: handleCloseModal,
              className: "p-1 rounded-lg hover:bg-background-tertiary transition-colors",
              children: /*#__PURE__*/_jsx(X, {
                className: "w-5 h-5 text-foreground-secondary"
              })
            })]
          }), /*#__PURE__*/_jsxs("form", {
            onSubmit: handleSubmit,
            className: "p-4 space-y-4",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium text-foreground-secondary mb-1.5",
                children: "T\xEAn c\u01A1 s\u1EDF *"
              }), /*#__PURE__*/_jsx(Input, {
                value: formData.name,
                onChange: e => setFormData({
                  ...formData,
                  name: e.target.value
                }),
                placeholder: "VD: Courtify Ph\xFA Nhu\u1EADn",
                required: true
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium text-foreground-secondary mb-1.5",
                children: "\u0110\u1ECBa ch\u1EC9 *"
              }), /*#__PURE__*/_jsx(Input, {
                value: formData.address,
                onChange: e => setFormData({
                  ...formData,
                  address: e.target.value
                }),
                placeholder: "VD: 123 Nguy\u1EC5n V\u0103n Tr\u1ED7i, Qu\u1EADn Ph\xFA Nhu\u1EADn",
                required: true
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium text-foreground-secondary mb-1.5",
                children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i"
              }), /*#__PURE__*/_jsx(Input, {
                value: formData.phone,
                onChange: e => setFormData({
                  ...formData,
                  phone: e.target.value
                }),
                placeholder: "VD: 0901234567"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-2 gap-3",
              children: [/*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("label", {
                  className: "block text-sm font-medium text-foreground-secondary mb-1.5",
                  children: "Gi\u1EDD m\u1EDF c\u1EEDa"
                }), /*#__PURE__*/_jsx(Input, {
                  type: "time",
                  value: formData.openTime,
                  onChange: e => setFormData({
                    ...formData,
                    openTime: e.target.value
                  })
                })]
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("label", {
                  className: "block text-sm font-medium text-foreground-secondary mb-1.5",
                  children: "Gi\u1EDD \u0111\xF3ng c\u1EEDa"
                }), /*#__PURE__*/_jsx(Input, {
                  type: "time",
                  value: formData.closeTime,
                  onChange: e => setFormData({
                    ...formData,
                    closeTime: e.target.value
                  })
                })]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-end gap-3 p-4 border-t border-border bg-background-tertiary rounded-b-2xl",
            children: [/*#__PURE__*/_jsx(Button, {
              variant: "secondary",
              onClick: handleCloseModal,
              children: "H\u1EE7y"
            }), /*#__PURE__*/_jsxs(Button, {
              onClick: handleSubmit,
              isLoading: createMutation.isPending || updateMutation.isPending,
              children: [/*#__PURE__*/_jsx(Check, {
                className: "w-4 h-4 mr-2"
              }), editingVenue ? 'Cập nhật' : 'Tạo cơ sở']
            })]
          })]
        })
      })]
    })]
  });
}