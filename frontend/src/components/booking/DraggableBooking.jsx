import { useState } from 'react';
import { User, Clock, GripVertical, Check, X } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function DraggableBookingCard({
  booking,
  onDragStart,
  onDragEnd,
  isDragging = false,
  isGhost = false
}) {
  const handleDragStart = e => {
    e.dataTransfer.setData('application/json', JSON.stringify(booking));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(booking);
  };
  const handleDragEnd = () => {
    onDragEnd?.();
  };
  return /*#__PURE__*/_jsxs("div", {
    draggable: booking.status === 'CONFIRMED',
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    className: cn('group relative p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing', booking.status === 'CONFIRMED' && 'bg-blue-500/10 border-blue-500/30 hover:shadow-md', booking.status === 'CHECKED_IN' && 'bg-green-500/10 border-green-500/30', booking.status === 'PENDING' && 'bg-yellow-500/10 border-yellow-500/30', isDragging && 'opacity-50 scale-95', isGhost && 'border-dashed border-2 border-primary-500 bg-primary-500/5'),
    children: [booking.status === 'CONFIRMED' && /*#__PURE__*/_jsx("div", {
      className: "absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
      children: /*#__PURE__*/_jsx(GripVertical, {
        className: "w-4 h-4 text-foreground-muted"
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: cn(booking.status === 'CONFIRMED' && 'pl-4'),
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2 mb-1",
        children: [/*#__PURE__*/_jsx(User, {
          className: "w-4 h-4 text-foreground-muted"
        }), /*#__PURE__*/_jsx("span", {
          className: "font-medium text-foreground truncate",
          children: booking.customerName
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2 text-sm text-foreground-secondary",
        children: [/*#__PURE__*/_jsx(Clock, {
          className: "w-3 h-3"
        }), /*#__PURE__*/_jsxs("span", {
          children: [booking.startTime, " - ", booking.endTime]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-1 text-sm font-medium text-primary-500",
        children: formatCurrency(booking.amount)
      })]
    })]
  });
}

// Drop zone for calendar cells

export function DroppableZone({
  courtId,
  timeSlot,
  onDrop,
  children,
  isOccupied = false
}) {
  const [isOver, setIsOver] = useState(false);
  const handleDragOver = e => {
    if (isOccupied) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };
  const handleDragLeave = () => {
    setIsOver(false);
  };
  const handleDrop = e => {
    e.preventDefault();
    setIsOver(false);
    if (isOccupied) return;
    try {
      const data = e.dataTransfer.getData('application/json');
      const booking = JSON.parse(data);
      onDrop(booking, {
        courtId,
        timeSlot
      });
    } catch (error) {
      console.error('Failed to parse drop data:', error);
    }
  };
  return /*#__PURE__*/_jsx("div", {
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    className: cn('min-h-[60px] transition-all', isOver && !isOccupied && 'bg-primary-500/10 ring-2 ring-primary-500 ring-inset rounded-lg'),
    children: children
  });
}

// Confirmation dialog for move

export function MoveConfirmDialog({
  isOpen,
  booking,
  target,
  courtName,
  onConfirm,
  onCancel
}) {
  if (!isOpen || !booking || !target) return null;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-50 bg-black/50",
      onClick: onCancel
    }), /*#__PURE__*/_jsx("div", {
      className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm p-4",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary rounded-xl border border-border shadow-2xl p-6",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "text-lg font-semibold text-foreground mb-2",
          children: "X\xE1c nh\u1EADn di chuy\u1EC3n"
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-foreground-secondary mb-4",
          children: ["Di chuy\u1EC3n l\u1ECBch \u0111\u1EB7t c\u1EE7a ", /*#__PURE__*/_jsx("strong", {
            children: booking.customerName
          }), " \u0111\u1EBFn:"]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-background-tertiary rounded-lg p-3 mb-4",
          children: [/*#__PURE__*/_jsx("p", {
            className: "font-medium text-foreground",
            children: courtName
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-foreground-secondary",
            children: target.timeSlot
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-3",
          children: [/*#__PURE__*/_jsxs(Button, {
            variant: "ghost",
            className: "flex-1 gap-2",
            onClick: onCancel,
            children: [/*#__PURE__*/_jsx(X, {
              className: "w-4 h-4"
            }), "H\u1EE7y"]
          }), /*#__PURE__*/_jsxs(Button, {
            className: "flex-1 gap-2",
            onClick: onConfirm,
            children: [/*#__PURE__*/_jsx(Check, {
              className: "w-4 h-4"
            }), "X\xE1c nh\u1EADn"]
          })]
        })]
      })
    })]
  });
}