import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Building2, Clock, DollarSign, Bell, Shield, Save, Plus, Trash2, Edit2, X, MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { venueApi } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function Tab({
  active,
  icon: Icon,
  label,
  onClick
}) {
  return /*#__PURE__*/_jsxs("button", {
    onClick: onClick,
    className: cn('flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors w-full text-left rounded-lg', active ? 'bg-primary-500/20 text-primary-500' : 'text-foreground-secondary hover:bg-background-hover hover:text-foreground'),
    children: [/*#__PURE__*/_jsx(Icon, {
      className: "w-4 h-4"
    }), label]
  });
}

// Venue Form Modal

function VenueFormModal({
  isOpen,
  onClose,
  venue,
  onSave
}) {
  const [formData, setFormData] = useState({
    name: venue?.name || '',
    address: venue?.address || '',
    phone: venue?.phone || '',
    email: venue?.email || '',
    openTime: venue?.openTime || '06:00',
    closeTime: venue?.closeTime || '23:00'
  });
  const [isSaving, setIsSaving] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };
  if (!isOpen) return null;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      onClick: onClose
    }), /*#__PURE__*/_jsx("div", {
      className: "fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg animate-scaleIn",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary rounded-2xl border border-border shadow-2xl overflow-hidden",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between p-4 border-b border-border",
          children: [/*#__PURE__*/_jsx("h2", {
            className: "font-semibold text-foreground",
            children: venue ? 'Sửa thông tin cơ sở' : 'Thêm cơ sở mới'
          }), /*#__PURE__*/_jsx("button", {
            onClick: onClose,
            className: "p-2 hover:bg-background-tertiary rounded-lg",
            children: /*#__PURE__*/_jsx(X, {
              className: "w-4 h-4"
            })
          })]
        }), /*#__PURE__*/_jsxs("form", {
          onSubmit: handleSubmit,
          className: "p-4 space-y-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm font-medium text-foreground mb-1",
              children: "T\xEAn c\u01A1 s\u1EDF *"
            }), /*#__PURE__*/_jsx(Input, {
              value: formData.name,
              onChange: e => setFormData(prev => ({
                ...prev,
                name: e.target.value
              })),
              placeholder: "S\xE2n c\u1EA7u l\xF4ng ABC",
              required: true
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm font-medium text-foreground mb-1",
              children: "\u0110\u1ECBa ch\u1EC9 *"
            }), /*#__PURE__*/_jsx(Input, {
              value: formData.address,
              onChange: e => setFormData(prev => ({
                ...prev,
                address: e.target.value
              })),
              placeholder: "123 \u0110\u01B0\u1EDDng XYZ, Qu\u1EADn 1, TP.HCM",
              required: true
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "grid grid-cols-2 gap-4",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium text-foreground mb-1",
                children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i"
              }), /*#__PURE__*/_jsx(Input, {
                value: formData.phone,
                onChange: e => setFormData(prev => ({
                  ...prev,
                  phone: e.target.value
                })),
                placeholder: "0912 345 678",
                type: "tel"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium text-foreground mb-1",
                children: "Email"
              }), /*#__PURE__*/_jsx(Input, {
                value: formData.email,
                onChange: e => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                })),
                placeholder: "info@example.com",
                type: "email"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "grid grid-cols-2 gap-4",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium text-foreground mb-1",
                children: "Gi\u1EDD m\u1EDF c\u1EEDa"
              }), /*#__PURE__*/_jsx(Input, {
                type: "time",
                value: formData.openTime,
                onChange: e => setFormData(prev => ({
                  ...prev,
                  openTime: e.target.value
                }))
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium text-foreground mb-1",
                children: "Gi\u1EDD \u0111\xF3ng c\u1EEDa"
              }), /*#__PURE__*/_jsx(Input, {
                type: "time",
                value: formData.closeTime,
                onChange: e => setFormData(prev => ({
                  ...prev,
                  closeTime: e.target.value
                }))
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-3 pt-4 border-t border-border",
            children: [/*#__PURE__*/_jsx(Button, {
              variant: "ghost",
              type: "button",
              className: "flex-1",
              onClick: onClose,
              children: "H\u1EE7y"
            }), /*#__PURE__*/_jsxs(Button, {
              type: "submit",
              className: "flex-1 gap-2",
              disabled: isSaving,
              children: [isSaving ? /*#__PURE__*/_jsx(Loader2, {
                className: "w-4 h-4 animate-spin"
              }) : /*#__PURE__*/_jsx(Save, {
                className: "w-4 h-4"
              }), venue ? 'Cập nhật' : 'Thêm mới']
            })]
          })]
        })]
      })
    })]
  });
}
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('venue');
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();

  // Fetch venues
  const {
    data: venuesData,
    isLoading: loadingVenues
  } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venueApi.getAll({
      isActive: true
    })
  });
  const venues = venuesData?.data || [];

  // Create/Update venue mutation
  const saveMutation = useMutation({
    mutationFn: async data => {
      if (editingVenue) {
        return venueApi.update(editingVenue.id, data);
      } else {
        return venueApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['venues']
      });
      toast({
        title: 'Thành công',
        description: editingVenue ? 'Đã cập nhật thông tin cơ sở' : 'Đã thêm cơ sở mới',
        variant: 'success'
      });
      setEditingVenue(null);
    },
    onError: () => {
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu thông tin. Vui lòng thử lại.',
        variant: 'error'
      });
    }
  });

  // Delete venue mutation
  const deleteMutation = useMutation({
    mutationFn: id => venueApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['venues']
      });
      toast({
        title: 'Đã xóa',
        description: 'Đã xóa cơ sở thành công',
        variant: 'success'
      });
    }
  });
  const handleAddVenue = () => {
    setEditingVenue(null);
    setIsVenueModalOpen(true);
  };
  const handleEditVenue = venue => {
    setEditingVenue(venue);
    setIsVenueModalOpen(true);
  };
  const handleDeleteVenue = venue => {
    if (confirm(`Bạn có chắc muốn xóa "${venue.name}"?`)) {
      deleteMutation.mutate(venue.id);
    }
  };
  const handleSaveVenue = async data => {
    await saveMutation.mutateAsync(data);
  };
  const tabs = [{
    id: 'venue',
    icon: Building2,
    label: 'Thông tin cơ sở'
  }, {
    id: 'hours',
    icon: Clock,
    label: 'Giờ hoạt động'
  }, {
    id: 'pricing',
    icon: DollarSign,
    label: 'Bảng giá'
  }, {
    id: 'notifications',
    icon: Bell,
    label: 'Thông báo'
  }, {
    id: 'security',
    icon: Shield,
    label: 'Bảo mật'
  }];
  return /*#__PURE__*/_jsxs("div", {
    className: "p-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex flex-col lg:flex-row gap-6",
      children: [/*#__PURE__*/_jsx("div", {
        className: "w-full lg:w-64 shrink-0",
        children: /*#__PURE__*/_jsxs("div", {
          className: "bg-background-secondary border border-border rounded-xl p-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-4 pb-4 border-b border-border",
            children: [/*#__PURE__*/_jsx(Settings, {
              className: "w-5 h-5 text-primary-500"
            }), /*#__PURE__*/_jsx("h2", {
              className: "font-semibold text-foreground",
              children: "C\xE0i \u0111\u1EB7t"
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-1",
            children: tabs.map(tab => /*#__PURE__*/_jsx(Tab, {
              active: activeTab === tab.id,
              icon: tab.icon,
              label: tab.label,
              onClick: () => setActiveTab(tab.id)
            }, tab.id))
          })]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex-1 min-w-0",
        children: [activeTab === 'venue' && /*#__PURE__*/_jsxs("div", {
          className: "bg-background-secondary border border-border rounded-xl p-6",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-6",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-lg font-semibold text-foreground",
                children: "Th\xF4ng tin c\u01A1 s\u1EDF"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-foreground-secondary",
                children: "Qu\u1EA3n l\xFD c\xE1c c\u01A1 s\u1EDF s\xE2n c\u1EA7u l\xF4ng"
              })]
            }), /*#__PURE__*/_jsxs(Button, {
              onClick: handleAddVenue,
              className: "gap-2",
              children: [/*#__PURE__*/_jsx(Plus, {
                className: "w-4 h-4"
              }), "Th\xEAm c\u01A1 s\u1EDF"]
            })]
          }), loadingVenues ? /*#__PURE__*/_jsx("div", {
            className: "flex items-center justify-center py-12",
            children: /*#__PURE__*/_jsx(Loader2, {
              className: "w-8 h-8 animate-spin text-primary-500"
            })
          }) : venues.length === 0 ? /*#__PURE__*/_jsxs("div", {
            className: "text-center py-12",
            children: [/*#__PURE__*/_jsx(Building2, {
              className: "w-12 h-12 mx-auto mb-4 text-foreground-muted opacity-50"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-foreground-secondary mb-4",
              children: "Ch\u01B0a c\xF3 c\u01A1 s\u1EDF n\xE0o"
            }), /*#__PURE__*/_jsxs(Button, {
              onClick: handleAddVenue,
              variant: "outline",
              className: "gap-2",
              children: [/*#__PURE__*/_jsx(Plus, {
                className: "w-4 h-4"
              }), "Th\xEAm c\u01A1 s\u1EDF \u0111\u1EA7u ti\xEAn"]
            })]
          }) : /*#__PURE__*/_jsx("div", {
            className: "space-y-4",
            children: venues.map(venue => /*#__PURE__*/_jsxs("div", {
              className: "border border-border rounded-xl p-5 hover:border-primary-500/30 transition-colors",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex justify-between items-start mb-4",
                children: [/*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("h4", {
                    className: "font-semibold text-foreground text-lg",
                    children: venue.name
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-1 text-sm text-foreground-secondary mt-1",
                    children: [/*#__PURE__*/_jsx(MapPin, {
                      className: "w-3.5 h-3.5"
                    }), venue.address]
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex gap-2",
                  children: [/*#__PURE__*/_jsxs(Button, {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => handleEditVenue(venue),
                    className: "gap-1.5",
                    children: [/*#__PURE__*/_jsx(Edit2, {
                      className: "w-4 h-4"
                    }), "S\u1EEDa"]
                  }), /*#__PURE__*/_jsx(Button, {
                    variant: "ghost",
                    size: "sm",
                    className: "text-red-400 hover:text-red-300 hover:bg-red-500/10",
                    onClick: () => handleDeleteVenue(venue),
                    children: /*#__PURE__*/_jsx(Trash2, {
                      className: "w-4 h-4"
                    })
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx(Phone, {
                    className: "w-4 h-4 text-foreground-muted"
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-foreground",
                    children: venue.phone || 'Chưa cập nhật'
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx(Mail, {
                    className: "w-4 h-4 text-foreground-muted"
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-foreground",
                    children: venue.email || 'Chưa cập nhật'
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx(Clock, {
                    className: "w-4 h-4 text-foreground-muted"
                  }), /*#__PURE__*/_jsxs("span", {
                    className: "text-foreground",
                    children: [venue.openTime, " - ", venue.closeTime]
                  })]
                })]
              })]
            }, venue.id))
          })]
        }), activeTab === 'hours' && /*#__PURE__*/_jsxs("div", {
          className: "bg-background-secondary border border-border rounded-xl p-6",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-lg font-semibold text-foreground mb-6",
            children: "Gi\u1EDD ho\u1EA1t \u0111\u1ED9ng"
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-4",
            children: [['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((day, i) => /*#__PURE__*/_jsxs("div", {
              className: "flex flex-wrap items-center gap-4 p-3 bg-background-tertiary/50 rounded-lg",
              children: [/*#__PURE__*/_jsx("span", {
                className: "w-24 font-medium text-foreground",
                children: day
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2",
                children: [/*#__PURE__*/_jsx("input", {
                  type: "time",
                  defaultValue: "06:00",
                  className: "bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "\u0111\u1EBFn"
                }), /*#__PURE__*/_jsx("input", {
                  type: "time",
                  defaultValue: "23:00",
                  className: "bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                })]
              }), /*#__PURE__*/_jsxs("label", {
                className: "flex items-center gap-2 text-sm text-foreground-secondary ml-auto",
                children: [/*#__PURE__*/_jsx("input", {
                  type: "checkbox",
                  defaultChecked: true,
                  className: "rounded accent-primary-500"
                }), "Ho\u1EA1t \u0111\u1ED9ng"]
              })]
            }, i)), /*#__PURE__*/_jsxs(Button, {
              className: "mt-4 gap-2",
              children: [/*#__PURE__*/_jsx(Save, {
                className: "w-4 h-4"
              }), "L\u01B0u thay \u0111\u1ED5i"]
            })]
          })]
        }), activeTab === 'pricing' && /*#__PURE__*/_jsxs("div", {
          className: "bg-background-secondary border border-border rounded-xl p-6",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-6",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "text-lg font-semibold text-foreground",
              children: "B\u1EA3ng gi\xE1"
            }), /*#__PURE__*/_jsxs(Button, {
              className: "gap-2",
              children: [/*#__PURE__*/_jsx(Plus, {
                className: "w-4 h-4"
              }), "Th\xEAm khung gi\xE1"]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-3",
            children: [{
              name: 'Giá mặc định',
              time: 'Tất cả khung giờ',
              price: 150000
            }, {
              name: 'Giờ cao điểm tối',
              time: '17:00 - 21:00',
              price: 200000
            }, {
              name: 'Cuối tuần',
              time: 'Thứ 7 - Chủ Nhật',
              price: 180000
            }].map((rule, i) => /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between p-4 border border-border rounded-xl",
              children: [/*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("h4", {
                  className: "font-medium text-foreground",
                  children: rule.name
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-sm text-foreground-secondary",
                  children: rule.time
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-4",
                children: [/*#__PURE__*/_jsxs("span", {
                  className: "font-semibold text-primary-500",
                  children: [formatCurrency(rule.price), "/gi\u1EDD"]
                }), /*#__PURE__*/_jsx(Button, {
                  variant: "ghost",
                  size: "sm",
                  children: /*#__PURE__*/_jsx(Edit2, {
                    className: "w-4 h-4"
                  })
                }), /*#__PURE__*/_jsx(Button, {
                  variant: "ghost",
                  size: "sm",
                  className: "text-red-400",
                  children: /*#__PURE__*/_jsx(Trash2, {
                    className: "w-4 h-4"
                  })
                })]
              })]
            }, i))
          })]
        }), activeTab === 'notifications' && /*#__PURE__*/_jsxs("div", {
          className: "bg-background-secondary border border-border rounded-xl p-6",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-lg font-semibold text-foreground mb-6",
            children: "Th\xF4ng b\xE1o"
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-4",
            children: [{
              label: 'Thông báo khi có đặt sân mới',
              enabled: true
            }, {
              label: 'Thông báo khi khách hủy sân',
              enabled: true
            }, {
              label: 'Nhắc nhở trước giờ đặt sân',
              enabled: false
            }, {
              label: 'Báo cáo doanh thu hàng ngày',
              enabled: true
            }, {
              label: 'Email marketing cho khách hàng',
              enabled: false
            }].map((setting, i) => /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between p-4 border border-border rounded-xl",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-foreground",
                children: setting.label
              }), /*#__PURE__*/_jsxs("label", {
                className: "relative inline-flex items-center cursor-pointer",
                children: [/*#__PURE__*/_jsx("input", {
                  type: "checkbox",
                  defaultChecked: setting.enabled,
                  className: "sr-only peer"
                }), /*#__PURE__*/_jsx("div", {
                  className: "w-11 h-6 bg-background-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"
                })]
              })]
            }, i))
          })]
        }), activeTab === 'security' && /*#__PURE__*/_jsxs("div", {
          className: "bg-background-secondary border border-border rounded-xl p-6",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-lg font-semibold text-foreground mb-6",
            children: "B\u1EA3o m\u1EADt"
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-6",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h4", {
                className: "font-medium text-foreground mb-4",
                children: "\u0110\u1ED5i m\u1EADt kh\u1EA9u"
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-4 max-w-md",
                children: [/*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("label", {
                    className: "block text-sm text-foreground-secondary mb-1",
                    children: "M\u1EADt kh\u1EA9u hi\u1EC7n t\u1EA1i"
                  }), /*#__PURE__*/_jsx(Input, {
                    type: "password",
                    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("label", {
                    className: "block text-sm text-foreground-secondary mb-1",
                    children: "M\u1EADt kh\u1EA9u m\u1EDBi"
                  }), /*#__PURE__*/_jsx(Input, {
                    type: "password",
                    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("label", {
                    className: "block text-sm text-foreground-secondary mb-1",
                    children: "X\xE1c nh\u1EADn m\u1EADt kh\u1EA9u m\u1EDBi"
                  }), /*#__PURE__*/_jsx(Input, {
                    type: "password",
                    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  })]
                }), /*#__PURE__*/_jsxs(Button, {
                  className: "gap-2",
                  children: [/*#__PURE__*/_jsx(Save, {
                    className: "w-4 h-4"
                  }), "C\u1EADp nh\u1EADt m\u1EADt kh\u1EA9u"]
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "border-t border-border pt-6",
              children: [/*#__PURE__*/_jsx("h4", {
                className: "font-medium text-foreground mb-4",
                children: "Phi\xEAn \u0111\u0103ng nh\u1EADp"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-foreground-secondary mb-4",
                children: "B\u1EA1n \u0111ang \u0111\u0103ng nh\u1EADp t\u1EEB 1 thi\u1EBFt b\u1ECB. Nh\u1EA5n n\xFAt b\xEAn d\u01B0\u1EDBi \u0111\u1EC3 \u0111\u0103ng xu\u1EA5t kh\u1ECFi t\u1EA5t c\u1EA3 thi\u1EBFt b\u1ECB kh\xE1c."
              }), /*#__PURE__*/_jsx(Button, {
                variant: "destructive",
                children: "\u0110\u0103ng xu\u1EA5t t\u1EA5t c\u1EA3 thi\u1EBFt b\u1ECB kh\xE1c"
              })]
            })]
          })]
        })]
      })]
    }), /*#__PURE__*/_jsx(VenueFormModal, {
      isOpen: isVenueModalOpen,
      onClose: () => {
        setIsVenueModalOpen(false);
        setEditingVenue(null);
      },
      venue: editingVenue,
      onSave: handleSaveVenue
    })]
  });
}