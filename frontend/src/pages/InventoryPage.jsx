import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Wrench, Plus, Search, Edit2, Trash2, AlertTriangle, X, Save } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { productApi, serviceApi } from '@/services/inventory.service';
import { venueApi } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();

  // Fetch venues for dropdown
  const {
    data: venuesData
  } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venueApi.getAll({
      isActive: true
    })
  });

  // Fetch products
  const {
    data: productsData,
    isLoading: loadingProducts
  } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: () => productApi.getAll({
      search: searchQuery,
      isActive: true
    }),
    enabled: activeTab === 'products'
  });

  // Fetch services
  const {
    data: servicesData,
    isLoading: loadingServices
  } = useQuery({
    queryKey: ['services', searchQuery],
    queryFn: () => serviceApi.getAll({
      search: searchQuery,
      isActive: true
    }),
    enabled: activeTab === 'services'
  });

  // Fetch low stock products
  const {
    data: lowStockProducts
  } = useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: () => productApi.getLowStock(undefined, 10)
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: input => productApi.create(input),
    onSuccess: () => {
      toast({
        title: 'Đã thêm sản phẩm!'
      });
      queryClient.invalidateQueries({
        queryKey: ['products']
      });
      setShowModal(false);
    },
    onError: () => toast({
      title: 'Lỗi khi thêm sản phẩm',
      variant: 'error'
    })
  });
  const updateProductMutation = useMutation({
    mutationFn: ({
      id,
      data
    }) => productApi.update(id, data),
    onSuccess: () => {
      toast({
        title: 'Đã cập nhật sản phẩm!'
      });
      queryClient.invalidateQueries({
        queryKey: ['products']
      });
      setShowModal(false);
      setEditingItem(null);
    },
    onError: () => toast({
      title: 'Lỗi khi cập nhật',
      variant: 'error'
    })
  });
  const deleteProductMutation = useMutation({
    mutationFn: id => productApi.delete(id),
    onSuccess: () => {
      toast({
        title: 'Đã xóa sản phẩm!'
      });
      queryClient.invalidateQueries({
        queryKey: ['products']
      });
    },
    onError: () => toast({
      title: 'Lỗi khi xóa',
      variant: 'error'
    })
  });
  const createServiceMutation = useMutation({
    mutationFn: input => serviceApi.create(input),
    onSuccess: () => {
      toast({
        title: 'Đã thêm dịch vụ!'
      });
      queryClient.invalidateQueries({
        queryKey: ['services']
      });
      setShowModal(false);
    },
    onError: () => toast({
      title: 'Lỗi khi thêm dịch vụ',
      variant: 'error'
    })
  });
  const updateServiceMutation = useMutation({
    mutationFn: ({
      id,
      data
    }) => serviceApi.update(id, data),
    onSuccess: () => {
      toast({
        title: 'Đã cập nhật dịch vụ!'
      });
      queryClient.invalidateQueries({
        queryKey: ['services']
      });
      setShowModal(false);
      setEditingItem(null);
    },
    onError: () => toast({
      title: 'Lỗi khi cập nhật',
      variant: 'error'
    })
  });
  const deleteServiceMutation = useMutation({
    mutationFn: id => serviceApi.delete(id),
    onSuccess: () => {
      toast({
        title: 'Đã xóa dịch vụ!'
      });
      queryClient.invalidateQueries({
        queryKey: ['services']
      });
    },
    onError: () => toast({
      title: 'Lỗi khi xóa',
      variant: 'error'
    })
  });
  const products = productsData?.data || [];
  const services = servicesData?.data || [];
  const venues = venuesData?.data || [];
  const isLoading = activeTab === 'products' ? loadingProducts : loadingServices;
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col h-full",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold text-foreground",
          children: "Kho & D\u1ECBch V\u1EE5"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-foreground-secondary",
          children: "Qu\u1EA3n l\xFD s\u1EA3n ph\u1EA9m v\xE0 d\u1ECBch v\u1EE5"
        })]
      }), /*#__PURE__*/_jsxs(Button, {
        onClick: () => {
          setEditingItem(null);
          setShowModal(true);
        },
        className: "gap-2",
        children: [/*#__PURE__*/_jsx(Plus, {
          className: "w-4 h-4"
        }), "Th\xEAm ", activeTab === 'products' ? 'sản phẩm' : 'dịch vụ']
      })]
    }), lowStockProducts && lowStockProducts.length > 0 && /*#__PURE__*/_jsxs("div", {
      className: "bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-3",
      children: [/*#__PURE__*/_jsx(AlertTriangle, {
        className: "w-5 h-5 text-yellow-400 shrink-0 mt-0.5"
      }), /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h4", {
          className: "font-medium text-yellow-400",
          children: "C\u1EA3nh b\xE1o t\u1ED3n kho"
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-sm text-foreground-secondary mt-1",
          children: ["C\xF3 ", lowStockProducts.length, " s\u1EA3n ph\u1EA9m s\u1EAFp h\u1EBFt h\xE0ng: ", ' ', lowStockProducts.slice(0, 3).map(p => p.name).join(', '), lowStockProducts.length > 3 && '...']
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex gap-4 mb-6",
      children: [/*#__PURE__*/_jsxs("button", {
        onClick: () => setActiveTab('products'),
        className: cn('flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors', activeTab === 'products' ? 'bg-primary-500 text-white' : 'bg-background-secondary text-foreground-secondary hover:bg-background-hover'),
        children: [/*#__PURE__*/_jsx(Package, {
          className: "w-4 h-4"
        }), "S\u1EA3n ph\u1EA9m (", products.length, ")"]
      }), /*#__PURE__*/_jsxs("button", {
        onClick: () => setActiveTab('services'),
        className: cn('flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors', activeTab === 'services' ? 'bg-primary-500 text-white' : 'bg-background-secondary text-foreground-secondary hover:bg-background-hover'),
        children: [/*#__PURE__*/_jsx(Wrench, {
          className: "w-4 h-4"
        }), "D\u1ECBch v\u1EE5 (", services.length, ")"]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative flex-1 max-w-md ml-auto",
        children: [/*#__PURE__*/_jsx(Search, {
          className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary"
        }), /*#__PURE__*/_jsx("input", {
          type: "text",
          placeholder: "T\xECm ki\u1EBFm...",
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
      }) : activeTab === 'products' ? /*#__PURE__*/_jsx(ProductsGrid, {
        products: products,
        onEdit: p => {
          setEditingItem(p);
          setShowModal(true);
        },
        onDelete: id => deleteProductMutation.mutate(id)
      }) : /*#__PURE__*/_jsx(ServicesGrid, {
        services: services,
        onEdit: s => {
          setEditingItem(s);
          setShowModal(true);
        },
        onDelete: id => deleteServiceMutation.mutate(id)
      })
    }), showModal && /*#__PURE__*/_jsx(ItemModal, {
      type: activeTab === 'products' ? 'product' : 'service',
      item: editingItem,
      venues: venues,
      onClose: () => {
        setShowModal(false);
        setEditingItem(null);
      },
      onSave: data => {
        if (activeTab === 'products') {
          if (editingItem) {
            updateProductMutation.mutate({
              id: editingItem.id,
              data
            });
          } else {
            createProductMutation.mutate(data);
          }
        } else {
          if (editingItem) {
            updateServiceMutation.mutate({
              id: editingItem.id,
              data
            });
          } else {
            createServiceMutation.mutate(data);
          }
        }
      }
    })]
  });
}

// Products Grid Component
function ProductsGrid({
  products,
  onEdit,
  onDelete
}) {
  if (!products.length) {
    return /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col items-center justify-center h-64 text-foreground-secondary",
      children: [/*#__PURE__*/_jsx(Package, {
        className: "w-12 h-12 mb-4 opacity-50"
      }), /*#__PURE__*/_jsx("p", {
        children: "Ch\u01B0a c\xF3 s\u1EA3n ph\u1EA9m n\xE0o"
      })]
    });
  }
  return /*#__PURE__*/_jsx("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    children: products.map(product => /*#__PURE__*/_jsxs("div", {
      className: "bg-background-secondary border border-border rounded-lg p-4 hover:border-primary-500/50 transition-colors",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-start justify-between mb-3",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center",
          children: /*#__PURE__*/_jsx(Package, {
            className: "w-5 h-5 text-primary-500"
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-1",
          children: [/*#__PURE__*/_jsx("button", {
            onClick: () => onEdit(product),
            className: "p-2 hover:bg-background-hover rounded-lg transition-colors",
            children: /*#__PURE__*/_jsx(Edit2, {
              className: "w-4 h-4 text-foreground-secondary"
            })
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => onDelete(product.id),
            className: "p-2 hover:bg-red-500/10 rounded-lg transition-colors",
            children: /*#__PURE__*/_jsx(Trash2, {
              className: "w-4 h-4 text-red-400"
            })
          })]
        })]
      }), /*#__PURE__*/_jsx("h4", {
        className: "font-medium text-foreground mb-1",
        children: product.name
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-foreground-secondary mb-3 line-clamp-2",
        children: product.description || 'Không có mô tả'
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/_jsx("span", {
          className: "font-semibold text-primary-500",
          children: formatCurrency(product.price)
        }), /*#__PURE__*/_jsxs("span", {
          className: cn('text-sm px-2 py-1 rounded', product.stock <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'),
          children: ["Kho: ", product.stock, " ", product.unit]
        })]
      })]
    }, product.id))
  });
}

