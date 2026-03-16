import { useState } from 'react';
import { X, Calendar, Clock, Repeat, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const WEEKDAYS = [{
  value: 0,
  label: 'CN',
  fullLabel: 'Chủ nhật'
}, {
  value: 1,
  label: 'T2',
  fullLabel: 'Thứ 2'
}, {
  value: 2,
  label: 'T3',
  fullLabel: 'Thứ 3'
}, {
  value: 3,
  label: 'T4',
  fullLabel: 'Thứ 4'
}, {
  value: 4,
  label: 'T5',
  fullLabel: 'Thứ 5'
}, {
  value: 5,
  label: 'T6',
  fullLabel: 'Thứ 6'
}, {
  value: 6,
  label: 'T7',
  fullLabel: 'Thứ 7'
}];
const TIME_OPTIONS = Array.from({
  length: 34
}, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minute = i % 2 * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});
export function RecurringBookingModal({
  isOpen,
  onClose,
  courts,
  onSubmit,
  isLoading = false
}) {
  const [formData, setFormData] = useState({
    courtId: courts[0]?.id || '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    startTime: '18:00',
    endTime: '20:00',
    daysOfWeek: [],
    totalAmount: 0,
    notes: ''
  });
  const [errors, setErrors] = useState({});
  if (!isOpen) return null;
  const toggleDay = day => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day) ? prev.daysOfWeek.filter(d => d !== day) : [...prev.daysOfWeek, day].sort()
    }));
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.courtId) newErrors.courtId = 'Vui lòng chọn sân';
    if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    if (formData.daysOfWeek.length === 0) newErrors.daysOfWeek = 'Vui lòng chọn ít nhất 1 ngày trong tuần';
    if (formData.startTime >= formData.endTime) newErrors.time = 'Giờ kết thúc phải sau giờ bắt đầu';
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Calculate estimated bookings count
  const estimateBookingsCount = () => {
    if (!formData.startDate || !formData.endDate || formData.daysOfWeek.length === 0) {
      return 0;
    }
    let count = 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (formData.daysOfWeek.includes(d.getDay())) {
        count++;
      }
    }
    return count;
  };
  const estimatedCount = estimateBookingsCount();
  return /*#__PURE__*/_jsxs("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
      onClick: onClose
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative bg-background-secondary border border-border rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "sticky top-0 bg-background-secondary flex items-center justify-between p-4 border-b border-border",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(Repeat, {
            className: "w-5 h-5 text-primary-500"
          }), /*#__PURE__*/_jsx("h2", {
            className: "text-lg font-semibold text-foreground",
            children: "\u0110\u1EB7t s\xE2n \u0111\u1ECBnh k\u1EF3"
          })]
        }), /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "p-1 rounded-lg hover:bg-background-tertiary transition-colors",
          children: /*#__PURE__*/_jsx(X, {
            className: "w-5 h-5 text-foreground-secondary"
          })
        })]
      }), /*#__PURE__*/_jsxs("form", {
        onSubmit: handleSubmit,
        className: "p-4 space-y-4",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "block text-sm font-medium text-foreground mb-1",
            children: "Ch\u1ECDn s\xE2n"
          }), /*#__PURE__*/_jsx("select", {
            value: formData.courtId,
            onChange: e => setFormData(prev => ({
              ...prev,
              courtId: e.target.value
            })),
            className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
            children: courts.map(court => /*#__PURE__*/_jsx("option", {
              value: court.id,
              children: court.name
            }, court.id))
          }), errors.courtId && /*#__PURE__*/_jsx("p", {
            className: "mt-1 text-xs text-error",
            children: errors.courtId
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "block text-sm font-medium text-foreground mb-1",
              children: [/*#__PURE__*/_jsx(Calendar, {
                className: "w-4 h-4 inline mr-1"
              }), "Ng\xE0y b\u1EAFt \u0111\u1EA7u"]
            }), /*#__PURE__*/_jsx("input", {
              type: "date",
              value: formData.startDate,
              onChange: e => setFormData(prev => ({
                ...prev,
                startDate: e.target.value
              })),
              className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
            }), errors.startDate && /*#__PURE__*/_jsx("p", {
              className: "mt-1 text-xs text-error",
              children: errors.startDate
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "block text-sm font-medium text-foreground mb-1",
              children: [/*#__PURE__*/_jsx(Calendar, {
                className: "w-4 h-4 inline mr-1"
              }), "Ng\xE0y k\u1EBFt th\xFAc"]
            }), /*#__PURE__*/_jsx("input", {
              type: "date",
              value: formData.endDate,
              onChange: e => setFormData(prev => ({
                ...prev,
                endDate: e.target.value
              })),
              className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
            }), errors.endDate && /*#__PURE__*/_jsx("p", {
              className: "mt-1 text-xs text-error",
              children: errors.endDate
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "block text-sm font-medium text-foreground mb-1",
              children: [/*#__PURE__*/_jsx(Clock, {
                className: "w-4 h-4 inline mr-1"
              }), "Gi\u1EDD b\u1EAFt \u0111\u1EA7u"]
            }), /*#__PURE__*/_jsx("select", {
              value: formData.startTime,
              onChange: e => setFormData(prev => ({
                ...prev,
                startTime: e.target.value
              })),
              className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
              children: TIME_OPTIONS.map(time => /*#__PURE__*/_jsx("option", {
                value: time,
                children: time
              }, time))
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "block text-sm font-medium text-foreground mb-1",
              children: [/*#__PURE__*/_jsx(Clock, {
                className: "w-4 h-4 inline mr-1"
              }), "Gi\u1EDD k\u1EBFt th\xFAc"]
            }), /*#__PURE__*/_jsx("select", {
              value: formData.endTime,
              onChange: e => setFormData(prev => ({
                ...prev,
                endTime: e.target.value
              })),
              className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
              children: TIME_OPTIONS.map(time => /*#__PURE__*/_jsx("option", {
                value: time,
                children: time
              }, time))
            })]
          })]
        }), errors.time && /*#__PURE__*/_jsx("p", {
          className: "text-xs text-error",
          children: errors.time
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "block text-sm font-medium text-foreground mb-2",
            children: "Ch\u1ECDn ng\xE0y trong tu\u1EA7n"
          }), /*#__PURE__*/_jsx("div", {
            className: "flex gap-2",
            children: WEEKDAYS.map(day => /*#__PURE__*/_jsx("button", {
              type: "button",
              onClick: () => toggleDay(day.value),
              title: day.fullLabel,
              className: cn('flex-1 py-2 rounded-lg text-sm font-medium transition-colors', formData.daysOfWeek.includes(day.value) ? 'bg-primary-500 text-white' : 'bg-background-tertiary text-foreground-secondary hover:text-foreground'),
              children: day.label
            }, day.value))
          }), errors.daysOfWeek && /*#__PURE__*/_jsx("p", {
            className: "mt-1 text-xs text-error",
            children: errors.daysOfWeek
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "block text-sm font-medium text-foreground mb-1",
            children: "Ghi ch\xFA"
          }), /*#__PURE__*/_jsx("textarea", {
            value: formData.notes,
            onChange: e => setFormData(prev => ({
              ...prev,
              notes: e.target.value
            })),
            placeholder: "Ghi ch\xFA v\u1EC1 l\u1ECBch \u0111\u1EB7t \u0111\u1ECBnh k\u1EF3...",
            rows: 2,
            className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          })]
        }), estimatedCount > 0 && /*#__PURE__*/_jsx("div", {
          className: "bg-primary-500/10 border border-primary-500/30 rounded-lg p-3",
          children: /*#__PURE__*/_jsxs("div", {
            className: "flex items-start gap-2",
            children: [/*#__PURE__*/_jsx(AlertCircle, {
              className: "w-5 h-5 text-primary-500 mt-0.5"
            }), /*#__PURE__*/_jsxs("div", {
              className: "text-sm text-foreground",
              children: [/*#__PURE__*/_jsxs("p", {
                className: "font-medium",
                children: ["S\u1EBD t\u1EA1o ", estimatedCount, " l\u1ECBch \u0111\u1EB7t s\xE2n"]
              }), /*#__PURE__*/_jsxs("p", {
                className: "text-foreground-secondary mt-1",
                children: ["V\xE0o c\xE1c ng\xE0y ", formData.daysOfWeek.map(d => WEEKDAYS.find(w => w.value === d)?.fullLabel).join(', '), ' ', "t\u1EEB ", formData.startTime, " \u0111\u1EBFn ", formData.endTime]
              })]
            })]
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-3 pt-2",
          children: [/*#__PURE__*/_jsx(Button, {
            type: "button",
            variant: "secondary",
            className: "flex-1",
            onClick: onClose,
            children: "H\u1EE7y"
          }), /*#__PURE__*/_jsx(Button, {
            type: "submit",
            className: "flex-1",
            isLoading: isLoading,
            children: "T\u1EA1o l\u1ECBch \u0111\u1ECBnh k\u1EF3"
          })]
        })]
      })]
    })]
  });
}