import { cn } from '@/lib/utils';
import { Users, Crown, Star, Clock } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FILTER_TABS = [{
  id: 'all',
  label: 'Tất cả',
  icon: Users,
  color: 'text-foreground'
}, {
  id: 'members',
  label: 'Thành viên',
  icon: Crown,
  color: 'text-yellow-500'
}, {
  id: 'frequent',
  label: 'Khách quen',
  icon: Star,
  color: 'text-blue-500'
}, {
  id: 'new',
  label: 'Khách mới',
  icon: Clock,
  color: 'text-green-500'
}];
export function CustomerFilterTabs({
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
          className: "font-medium",
          children: tab.label
        }), count !== undefined && /*#__PURE__*/_jsx("span", {
          className: cn('px-2 py-0.5 text-xs rounded-full', isActive ? 'bg-white/20 text-white' : 'bg-background-tertiary text-foreground-secondary'),
          children: count
        })]
      }, tab.id);
    })
  });
}

// Compact version for mobile
export function CustomerFilterDropdown({
  activeFilter,
  onFilterChange,
  counts
}) {
  const activeTab = FILTER_TABS.find(t => t.id === activeFilter) || FILTER_TABS[0];
  const ActiveIcon = activeTab.icon;
  return /*#__PURE__*/_jsxs("div", {
    className: "relative",
    children: [/*#__PURE__*/_jsx("select", {
      value: activeFilter,
      onChange: e => onFilterChange(e.target.value),
      className: "appearance-none w-full bg-background-secondary border border-border rounded-lg px-4 py-2.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
      children: FILTER_TABS.map(tab => /*#__PURE__*/_jsxs("option", {
        value: tab.id,
        children: [tab.label, " ", counts?.[tab.id] !== undefined && `(${counts[tab.id]})`]
      }, tab.id))
    }), /*#__PURE__*/_jsx(ActiveIcon, {
      className: cn('absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none', activeTab.color)
    })]
  });
}