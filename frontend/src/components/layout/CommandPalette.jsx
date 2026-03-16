import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Calendar, Users, Receipt, Package, Settings, FileText, BarChart3, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Default navigation items
const DEFAULT_ITEMS = [{
  id: 'home',
  type: 'page',
  title: 'Trang chủ',
  icon: Home,
  path: '/'
}, {
  id: 'calendar',
  type: 'page',
  title: 'Lịch đặt sân',
  icon: Calendar,
  path: '/calendar'
}, {
  id: 'customers',
  type: 'page',
  title: 'Khách hàng',
  icon: Users,
  path: '/customers'
}, {
  id: 'invoices',
  type: 'page',
  title: 'Hóa đơn',
  icon: Receipt,
  path: '/invoices'
}, {
  id: 'inventory',
  type: 'page',
  title: 'Kho hàng',
  icon: Package,
  path: '/inventory'
}, {
  id: 'reports',
  type: 'page',
  title: 'Báo cáo',
  icon: BarChart3,
  path: '/reports'
}, {
  id: 'courts',
  type: 'page',
  title: 'Quản lý sân',
  icon: FileText,
  path: '/courts'
}, {
  id: 'settings',
  type: 'page',
  title: 'Cài đặt',
  icon: Settings,
  path: '/settings'
}];
export function CommandPalette({
  isOpen,
  onClose,
  onSearch
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Filter results based on query
  const results = query.trim() ? onSearch ? onSearch(query) : DEFAULT_ITEMS.filter(item => item.title.toLowerCase().includes(query.toLowerCase())) : DEFAULT_ITEMS;

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(e => {
    if (!isOpen) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          handleSelect(selected);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, results, selectedIndex, onClose]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Clear query when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);
  const handleSelect = item => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    onClose();
  };
  if (!isOpen) return null;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn",
      onClick: onClose
    }), /*#__PURE__*/_jsx("div", {
      className: "fixed inset-x-4 top-[20%] z-50 mx-auto max-w-lg animate-scaleIn",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary rounded-2xl border border-border shadow-2xl overflow-hidden",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3 p-4 border-b border-border",
          children: [/*#__PURE__*/_jsx(Search, {
            className: "w-5 h-5 text-foreground-muted shrink-0"
          }), /*#__PURE__*/_jsx("input", {
            type: "text",
            value: query,
            onChange: e => setQuery(e.target.value),
            placeholder: "T\xECm ki\u1EBFm trang, kh\xE1ch h\xE0ng, \u0111\u1EB7t s\xE2n...",
            className: "flex-1 bg-transparent text-foreground placeholder:text-foreground-muted focus:outline-none",
            autoFocus: true
          }), /*#__PURE__*/_jsx("button", {
            onClick: onClose,
            className: "p-1 hover:bg-background-hover rounded transition-colors",
            children: /*#__PURE__*/_jsx(X, {
              className: "w-4 h-4 text-foreground-muted"
            })
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "max-h-80 overflow-auto p-2",
          children: results.length === 0 ? /*#__PURE__*/_jsxs("div", {
            className: "py-8 text-center text-foreground-secondary",
            children: [/*#__PURE__*/_jsx(Search, {
              className: "w-12 h-12 mx-auto mb-2 opacity-30"
            }), /*#__PURE__*/_jsx("p", {
              children: "Kh\xF4ng t\xECm th\u1EA5y k\u1EBFt qu\u1EA3"
            })]
          }) : /*#__PURE__*/_jsx("div", {
            className: "space-y-1",
            children: results.map((item, index) => {
              const Icon = item.icon;
              return /*#__PURE__*/_jsxs("button", {
                onClick: () => handleSelect(item),
                className: cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors', index === selectedIndex ? 'bg-primary-500 text-white' : 'hover:bg-background-hover'),
                children: [/*#__PURE__*/_jsx(Icon, {
                  className: cn('w-5 h-5 shrink-0', index === selectedIndex ? 'text-white' : 'text-foreground-muted')
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex-1 min-w-0",
                  children: [/*#__PURE__*/_jsx("p", {
                    className: cn('font-medium truncate', index === selectedIndex ? 'text-white' : 'text-foreground'),
                    children: item.title
                  }), item.description && /*#__PURE__*/_jsx("p", {
                    className: cn('text-sm truncate', index === selectedIndex ? 'text-white/70' : 'text-foreground-secondary'),
                    children: item.description
                  })]
                }), /*#__PURE__*/_jsx("span", {
                  className: cn('text-xs px-2 py-0.5 rounded', index === selectedIndex ? 'bg-white/20 text-white' : 'bg-background-tertiary text-foreground-muted'),
                  children: item.type === 'page' ? 'Trang' : item.type === 'action' ? 'Hành động' : 'Dữ liệu'
                })]
              }, item.id);
            })
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between px-4 py-2 border-t border-border text-xs text-foreground-muted",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/_jsxs("span", {
              className: "flex items-center gap-1",
              children: [/*#__PURE__*/_jsx("kbd", {
                className: "px-1.5 py-0.5 bg-background-tertiary rounded",
                children: "\u2191"
              }), /*#__PURE__*/_jsx("kbd", {
                className: "px-1.5 py-0.5 bg-background-tertiary rounded",
                children: "\u2193"
              }), "Di chuy\u1EC3n"]
            }), /*#__PURE__*/_jsxs("span", {
              className: "flex items-center gap-1",
              children: [/*#__PURE__*/_jsx("kbd", {
                className: "px-1.5 py-0.5 bg-background-tertiary rounded",
                children: "Enter"
              }), "Ch\u1ECDn"]
            })]
          }), /*#__PURE__*/_jsxs("span", {
            className: "flex items-center gap-1",
            children: [/*#__PURE__*/_jsx("kbd", {
              className: "px-1.5 py-0.5 bg-background-tertiary rounded",
              children: "Esc"
            }), "\u0110\xF3ng"]
          })]
        })]
      })
    })]
  });
}

// Hook to handle Ctrl+K shortcut
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev)
  };
}