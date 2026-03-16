import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, MapPin, X, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { venueApi, courtApi } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getStatusColor(status) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500/20 text-green-400 border-green-500';
    case 'MAINTENANCE':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
    case 'INACTIVE':
      return 'bg-red-500/20 text-red-400 border-red-500';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500';
  }
}
function getStatusLabel(status) {
  switch (status) {
    case 'ACTIVE':
      return 'Hoạt động';
    case 'MAINTENANCE':
      return 'Bảo trì';
    case 'INACTIVE':
      return 'Tạm dừng';
    default:
      return status;
  }
}
export default function CourtsPage() {
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    surfaceType: 'Synthetic',
    isIndoor: true,
    status: 'ACTIVE'
  });
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();

  // Fetch venues
  const {
    data: venuesData
  } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venueApi.getAll({
      isActive: true
    })
  });

  // Set first venue as default
  useEffect(() => {
    if (venuesData?.data && venuesData.data.length > 0 && !selectedVenueId) {
      setSelectedVenueId(venuesData.data[0].id);
    }
  }, [venuesData, selectedVenueId]);

  // Fetch courts for selected venue
  const {
    data: courts,
    isLoading
  } = useQuery({
    queryKey: ['courts', selectedVenueId],
    queryFn: () => courtApi.getByVenue(selectedVenueId),
    enabled: !!selectedVenueId
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: input => courtApi.create(input),
    onSuccess: () => {
      toast({
        title: 'Thêm sân thành công!'
      });
      queryClient.invalidateQueries({
        queryKey: ['courts']
      });
      closeModal();
    },
    onError: () => {
      toast({
        title: 'Lỗi khi thêm sân',
        variant: 'error'
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input
    }) => courtApi.update(id, input),
    onSuccess: () => {
      toast({
        title: 'Cập nhật thành công!'
      });
      queryClient.invalidateQueries({
        queryKey: ['courts']
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
    mutationFn: id => courtApi.delete(id),
    onSuccess: () => {
      toast({
        title: 'Đã xóa sân!'
      });
      queryClient.invalidateQueries({
        queryKey: ['courts']
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
    setEditingCourt(null);
    setFormData({
      name: '',
      description: '',
      surfaceType: 'Synthetic',
      isIndoor: true,
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };
  const openEditModal = court => {
    setEditingCourt(court);
    setFormData({
      name: court.name,
      description: court.description || '',
      surfaceType: court.surfaceType || 'Synthetic',
      isIndoor: court.isIndoor,
      status: court.status
    });
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourt(null);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (editingCourt) {
      updateMutation.mutate({
        id: editingCourt.id,
        input: formData
      });
    } else {
      createMutation.mutate({
        ...formData,
        venueId: selectedVenueId
      });
    }
  };
  const handleDelete = court => {
    if (confirm('Ban co chac muon xoa san "' + court.name + '"?')) {
      deleteMutation.mutate(court.id);
    }
  };
  const selectedVenue = venuesData?.data.find(v => v.id === selectedVenueId);
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col h-full",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold text-foreground",
          children: "Qu\u1EA3n L\xFD S\xE2n"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-foreground-secondary",
          children: "Qu\u1EA3n l\xFD danh s\xE1ch s\xE2n c\u1EA7u l\xF4ng"
        })]
      }), /*#__PURE__*/_jsxs(Button, {
        className: "gap-2",
        onClick: openCreateModal,
        disabled: !selectedVenueId,
        children: [/*#__PURE__*/_jsx(Plus, {
          className: "w-4 h-4"
        }), "Th\xEAm s\xE2n m\u1EDBi"]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-4 mb-6 p-4 bg-background-secondary rounded-lg border border-border",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsx(Building2, {
          className: "w-5 h-5 text-foreground-secondary"
        }), /*#__PURE__*/_jsx("span", {
          className: "text-foreground-secondary",
          children: "C\u01A1 s\u1EDF:"
        })]
      }), /*#__PURE__*/_jsx("select", {
        value: selectedVenueId,
        onChange: e => setSelectedVenueId(e.target.value),
        className: "flex-1 max-w-md bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
        children: venuesData?.data.map(venue => /*#__PURE__*/_jsx("option", {
          value: venue.id,
          children: venue.name
        }, venue.id))
      }), selectedVenue && /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2 text-sm text-foreground-secondary",
        children: [/*#__PURE__*/_jsx(MapPin, {
          className: "w-4 h-4"
        }), /*#__PURE__*/_jsx("span", {
          children: selectedVenue.address
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "flex-1 overflow-auto",
      children: isLoading ? /*#__PURE__*/_jsx("div", {
        className: "flex items-center justify-center h-64",
        children: /*#__PURE__*/_jsx("div", {
          className: "animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        })
      }) : !courts || courts.length === 0 ? /*#__PURE__*/_jsxs("div", {
        className: "flex flex-col items-center justify-center h-64 text-foreground-secondary",
        children: [/*#__PURE__*/_jsx(Building2, {
          className: "w-12 h-12 mb-4 opacity-50"
        }), /*#__PURE__*/_jsx("p", {
          children: "Ch\u01B0a c\xF3 s\xE2n n\xE0o \u0111\u01B0\u1EE3c thi\u1EBFt l\u1EADp"
        }), /*#__PURE__*/_jsxs(Button, {
          className: "mt-4 gap-2",
          onClick: openCreateModal,
          children: [/*#__PURE__*/_jsx(Plus, {
            className: "w-4 h-4"
          }), "Th\xEAm s\xE2n \u0111\u1EA7u ti\xEAn"]
        })]
      }) : /*#__PURE__*/_jsx("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        children: courts.map(court => /*#__PURE__*/_jsxs("div", {
          className: "bg-background-secondary border border-border rounded-lg p-4 hover:border-primary-500/50 transition-all",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-start justify-between mb-3",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "font-semibold text-foreground text-lg",
                children: court.name
              }), court.description && /*#__PURE__*/_jsx("p", {
                className: "text-sm text-foreground-secondary mt-1",
                children: court.description
              })]
            }), /*#__PURE__*/_jsx("span", {
              className: cn('px-2 py-1 rounded text-xs font-medium border', getStatusColor(court.status)),
              children: getStatusLabel(court.status)
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-2 mb-4",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 text-sm",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-2 h-2 rounded-full bg-primary-500"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground-secondary",
                children: "Lo\u1EA1i s\xE0n:"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground",
                children: court.surfaceType || 'Chưa xác định'
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 text-sm",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-2 h-2 rounded-full bg-blue-500"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground-secondary",
                children: "V\u1ECB tr\xED:"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground",
                children: court.isIndoor ? 'Trong nhà' : 'Ngoài trời'
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 pt-3 border-t border-border",
            children: [/*#__PURE__*/_jsxs(Button, {
              variant: "ghost",
              size: "sm",
              className: "flex-1 gap-2",
              onClick: () => openEditModal(court),
              children: [/*#__PURE__*/_jsx(Edit2, {
                className: "w-4 h-4"
              }), "S\u1EEDa"]
            }), /*#__PURE__*/_jsx(Button, {
              variant: "ghost",
              size: "sm",
              className: "text-red-500 hover:text-red-400",
              onClick: () => handleDelete(court),
              children: /*#__PURE__*/_jsx(Trash2, {
                className: "w-4 h-4"
              })
            })]
          })]
        }, court.id))
      })
    }), isModalOpen && /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-xl shadow-xl w-full max-w-md animate-slide-up",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between p-4 border-b border-border",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-lg font-semibold",
            children: editingCourt ? 'Sửa thông tin sân' : 'Thêm sân mới'
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
              children: ["T\xEAn s\xE2n ", /*#__PURE__*/_jsx("span", {
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
              placeholder: "VD: S\xE2n A1"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm text-foreground-secondary mb-1",
              children: "M\xF4 t\u1EA3"
            }), /*#__PURE__*/_jsx("textarea", {
              value: formData.description,
              onChange: e => setFormData({
                ...formData,
                description: e.target.value
              }),
              rows: 2,
              className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none",
              placeholder: "M\xF4 t\u1EA3 v\u1EC1 s\xE2n..."
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "grid grid-cols-2 gap-4",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm text-foreground-secondary mb-1",
                children: "Lo\u1EA1i s\xE0n"
              }), /*#__PURE__*/_jsxs("select", {
                value: formData.surfaceType,
                onChange: e => setFormData({
                  ...formData,
                  surfaceType: e.target.value
                }),
                className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
                children: [/*#__PURE__*/_jsx("option", {
                  value: "Synthetic",
                  children: "S\xE0n nh\u1EF1a t\u1ED5ng h\u1EE3p"
                }), /*#__PURE__*/_jsx("option", {
                  value: "Wooden",
                  children: "S\xE0n g\u1ED7"
                }), /*#__PURE__*/_jsx("option", {
                  value: "Synthetic Pro",
                  children: "Synthetic Pro"
                }), /*#__PURE__*/_jsx("option", {
                  value: "PVC",
                  children: "PVC"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm text-foreground-secondary mb-1",
                children: "Tr\u1EA1ng th\xE1i"
              }), /*#__PURE__*/_jsxs("select", {
                value: formData.status,
                onChange: e => setFormData({
                  ...formData,
                  status: e.target.value
                }),
                className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
                children: [/*#__PURE__*/_jsx("option", {
                  value: "ACTIVE",
                  children: "Ho\u1EA1t \u0111\u1ED9ng"
                }), /*#__PURE__*/_jsx("option", {
                  value: "MAINTENANCE",
                  children: "B\u1EA3o tr\xEC"
                }), /*#__PURE__*/_jsx("option", {
                  value: "INACTIVE",
                  children: "T\u1EA1m d\u1EEBng"
                })]
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            children: /*#__PURE__*/_jsxs("label", {
              className: "flex items-center gap-2 cursor-pointer",
              children: [/*#__PURE__*/_jsx("input", {
                type: "checkbox",
                checked: formData.isIndoor,
                onChange: e => setFormData({
                  ...formData,
                  isIndoor: e.target.checked
                }),
                className: "w-4 h-4 rounded border-border text-primary-500 focus:ring-primary-500"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-sm text-foreground",
                children: "S\xE2n trong nh\xE0"
              })]
            })
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
              children: editingCourt ? 'Lưu' : 'Thêm'
            })]
          })]
        })]
      })
    })]
  });
}