import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText, AlertCircle, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { bookingApi } from '@/services/booking.service';
import { customerApi } from '@/services/customer.service';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const TIME_OPTIONS = Array.from({
  length: 34
}, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minute = i % 2 * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});
export function NewBookingModal({
  isOpen,
  onClose,
  courts,
  selectedDate,
  selectedCourtId = '',
  selectedTime = '',
  onSuccess
}) {
  const [formData, setFormData] = useState({
    courtId: selectedCourtId,
    customerId: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    startTime: selectedTime || '08:00',
    endTime: selectedTime ? `${String(parseInt(selectedTime.split(':')[0]) + 1).padStart(2, '0')}:${selectedTime.split(':')[1]}` : '09:00',
    notes: ''
  });
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        courtId: selectedCourtId || courts[0]?.id || '',
        customerId: '',
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        startTime: selectedTime || '08:00',
        endTime: selectedTime ? `${String(parseInt(selectedTime.split(':')[0]) + 1).padStart(2, '0')}:${selectedTime.split(':')[1]}` : '09:00',
        notes: ''
      });
      setSelectedCustomer(null);
      setCustomerSearch('');
      setPricing(null);
      setAvailability(null);
      setErrors({});
    }
  }, [isOpen, selectedCourtId, selectedDate, selectedTime, courts]);

  // Load customers
  useEffect(() => {
    customerApi.getAll({
      limit: 100
    }).then(res => {
      setCustomers(res.data);
    });
  }, []);

  // Check availability and price when court/date/time changes
  useEffect(() => {
    if (formData.courtId && formData.date && formData.startTime && formData.endTime) {
      // Check availability
      setLoadingAvailability(true);
      bookingApi.checkAvailability(formData.courtId, formData.date, formData.startTime, formData.endTime).then(result => {
        setAvailability(result);
        setLoadingAvailability(false);
      }).catch(() => {
        setLoadingAvailability(false);
      });

      // Calculate price
      setIsLoadingPrice(true);
      bookingApi.calculatePrice(formData.courtId, formData.date, formData.startTime, formData.endTime).then(result => {
        setPricing(result);
        setIsLoadingPrice(false);
      }).catch(() => {
        setIsLoadingPrice(false);
      });
    }
  }, [formData.courtId, formData.date, formData.startTime, formData.endTime]);
  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch));
  const validate = () => {
    const newErrors = {};
    if (!formData.courtId) newErrors.courtId = 'Vui lòng chọn sân';
    if (!formData.date) newErrors.date = 'Vui lòng chọn ngày';
    if (!formData.startTime) newErrors.startTime = 'Vui lòng chọn giờ bắt đầu';
    if (!formData.endTime) newErrors.endTime = 'Vui lòng chọn giờ kết thúc';
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu';
    }
    if (availability && !availability.available) {
      newErrors.availability = 'Khung giờ này đã có người đặt';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const input = {
        courtId: formData.courtId,
        customerId: selectedCustomer?.id,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes || undefined
      };
      await bookingApi.create(input);
      onSuccess();
      onClose();
    } catch (error) {
      setErrors({
        submit: 'Không thể tạo lịch đặt. Vui lòng thử lại.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const selectCustomer = customer => {
    setSelectedCustomer(customer);
    setFormData(prev => ({
      ...prev,
      customerId: customer.id
    }));
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
  };
  if (!isOpen) return null;
  return /*#__PURE__*/_jsxs("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
      onClick: onClose
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative w-full max-w-xl mx-4 bg-background-secondary border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-hidden",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between p-4 border-b border-border bg-background-tertiary",
        children: [/*#__PURE__*/_jsx("h2", {
          className: "text-lg font-semibold text-foreground",
          children: "\u0110\u1EB7t s\xE2n m\u1EDBi"
        }), /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "p-1 rounded-lg hover:bg-background transition-colors",
          children: /*#__PURE__*/_jsx(X, {
            className: "w-5 h-5 text-foreground-secondary"
          })
        })]
      }), /*#__PURE__*/_jsxs("form", {
        onSubmit: handleSubmit,
        className: "p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("label", {
            className: "flex items-center gap-2 text-sm font-medium text-foreground mb-2",
            children: [/*#__PURE__*/_jsx(Calendar, {
              className: "w-4 h-4 text-primary-500"
            }), "Ch\u1ECDn s\xE2n *"]
          }), /*#__PURE__*/_jsxs("select", {
            value: formData.courtId,
            onChange: e => setFormData(prev => ({
              ...prev,
              courtId: e.target.value
            })),
            className: cn("w-full bg-background-tertiary border rounded-lg px-3 py-2.5 text-foreground", "focus:outline-none focus:ring-2 focus:ring-primary-500", errors.courtId ? 'border-red-500' : 'border-border'),
            children: [/*#__PURE__*/_jsx("option", {
              value: "",
              children: "-- Ch\u1ECDn s\xE2n --"
            }), courts.map(court => /*#__PURE__*/_jsx("option", {
              value: court.id,
              children: court.name
            }, court.id))]
          }), errors.courtId && /*#__PURE__*/_jsx("p", {
            className: "text-red-400 text-sm mt-1",
            children: errors.courtId
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("label", {
            className: "flex items-center gap-2 text-sm font-medium text-foreground mb-2",
            children: [/*#__PURE__*/_jsx(Calendar, {
              className: "w-4 h-4 text-primary-500"
            }), "Ng\xE0y \u0111\u1EB7t *"]
          }), /*#__PURE__*/_jsx("input", {
            type: "date",
            value: formData.date,
            onChange: e => setFormData(prev => ({
              ...prev,
              date: e.target.value
            })),
            className: cn("w-full bg-background-tertiary border rounded-lg px-3 py-2.5 text-foreground", "focus:outline-none focus:ring-2 focus:ring-primary-500", errors.date ? 'border-red-500' : 'border-border')
          }), errors.date && /*#__PURE__*/_jsx("p", {
            className: "text-red-400 text-sm mt-1",
            children: errors.date
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "flex items-center gap-2 text-sm font-medium text-foreground mb-2",
              children: [/*#__PURE__*/_jsx(Clock, {
                className: "w-4 h-4 text-primary-500"
              }), "Gi\u1EDD b\u1EAFt \u0111\u1EA7u *"]
            }), /*#__PURE__*/_jsx("select", {
              value: formData.startTime,
              onChange: e => setFormData(prev => ({
                ...prev,
                startTime: e.target.value
              })),
              className: cn("w-full bg-background-tertiary border rounded-lg px-3 py-2.5 text-foreground", "focus:outline-none focus:ring-2 focus:ring-primary-500", errors.startTime ? 'border-red-500' : 'border-border'),
              children: TIME_OPTIONS.map(time => /*#__PURE__*/_jsx("option", {
                value: time,
                children: time
              }, time))
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "flex items-center gap-2 text-sm font-medium text-foreground mb-2",
              children: [/*#__PURE__*/_jsx(Clock, {
                className: "w-4 h-4 text-primary-500"
              }), "Gi\u1EDD k\u1EBFt th\xFAc *"]
            }), /*#__PURE__*/_jsx("select", {
              value: formData.endTime,
              onChange: e => setFormData(prev => ({
                ...prev,
                endTime: e.target.value
              })),
              className: cn("w-full bg-background-tertiary border rounded-lg px-3 py-2.5 text-foreground", "focus:outline-none focus:ring-2 focus:ring-primary-500", errors.endTime ? 'border-red-500' : 'border-border'),
              children: TIME_OPTIONS.map(time => /*#__PURE__*/_jsx("option", {
                value: time,
                children: time
              }, time))
            }), errors.endTime && /*#__PURE__*/_jsx("p", {
              className: "text-red-400 text-sm mt-1",
              children: errors.endTime
            })]
          })]
        }), formData.courtId && formData.date && /*#__PURE__*/_jsx("div", {
          className: cn("p-3 rounded-lg border flex items-center gap-3", loadingAvailability ? 'border-border bg-background-tertiary' : availability?.available ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'),
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
              children: "Khung gi\u1EDD tr\u1ED1ng, c\xF3 th\u1EC3 \u0111\u1EB7t"
            })]
          }) : /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx(AlertCircle, {
              className: "w-5 h-5 text-red-500"
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-red-400 text-sm",
              children: ["Khung gi\u1EDD \u0111\xE3 c\xF3 ng\u01B0\u1EDDi \u0111\u1EB7t", availability && availability.conflicts && availability.conflicts.length > 0 && /*#__PURE__*/_jsxs("span", {
                children: [" (", availability.conflicts.map(c => `${c.startTime}-${c.endTime}`).join(', '), ")"]
              })]
            })]
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "relative",
          children: [/*#__PURE__*/_jsxs("label", {
            className: "flex items-center gap-2 text-sm font-medium text-foreground mb-2",
            children: [/*#__PURE__*/_jsx(User, {
              className: "w-4 h-4 text-primary-500"
            }), "Kh\xE1ch h\xE0ng (kh\xF4ng b\u1EAFt bu\u1ED9c)"]
          }), /*#__PURE__*/_jsx("input", {
            type: "text",
            value: customerSearch,
            onChange: e => {
              setCustomerSearch(e.target.value);
              setShowCustomerDropdown(true);
              if (!e.target.value) {
                setSelectedCustomer(null);
                setFormData(prev => ({
                  ...prev,
                  customerId: ''
                }));
              }
            },
            onFocus: () => setShowCustomerDropdown(true),
            placeholder: "T\xECm theo t\xEAn ho\u1EB7c s\u1ED1 \u0111i\u1EC7n tho\u1EA1i...",
            className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          }), showCustomerDropdown && customerSearch && /*#__PURE__*/_jsx("div", {
            className: "absolute z-10 w-full mt-1 bg-background-tertiary border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto",
            children: filteredCustomers.length === 0 ? /*#__PURE__*/_jsx("div", {
              className: "p-3 text-center text-foreground-secondary text-sm",
              children: "Kh\xF4ng t\xECm th\u1EA5y kh\xE1ch h\xE0ng"
            }) : filteredCustomers.slice(0, 5).map(customer => /*#__PURE__*/_jsxs("button", {
              type: "button",
              onClick: () => selectCustomer(customer),
              className: "w-full flex items-center gap-3 p-3 hover:bg-background transition-colors text-left",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-medium",
                children: customer.name.charAt(0)
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-sm font-medium text-foreground",
                  children: customer.name
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xs text-foreground-secondary",
                  children: customer.phone
                })]
              }), customer.membershipTier && /*#__PURE__*/_jsx("span", {
                className: cn("ml-auto text-xs px-2 py-0.5 rounded", customer.membershipTier === 'GOLD' && 'bg-yellow-500/20 text-yellow-400', customer.membershipTier === 'SILVER' && 'bg-gray-400/20 text-gray-300', customer.membershipTier === 'PLATINUM' && 'bg-purple-500/20 text-purple-400', customer.membershipTier === 'BRONZE' && 'bg-orange-500/20 text-orange-400'),
                children: customer.membershipTier
              })]
            }, customer.id))
          }), selectedCustomer && /*#__PURE__*/_jsxs("div", {
            className: "mt-2 flex items-center gap-2 text-sm text-primary-400",
            children: [/*#__PURE__*/_jsx(Check, {
              className: "w-4 h-4"
            }), "\u0110\xE3 ch\u1ECDn: ", selectedCustomer.name, " (", selectedCustomer.phone, ")"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("label", {
            className: "flex items-center gap-2 text-sm font-medium text-foreground mb-2",
            children: [/*#__PURE__*/_jsx(FileText, {
              className: "w-4 h-4 text-primary-500"
            }), "Ghi ch\xFA"]
          }), /*#__PURE__*/_jsx("textarea", {
            value: formData.notes,
            onChange: e => setFormData(prev => ({
              ...prev,
              notes: e.target.value
            })),
            placeholder: "Ghi ch\xFA th\xEAm v\u1EC1 l\u1ECBch \u0111\u1EB7t...",
            rows: 3,
            className: "w-full bg-background-tertiary border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          })]
        }), pricing && /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-lg bg-gradient-to-r from-primary-500/10 to-cyan-500/10 border border-primary-500/30",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex justify-between items-center",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-foreground-secondary",
              children: "Th\u1EDDi l\u01B0\u1EE3ng:"
            }), /*#__PURE__*/_jsxs("span", {
              className: "font-medium text-foreground",
              children: [pricing.duration, " gi\u1EDD"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex justify-between items-center mt-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-foreground-secondary",
              children: "Gi\xE1/gi\u1EDD:"
            }), /*#__PURE__*/_jsxs("span", {
              className: "font-medium text-foreground",
              children: [new Intl.NumberFormat('vi-VN').format(pricing.pricePerHour), " \u0111"]
            })]
          }), pricing.appliedRule && /*#__PURE__*/_jsxs("div", {
            className: "flex justify-between items-center mt-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-foreground-secondary",
              children: "\xC1p d\u1EE5ng:"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-sm text-primary-400",
              children: pricing.appliedRule
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex justify-between items-center mt-3 pt-3 border-t border-border",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-semibold text-foreground",
              children: "T\u1ED5ng c\u1ED9ng:"
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-xl font-bold text-primary-400",
              children: [new Intl.NumberFormat('vi-VN').format(pricing.total), " \u0111"]
            })]
          })]
        }), errors.submit && /*#__PURE__*/_jsxs("div", {
          className: "p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-sm",
          children: [/*#__PURE__*/_jsx(AlertCircle, {
            className: "w-4 h-4 flex-shrink-0"
          }), errors.submit]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-end gap-3 p-4 border-t border-border bg-background-tertiary",
        children: [/*#__PURE__*/_jsx(Button, {
          variant: "ghost",
          onClick: onClose,
          children: "H\u1EE7y"
        }), /*#__PURE__*/_jsx(Button, {
          type: "submit",
          onClick: handleSubmit,
          disabled: isSubmitting || loadingAvailability || isLoadingPrice || availability !== null && !availability.available,
          className: "gap-2",
          children: isSubmitting ? /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx(Loader2, {
              className: "w-4 h-4 animate-spin"
            }), "\u0110ang t\u1EA1o..."]
          }) : /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx(Check, {
              className: "w-4 h-4"
            }), "\u0110\u1EB7t s\xE2n"]
          })
        })]
      })]
    })]
  });
}
export default NewBookingModal;