// Services Grid Component
function ServicesGrid({
  services,
  onEdit,
  onDelete
}) {
  if (!services.length) {
    return /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col items-center justify-center h-64 text-foreground-secondary",
      children: [/*#__PURE__*/_jsx(Wrench, {
        className: "w-12 h-12 mb-4 opacity-50"
      }), /*#__PURE__*/_jsx("p", {
        children: "Ch\u01B0a c\xF3 d\u1ECBch v\u1EE5 n\xE0o"
      })]
    });
  }
  return /*#__PURE__*/_jsx("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    children: services.map(service => /*#__PURE__*/_jsxs("div", {
      className: "bg-background-secondary border border-border rounded-lg p-4 hover:border-primary-500/50 transition-colors",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-start justify-between mb-3",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center",
          children: /*#__PURE__*/_jsx(Wrench, {
            className: "w-5 h-5 text-blue-400"
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-1",
          children: [/*#__PURE__*/_jsx("button", {
            onClick: () => onEdit(service),
            className: "p-2 hover:bg-background-hover rounded-lg transition-colors",
            children: /*#__PURE__*/_jsx(Edit2, {
              className: "w-4 h-4 text-foreground-secondary"
            })
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => onDelete(service.id),
            className: "p-2 hover:bg-red-500/10 rounded-lg transition-colors",
            children: /*#__PURE__*/_jsx(Trash2, {
              className: "w-4 h-4 text-red-400"
            })
          })]
        })]
      }), /*#__PURE__*/_jsx("h4", {
        className: "font-medium text-foreground mb-1",
        children: service.name
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-foreground-secondary mb-3 line-clamp-2",
        children: service.description || 'Không có mô tả'
      }), /*#__PURE__*/_jsx("div", {
        className: "flex items-center justify-between",
        children: /*#__PURE__*/_jsxs("span", {
          className: "font-semibold text-primary-500",
          children: [formatCurrency(service.price), "/", service.unit]
        })
      })]
    }, service.id))
  });
}

