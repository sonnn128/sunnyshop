import { useState } from 'react';
import { Plus, X, Calendar, Users, Package, Receipt, Settings, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function QuickActionsButton({
  onNewBooking,
  onNewCustomer,
  onNewInvoice,
  onRecurringBooking
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const actions = [{
    id: 'booking',
    label: 'Đặt sân mới',
    icon: Calendar,
    color: 'bg-green-500 hover:bg-green-600',
    onClick: onNewBooking,
    path: '/calendar'
  }, {
    id: 'recurring',
    label: 'Lịch cố định',
    icon: Repeat,
    color: 'bg-blue-500 hover:bg-blue-600',
    onClick: onRecurringBooking
  }, {
    id: 'customer',
    label: 'Thêm khách',
    icon: Users,
    color: 'bg-purple-500 hover:bg-purple-600',
    onClick: onNewCustomer,
    path: '/customers'
  }, {
    id: 'invoice',
    label: 'Tạo hóa đơn',
    icon: Receipt,
    color: 'bg-orange-500 hover:bg-orange-600',
    onClick: onNewInvoice,
    path: '/invoices'
  }, {
    id: 'inventory',
    label: 'Nhập kho',
    icon: Package,
    color: 'bg-cyan-500 hover:bg-cyan-600',
    path: '/inventory'
  }, {
    id: 'settings',
    label: 'Cài đặt',
    icon: Settings,
    color: 'bg-gray-500 hover:bg-gray-600',
    path: '/settings'
  }];
  const handleAction = action => {
    if (action.onClick) {
      action.onClick();
    } else if (action.path) {
      navigate(action.path);
    }
    setIsOpen(false);
  };
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [isOpen && /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden",
      onClick: () => setIsOpen(false)
    }), /*#__PURE__*/_jsx("div", {
      className: cn('fixed bottom-24 right-4 z-50 flex flex-col-reverse items-end gap-3 transition-all duration-300', isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'),
      children: actions.map((action, index) => {
        const Icon = action.icon;
        return /*#__PURE__*/_jsxs("button", {
          onClick: () => handleAction(action),
          className: cn('flex items-center gap-3 px-4 py-3 rounded-full text-white shadow-lg transition-all', action.color, 'animate-fadeIn'),
          style: {
            animationDelay: `${index * 50}ms`
          },
          children: [/*#__PURE__*/_jsx(Icon, {
            className: "w-5 h-5"
          }), /*#__PURE__*/_jsx("span", {
            className: "font-medium whitespace-nowrap",
            children: action.label
          })]
        }, action.id);
      })
    }), /*#__PURE__*/_jsx("button", {
      onClick: () => setIsOpen(!isOpen),
      className: cn('fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 lg:hidden', isOpen ? 'bg-red-500 hover:bg-red-600 rotate-45' : 'bg-primary-500 hover:bg-primary-600 rotate-0'),
      children: isOpen ? /*#__PURE__*/_jsx(X, {
        className: "w-6 h-6 text-white"
      }) : /*#__PURE__*/_jsx(Plus, {
        className: "w-6 h-6 text-white"
      })
    })]
  });
}

// Desktop version - inline quick actions bar
export function QuickActionsBar({
  onNewBooking,
  onNewCustomer,
  onNewInvoice
}) {
  const navigate = useNavigate();
  const primaryActions = [{
    id: 'booking',
    label: 'Đặt sân',
    icon: Calendar,
    color: 'bg-green-500 hover:bg-green-600',
    onClick: onNewBooking || (() => navigate('/calendar'))
  }, {
    id: 'customer',
    label: 'Thêm khách',
    icon: Users,
    color: 'bg-purple-500 hover:bg-purple-600',
    onClick: onNewCustomer || (() => navigate('/customers'))
  }, {
    id: 'invoice',
    label: 'Hóa đơn',
    icon: Receipt,
    color: 'bg-orange-500 hover:bg-orange-600',
    onClick: onNewInvoice || (() => navigate('/invoices'))
  }];
  return /*#__PURE__*/_jsx("div", {
    className: "hidden lg:flex items-center gap-2",
    children: primaryActions.map(action => {
      const Icon = action.icon;
      return /*#__PURE__*/_jsxs("button", {
        onClick: action.onClick,
        className: cn('flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all', action.color),
        children: [/*#__PURE__*/_jsx(Icon, {
          className: "w-4 h-4"
        }), action.label]
      }, action.id);
    })
  });
}