import { cn } from '@/lib/utils';
import { Receipt, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FILTER_TABS = [{
  id: 'all',
  label: 'Tất cả',
  icon: Receipt,
  color: 'text-foreground'
}, {
  id: 'pending',
  label: 'Chờ thanh toán',
  icon: Clock,
  color: 'text-yellow-500'
}, {
  id: 'paid',
  label: 'Đã thanh toán',
  icon: CheckCircle,
  color: 'text-green-500'
}, {
  id: 'cancelled',
  label: 'Đã hủy',
  icon: XCircle,
  color: 'text-red-500'
}, {
  id: 'refunded',
  label: 'Hoàn tiền',
  icon: DollarSign,
  color: 'text-purple-500'
}];
export function InvoiceFilterTabs({
  activeFilter,
  onFilterChange,
  counts
}) {
  return /*#__PURE__*/_jsx("div", {
    className: "flex flex-wrap gap-2",
    children: FILTER_TABS.map(tab => {
      const Icon = tab.icon;
      const count = counts?.[tab.id];
      const isActive = activeFilter === tab.id;
      return /*#__PURE__*/_jsxs("button", {
        onClick: () => onFilterChange(tab.id),
        className: cn('flex items-center gap-2 px-4 py-2 rounded-lg border transition-all', isActive ? 'bg-primary-500 text-white border-primary-500' : 'bg-background-secondary border-border hover:border-primary-500/50 hover:bg-background-hover'),
        children: [/*#__PURE__*/_jsx(Icon, {
          className: cn('w-4 h-4', isActive ? 'text-white' : tab.color)
        }), /*#__PURE__*/_jsx("span", {
          className: "font-medium text-sm",
          children: tab.label
        }), count !== undefined && /*#__PURE__*/_jsx("span", {
          className: cn('px-2 py-0.5 text-xs rounded-full', isActive ? 'bg-white/20 text-white' : 'bg-background-tertiary text-foreground-secondary'),
          children: count
        })]
      }, tab.id);
    })
  });
}