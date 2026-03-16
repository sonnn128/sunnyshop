import { useState, useEffect } from 'react';
import { X, Loader2, Check, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bookingApi } from '@/services/booking.service';
import { useToast } from '@/hooks/use-toast';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function EditBookingModal({
  isOpen,
  onClose,
  booking,
  onSuccess
}) {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    notes: ''
  });

  // Initialize form data when booking changes
  useEffect(() => {
    if (booking) {
      setFormData({
        startTime: booking.startTime,
        endTime: booking.endTime,
        notes: booking.notes || ''
      });
      setAvailability(null);
    }
  }, [booking]);

  // Check availability when time changes
  useEffect(() => {
    if (!booking || !formData.startTime || !formData.endTime) return;

    // Only check if time actually changed
    if (formData.startTime === booking.startTime && formData.endTime === booking.endTime) {
      setAvailability({
        available: true,
        conflicts: []
      });
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingAvailability(true);
      try {
        const result = await bookingApi.checkAvailability(booking.courtId, booking.date, formData.startTime, formData.endTime);
        // Filter out current booking from conflicts
        const filteredConflicts = result.conflicts.filter(c => c.id !== booking.id);
        setAvailability({
          available: filteredConflicts.length === 0,
          conflicts: filteredConflicts
        });
      } catch {
        setAvailability(null);
      } finally {
        setLoadingAvailability(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [booking, formData.startTime, formData.endTime]);
  const handleSubmit = async e => {
    e.preventDefault();
    if (!booking) return;
    if (availability && !availability.available) {
      toast({
        title: 'Khung giờ đã có người đặt',
        variant: 'error'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await bookingApi.update(booking.id, {
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes
      });
      toast({
        title: 'Cập nhật thành công!'
      });
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể cập nhật lịch đặt';
      toast({
        title: message,
        variant: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen || !booking) return null;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50",
      onClick: onClose
    }), /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 flex items-center justify-center z-50 p-4",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between p-4 border-b border-border",
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-lg font-semibold text-foreground",
            children: "Ch\u1EC9nh s\u1EEDa l\u1ECBch \u0111\u1EB7t"
          }), /*#__PURE__*/_jsx("button", {
            onClick: onClose,
            className: "p-1 rounded-lg hover:bg-background-tertiary transition-colors",
            children: /*#__PURE__*/_jsx(X, {
              className: "w-5 h-5 text-foreground-secondary"
            })
          })]
        }), /*#__PURE__*/_jsxs("form", {
          onSubmit: handleSubmit,
          className: "p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "bg-background-tertiary rounded-lg p-3 space-y-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex justify-between items-center",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm text-foreground-secondary",
                children: "S\xE2n"
              }), /*#__PURE__*/_jsx("span", {
                className: "font-medium text-foreground",
                children: booking.court?.name
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between items-center",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm text-foreground-secondary",
                children: "Ng\xE0y"
              }), /*#__PURE__*/_jsx("span", {
                className: "font-medium text-foreground",
                children: new Date(booking.date).toLocaleDateString('vi-VN')
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between items-center",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm text-foreground-secondary",
                children: "Kh\xE1ch h\xE0ng"
              }), /*#__PURE__*/_jsx("span", {
                className: "font-medium text-foreground",
                children: booking.customer?.name || 'Khách vãng lai'
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "grid grid-cols-2 gap-3",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs("label", {
                className: "block text-sm font-medium text-foreground-secondary mb-1.5",
                children: [/*#__PURE__*/_jsx(Clock, {
                  className: "w-4 h-4 inline mr-1"
                }), "Gi\u1EDD b\u1EAFt \u0111\u1EA7u"]
              }), /*#__PURE__*/_jsx(Input, {
                type: "time",
                value: formData.startTime,
                onChange: e => setFormData({
                  ...formData,
                  startTime: e.target.value
                }),
                required: true
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium text-foreground-secondary mb-1.5",
                children: "Gi\u1EDD k\u1EBFt th\xFAc"
              }), /*#__PURE__*/_jsx(Input, {
                type: "time",
                value: formData.endTime,
                onChange: e => setFormData({
                  ...formData,
                  endTime: e.target.value
                }),
                required: true
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: cn("p-3 rounded-lg border flex items-center gap-3", loadingAvailability ? 'border-border bg-background-tertiary' : availability?.available ? 'border-green-500/30 bg-green-500/10' : availability === null ? 'border-border bg-background-tertiary' : 'border-red-500/30 bg-red-500/10'),
            children: loadingAvailability ? /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(Loader2, {
                className: "w-5 h-5 text-foreground-secondary animate-spin"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-foreground-secondary text-sm",
                children: "\u0110ang ki\u1EC3m tra..."
              })]
            }) : availability?.available ? /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(Check, {
                className: "w-5 h-5 text-green-500"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-green-400 text-sm",
                children: "Khung gi\u1EDD c\xF3 th\u1EC3 c\u1EADp nh\u1EADt"
              })]
            }) : availability === null ? /*#__PURE__*/_jsx("span", {
              className: "text-foreground-secondary text-sm",
              children: "Thay \u0111\u1ED5i gi\u1EDD \u0111\u1EC3 ki\u1EC3m tra"
            }) : /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(AlertCircle, {
                className: "w-5 h-5 text-red-500"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-red-400 text-sm",
                children: ["Khung gi\u1EDD \u0111\xE3 c\xF3 ng\u01B0\u1EDDi \u0111\u1EB7t", availability.conflicts.length > 0 && /*#__PURE__*/_jsxs("span", {
                  children: [" (", availability.conflicts.map(c => `${c.startTime}-${c.endTime}`).join(', '), ")"]
                })]
              })]
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm font-medium text-foreground-secondary mb-1.5",
              children: "Ghi ch\xFA"
            }), /*#__PURE__*/_jsx("textarea", {
              value: formData.notes,
              onChange: e => setFormData({
                ...formData,
                notes: e.target.value
              }),
              className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none",
              rows: 3,
              placeholder: "Nh\u1EADp ghi ch\xFA..."
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-end gap-3 p-4 border-t border-border bg-background-tertiary",
          children: [/*#__PURE__*/_jsx(Button, {
            variant: "secondary",
            onClick: onClose,
            children: "H\u1EE7y"
          }), /*#__PURE__*/_jsx(Button, {
            onClick: handleSubmit,
            isLoading: isSubmitting,
            disabled: isSubmitting || loadingAvailability || availability !== null && !availability.available,
            children: "C\u1EADp nh\u1EADt"
          })]
        })]
      })
    })]
  });
}