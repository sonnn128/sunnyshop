import { cn } from '@/lib/utils';
import { CalendarDays, CalendarRange, List } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const views = [{
  id: 'day',
  label: 'Ngày',
  icon: /*#__PURE__*/_jsx(CalendarDays, {
    className: "w-4 h-4"
  })
}, {
  id: 'week',
  label: 'Tuần',
  icon: /*#__PURE__*/_jsx(CalendarRange, {
    className: "w-4 h-4"
  })
}, {
  id: 'list',
  label: 'Danh sách',
  icon: /*#__PURE__*/_jsx(List, {
    className: "w-4 h-4"
  })
}];
export function ViewToggle({
  activeView,
  onViewChange
}) {
  return /*#__PURE__*/_jsx("div", {
    className: "flex bg-background-tertiary rounded-lg p-1",
    children: views.map(view => /*#__PURE__*/_jsxs("button", {
      onClick: () => onViewChange(view.id),
      className: cn('flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors', activeView === view.id ? 'bg-primary-500 text-white' : 'text-foreground-secondary hover:text-foreground'),
      children: [view.icon, /*#__PURE__*/_jsx("span", {
        className: "hidden sm:inline",
        children: view.label
      })]
    }, view.id))
  });
}