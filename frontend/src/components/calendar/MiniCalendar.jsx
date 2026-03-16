import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
export function MiniCalendar({
  selectedDate,
  onDateSelect
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date(selectedDate);
    date.setDate(1);
    return date;
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  };
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  // Get days for current month view
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };
  const days = getDaysInMonth();
  const isSelected = date => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };
  const isToday = date => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "bg-background-secondary border border-border rounded-xl p-4",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mb-4",
      children: [/*#__PURE__*/_jsx("button", {
        onClick: goToPreviousMonth,
        className: "p-1 rounded hover:bg-background-tertiary transition-colors",
        children: /*#__PURE__*/_jsx(ChevronLeft, {
          className: "w-4 h-4 text-foreground-secondary"
        })
      }), /*#__PURE__*/_jsxs("span", {
        className: "font-medium text-foreground",
        children: [MONTHS[currentMonth.getMonth()], " ", currentMonth.getFullYear()]
      }), /*#__PURE__*/_jsx("button", {
        onClick: goToNextMonth,
        className: "p-1 rounded hover:bg-background-tertiary transition-colors",
        children: /*#__PURE__*/_jsx(ChevronRight, {
          className: "w-4 h-4 text-foreground-secondary"
        })
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-7 gap-1 mb-2",
      children: WEEKDAYS.map(day => /*#__PURE__*/_jsx("div", {
        className: "text-center text-xs text-foreground-muted font-medium py-1",
        children: day
      }, day))
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-7 gap-1",
      children: days.map((date, idx) => /*#__PURE__*/_jsx("button", {
        onClick: () => date && onDateSelect(date),
        disabled: !date,
        className: cn('aspect-square flex items-center justify-center text-sm rounded-lg transition-colors', !date && 'invisible', date && !isSelected(date) && !isToday(date) && 'text-foreground-secondary hover:bg-background-tertiary', isToday(date) && !isSelected(date) && 'text-primary-500 font-medium', isSelected(date) && 'bg-primary-500 text-white font-medium'),
        children: date?.getDate()
      }, idx))
    }), /*#__PURE__*/_jsxs("div", {
      className: "mt-4 pt-4 border-t border-border flex gap-2",
      children: [/*#__PURE__*/_jsx("button", {
        onClick: () => onDateSelect(today),
        className: "flex-1 text-sm py-2 rounded-lg bg-background-tertiary hover:bg-primary-500/20 hover:text-primary-500 transition-colors",
        children: "H\xF4m nay"
      }), /*#__PURE__*/_jsx("button", {
        onClick: () => {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          onDateSelect(tomorrow);
        },
        className: "flex-1 text-sm py-2 rounded-lg bg-background-tertiary hover:bg-primary-500/20 hover:text-primary-500 transition-colors",
        children: "Ng\xE0y mai"
      })]
    })]
  });
}