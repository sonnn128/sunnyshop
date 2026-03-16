import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Clock, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Mock notifications - in real app, this would come from API
const mockNotifications = [{
  id: '1',
  type: 'info',
  title: 'Đặt sân mới',
  message: 'Nguyễn Văn A đã đặt Sân A1 lúc 18:00',
  time: '5 phút trước',
  read: false,
  link: '/calendar',
  data: {
    bookingId: 'booking-001'
  }
}, {
  id: '2',
  type: 'warning',
  title: 'Sắp check-in',
  message: 'Trần Thị B có lịch lúc 14:00 - Sân A2',
  time: '15 phút trước',
  read: false,
  link: '/calendar',
  data: {
    bookingId: 'booking-002'
  }
}, {
  id: '3',
  type: 'success',
  title: 'Thanh toán thành công',
  message: 'Hóa đơn #INV-2026-001234 đã được thanh toán',
  time: '1 giờ trước',
  read: true,
  link: '/invoices',
  data: {
    invoiceId: 'INV-2026-001234'
  }
}, {
  id: '4',
  type: 'error',
  title: 'Hủy đặt sân',
  message: 'Lê Văn C đã hủy lịch đặt lúc 20:00',
  time: '2 giờ trước',
  read: true,
  link: '/calendar',
  data: {
    bookingId: 'booking-003'
  }
}, {
  id: '5',
  type: 'warning',
  title: 'Tồn kho thấp',
  message: 'Cầu lông Yonex AS-50 còn 5 sản phẩm',
  time: '3 giờ trước',
  read: false,
  link: '/inventory'
}];
export function NotificationDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleNotificationClick = notification => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notification.id ? {
      ...n,
      read: true
    } : n));

    // Close dropdown
    setIsOpen(false);

    // Navigate to the relevant page
    if (notification.link) {
      // Build query params if needed
      const params = new URLSearchParams();
      if (notification.data?.bookingId) {
        params.set('booking', notification.data.bookingId);
      }
      if (notification.data?.invoiceId) {
        params.set('invoice', notification.data.invoiceId);
      }
      if (notification.data?.customerId) {
        params.set('customer', notification.data.customerId);
      }
      const queryString = params.toString();
      const url = queryString ? `${notification.link}?${queryString}` : notification.link;
      navigate(url);
    }
  };
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({
      ...n,
      read: true
    })));
  };
  const getTypeIcon = type => {
    switch (type) {
      case 'info':
        return /*#__PURE__*/_jsx(Bell, {
          className: "w-4 h-4 text-info"
        });
      case 'warning':
        return /*#__PURE__*/_jsx(Clock, {
          className: "w-4 h-4 text-warning"
        });
      case 'success':
        return /*#__PURE__*/_jsx(Check, {
          className: "w-4 h-4 text-success"
        });
      case 'error':
        return /*#__PURE__*/_jsx(X, {
          className: "w-4 h-4 text-error"
        });
    }
  };
  const getTypeBgColor = type => {
    switch (type) {
      case 'info':
        return 'bg-info/10';
      case 'warning':
        return 'bg-warning/10';
      case 'success':
        return 'bg-success/10';
      case 'error':
        return 'bg-error/10';
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    ref: dropdownRef,
    className: "relative",
    children: [/*#__PURE__*/_jsxs("button", {
      onClick: () => setIsOpen(!isOpen),
      className: "relative p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-background-tertiary transition-colors",
      children: [/*#__PURE__*/_jsx(Bell, {
        className: "w-5 h-5"
      }), unreadCount > 0 && /*#__PURE__*/_jsx("span", {
        className: "absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-error text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse",
        children: unreadCount > 9 ? '9+' : unreadCount
      })]
    }), isOpen && /*#__PURE__*/_jsxs("div", {
      className: "absolute right-0 top-full mt-2 w-96 bg-background-secondary border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-slideDown",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between px-4 py-3 border-b border-border bg-background-tertiary/50",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "font-semibold text-foreground",
            children: "Th\xF4ng b\xE1o"
          }), unreadCount > 0 && /*#__PURE__*/_jsxs("span", {
            className: "px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full",
            children: [unreadCount, " m\u1EDBi"]
          })]
        }), unreadCount > 0 && /*#__PURE__*/_jsx("button", {
          onClick: markAllAsRead,
          className: "text-xs text-primary-500 hover:underline font-medium",
          children: "\u0110\xE1nh d\u1EA5u \u0111\xE3 \u0111\u1ECDc"
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "max-h-96 overflow-y-auto",
        children: notifications.length === 0 ? /*#__PURE__*/_jsxs("div", {
          className: "py-12 text-center text-foreground-muted",
          children: [/*#__PURE__*/_jsx(Bell, {
            className: "w-10 h-10 mx-auto mb-3 opacity-50"
          }), /*#__PURE__*/_jsx("p", {
            className: "font-medium",
            children: "Kh\xF4ng c\xF3 th\xF4ng b\xE1o m\u1EDBi"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm mt-1",
            children: "Khi c\xF3 th\xF4ng b\xE1o, ch\xFAng s\u1EBD hi\u1EC3n th\u1ECB \u1EDF \u0111\xE2y"
          })]
        }) : notifications.map(notification => /*#__PURE__*/_jsx("button", {
          onClick: () => handleNotificationClick(notification),
          className: cn('w-full text-left px-4 py-3.5 hover:bg-background-tertiary transition-colors border-b border-border last:border-0 group', !notification.read && 'bg-primary-500/5'),
          children: /*#__PURE__*/_jsxs("div", {
            className: "flex gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: cn('mt-0.5 p-2 rounded-lg', getTypeBgColor(notification.type)),
              children: getTypeIcon(notification.type)
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex-1 min-w-0",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between gap-2",
                children: [/*#__PURE__*/_jsx("span", {
                  className: cn('font-medium text-sm', !notification.read ? 'text-foreground' : 'text-foreground-secondary'),
                  children: notification.title
                }), /*#__PURE__*/_jsx(ChevronRight, {
                  className: "w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity"
                })]
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-foreground-secondary mt-0.5 line-clamp-2",
                children: notification.message
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 mt-1.5",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-xs text-foreground-muted",
                  children: notification.time
                }), !notification.read && /*#__PURE__*/_jsx("span", {
                  className: "w-1.5 h-1.5 bg-primary-500 rounded-full"
                })]
              })]
            })]
          })
        }, notification.id))
      }), /*#__PURE__*/_jsx("div", {
        className: "border-t border-border bg-background-tertiary/50",
        children: /*#__PURE__*/_jsxs("button", {
          onClick: () => {
            setIsOpen(false);
            navigate('/notifications');
          },
          className: "w-full py-3 text-sm text-primary-500 hover:bg-background-tertiary transition-colors font-medium flex items-center justify-center gap-1",
          children: ["Xem t\u1EA5t c\u1EA3 th\xF4ng b\xE1o", /*#__PURE__*/_jsx(ChevronRight, {
            className: "w-4 h-4"
          })]
        })
      })]
    }), /*#__PURE__*/_jsx("style", {
      children: `
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
            `
    })]
  });
}