// Modal Component
function ItemModal({
  type,
  item,
  venues,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    venueId: item?.venueId || venues[0]?.id || '',
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    stock: item?.stock || 0,
    unit: item?.unit || (type === 'product' ? 'cái' : 'lần')
  });
  const handleSubmit = e => {
    e.preventDefault();
    if (type === 'product') {
      onSave({
        venueId: formData.venueId,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        unit: formData.unit
      });
    } else {
      onSave({
        venueId: formData.venueId,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        unit: formData.unit
      });
    }
  };
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
    children: /*#__PURE__*/_jsxs("div", {
      className: "bg-background-secondary border border-border rounded-xl shadow-xl w-full max-w-md animate-slide-up",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between p-4 border-b border-border",
        children: [/*#__PURE__*/_jsxs("h3", {
          className: "text-lg font-semibold",
          children: [item ? 'Chỉnh sửa' : 'Thêm', " ", type === 'product' ? 'sản phẩm' : 'dịch vụ']
        }), /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "p-2 hover:bg-background-hover rounded-lg",
          children: /*#__PURE__*/_jsx(X, {
            className: "w-5 h-5"
          })
        })]
      }), /*#__PURE__*/_jsxs("form", {
        onSubmit: handleSubmit,
        className: "p-4 space-y-4",
        children: [!item && /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "block text-sm text-foreground-secondary mb-1",
            children: "C\u01A1 s\u1EDF"
          }), /*#__PURE__*/_jsx("select", {
            value: formData.venueId,
            onChange: e => setFormData({
              ...formData,
              venueId: e.target.value
            }),
            className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground",
            required: true,
            children: venues.map(v => /*#__PURE__*/_jsx("option", {
              value: v.id,
              children: v.name
            }, v.id))
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "block text-sm text-foreground-secondary mb-1",
            children: "T\xEAn"
          }), /*#__PURE__*/_jsx("input", {
            type: "text",
            value: formData.name,
            onChange: e => setFormData({
              ...formData,
              name: e.target.value
            }),
            className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground",
            placeholder: type === 'product' ? 'VD: Cầu lông Yonex' : 'VD: Thuê vợt',
            required: true
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
            className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground resize-none",
            rows: 2,
            placeholder: "M\xF4 t\u1EA3 ng\u1EAFn..."
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm text-foreground-secondary mb-1",
              children: "Gi\xE1 (VN\u0110)"
            }), /*#__PURE__*/_jsx("input", {
              type: "number",
              value: formData.price,
              onChange: e => setFormData({
                ...formData,
                price: Number(e.target.value)
              }),
              className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground",
              min: "0",
              required: true
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm text-foreground-secondary mb-1",
              children: "\u0110\u01A1n v\u1ECB"
            }), /*#__PURE__*/_jsx("input", {
              type: "text",
              value: formData.unit,
              onChange: e => setFormData({
                ...formData,
                unit: e.target.value
              }),
              className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground",
              placeholder: type === 'product' ? 'cái, quả, chai...' : 'lần, giờ...'
            })]
          })]
        }), type === 'product' && /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "block text-sm text-foreground-secondary mb-1",
            children: "S\u1ED1 l\u01B0\u1EE3ng t\u1ED3n kho"
          }), /*#__PURE__*/_jsx("input", {
            type: "number",
            value: formData.stock,
            onChange: e => setFormData({
              ...formData,
              stock: Number(e.target.value)
            }),
            className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground",
            min: "0"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-3 pt-2",
          children: [/*#__PURE__*/_jsx(Button, {
            type: "button",
            variant: "ghost",
            onClick: onClose,
            className: "flex-1",
            children: "H\u1EE7y"
          }), /*#__PURE__*/_jsxs(Button, {
            type: "submit",
            className: "flex-1 gap-2",
            children: [/*#__PURE__*/_jsx(Save, {
              className: "w-4 h-4"
            }), item ? 'Cập nhật' : 'Thêm']
          })]
        })]
      })]
    })
  });
}