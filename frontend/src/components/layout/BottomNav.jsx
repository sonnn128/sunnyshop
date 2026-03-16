import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, FileText, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const navItems = [{
  name: 'Trang chủ',
  href: '/',
  icon: LayoutDashboard
}, {
  name: 'Lịch',
  href: '/calendar',
  icon: Calendar
}, {
  name: 'Khách',
  href: '/customers',
  icon: Users
}, {
  name: 'Hóa đơn',
  href: '/invoices',
  icon: FileText
}, {
  name: 'Thêm',
  href: '#',
  icon: Menu
}];
export function BottomNav() {
  return /*#__PURE__*/_jsx("nav", {
    className: "md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-secondary border-t border-border safe-area-inset-bottom",
    children: /*#__PURE__*/_jsx("div", {
      className: "flex items-center justify-around h-16",
      children: navItems.map(item => /*#__PURE__*/_jsxs(NavLink, {
        to: item.href,
        className: ({
          isActive
        }) => cn('flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors', isActive ? 'text-primary-500' : 'text-foreground-muted hover:text-foreground'),
        children: [/*#__PURE__*/_jsx(item.icon, {
          className: "w-5 h-5"
        }), /*#__PURE__*/_jsx("span", {
          className: "text-xs mt-1 font-medium",
          children: item.name
        })]
      }, item.href))
    })
  });
}