import { useState } from 'react';
import { Calendar, Clock, MapPin, CreditCard, Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PAYMENT_METHODS = [{
  id: 'cash',
  label: 'Tiền mặt',
  icon: '💵'
}, {
  id: 'bank',
  label: 'Chuyển khoản',
  icon: '🏦'
}, {
  id: 'momo',
  label: 'Ví MoMo',
  icon: '💜'
}];
export function PublicBookingForm({
  venueName,
  venueAddress,
  courts,
  availableSlots,
  onSubmit,
  onDateChange
}) {
  const [step, setStep] = useState('court');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate pricing
  const slots = selectedCourt ? availableSlots[selectedCourt.id] || [] : [];
  const selectedSlotDetails = slots.filter(s => selectedSlots.includes(s.time));
  const totalPrice = selectedSlotDetails.reduce((sum, slot) => {
    const rate = slot.isPeak ? selectedCourt.peakHourRate : selectedCourt.hourlyRate;
    return sum + rate;
  }, 0);
  const handleNext = () => {
    const steps = ['court', 'time', 'info', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };
  const handleBack = () => {
    const steps = ['court', 'time', 'info', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };
  const handleDateChange = date => {
    setSelectedDate(date);
    setSelectedSlots([]);
    onDateChange(date);
  };
  const handleSlotToggle = time => {
    setSelectedSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      }
      // Allow consecutive slots only
      if (prev.length === 0) return [time];
      const sortedSlots = [...prev, time].sort();
      // Validate consecutive
      return sortedSlots;
    });
  };
  const handleSubmit = async () => {
    if (!selectedCourt || selectedSlots.length === 0) return;
    setIsSubmitting(true);
    try {
      const sortedSlots = [...selectedSlots].sort();
      await onSubmit({
        courtId: selectedCourt.id,
        date: selectedDate,
        startTime: sortedSlots[0],
        endTime: addHour(sortedSlots[sortedSlots.length - 1]),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email || undefined,
        notes: customerInfo.notes || undefined,
        paymentMethod
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const canProceed = () => {
    switch (step) {
      case 'court':
        return selectedCourt !== null;
      case 'time':
        return selectedSlots.length > 0;
      case 'info':
        return customerInfo.name.trim() !== '' && customerInfo.phone.trim().length >= 10;
      case 'confirm':
        return true;
      default:
        return false;
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-primary-500/5 via-background to-primary-600/5",
    children: [/*#__PURE__*/_jsx("div", {
      className: "bg-background-secondary border-b border-border sticky top-0 z-10",
      children: /*#__PURE__*/_jsx("div", {
        className: "max-w-2xl mx-auto px-4 py-4",
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white text-2xl",
            children: "\uD83C\uDFF8"
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h1", {
              className: "text-xl font-bold text-foreground",
              children: venueName
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-sm text-foreground-secondary flex items-center gap-1",
              children: [/*#__PURE__*/_jsx(MapPin, {
                className: "w-3 h-3"
              }), venueAddress]
            })]
          })]
        })
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "max-w-2xl mx-auto px-4 py-6",
      children: [/*#__PURE__*/_jsx("div", {
        className: "flex items-center justify-between mb-8",
        children: [{
          key: 'court',
          label: 'Chọn sân'
        }, {
          key: 'time',
          label: 'Chọn giờ'
        }, {
          key: 'info',
          label: 'Thông tin'
        }, {
          key: 'confirm',
          label: 'Xác nhận'
        }].map((s, i) => /*#__PURE__*/_jsxs("div", {
          className: "flex items-center",
          children: [/*#__PURE__*/_jsx("div", {
            className: cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors', step === s.key ? 'bg-primary-500 text-white' : ['court', 'time', 'info', 'confirm'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-background-tertiary text-foreground-muted'),
            children: ['court', 'time', 'info', 'confirm'].indexOf(step) > i ? /*#__PURE__*/_jsx(Check, {
              className: "w-4 h-4"
            }) : i + 1
          }), i < 3 && /*#__PURE__*/_jsx("div", {
            className: cn('w-12 sm:w-20 h-1 mx-2 rounded', ['court', 'time', 'info', 'confirm'].indexOf(step) > i ? 'bg-green-500' : 'bg-background-tertiary')
          })]
        }, s.key))
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary rounded-2xl border border-border p-6",
        children: [step === 'court' && /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-lg font-semibold text-foreground mb-4",
            children: "Ch\u1ECDn s\xE2n"
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-2 gap-4",
            children: courts.map(court => /*#__PURE__*/_jsxs("button", {
              onClick: () => setSelectedCourt(court),
              className: cn('p-4 rounded-xl border-2 text-left transition-all', selectedCourt?.id === court.id ? 'bg-primary-500/10 border-primary-500' : 'bg-background-tertiary border-transparent hover:border-primary-500/50'),
              children: [/*#__PURE__*/_jsx("div", {
                className: "aspect-video bg-background-hover rounded-lg mb-3 flex items-center justify-center text-4xl",
                children: "\uD83C\uDFF8"
              }), /*#__PURE__*/_jsx("h3", {
                className: "font-semibold text-foreground",
                children: court.name
              }), /*#__PURE__*/_jsxs("p", {
                className: "text-sm text-primary-500 font-medium",
                children: [formatCurrency(court.hourlyRate), "/gi\u1EDD"]
              }), court.peakHourRate > court.hourlyRate && /*#__PURE__*/_jsxs("p", {
                className: "text-xs text-foreground-muted",
                children: ["Gi\u1EDD cao \u0111i\u1EC3m: ", formatCurrency(court.peakHourRate), "/gi\u1EDD"]
              })]
            }, court.id))
          })]
        }), step === 'time' && /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-lg font-semibold text-foreground mb-4",
            children: "Ch\u1ECDn ng\xE0y v\xE0 gi\u1EDD"
          }), /*#__PURE__*/_jsxs("div", {
            className: "mb-6",
            children: [/*#__PURE__*/_jsxs("label", {
              className: "block text-sm font-medium text-foreground mb-2",
              children: [/*#__PURE__*/_jsx(Calendar, {
                className: "w-4 h-4 inline mr-1"
              }), "Ng\xE0y \u0111\u1EB7t s\xE2n"]
            }), /*#__PURE__*/_jsx("input", {
              type: "date",
              value: selectedDate,
              onChange: e => handleDateChange(e.target.value),
              min: new Date().toISOString().split('T')[0],
              className: "w-full px-4 py-3 bg-background-tertiary border border-border rounded-xl"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("label", {
              className: "block text-sm font-medium text-foreground mb-2",
              children: [/*#__PURE__*/_jsx(Clock, {
                className: "w-4 h-4 inline mr-1"
              }), "Ch\u1ECDn khung gi\u1EDD (", selectedSlots.length, " slot)"]
            }), /*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-4 gap-2",
              children: slots.map(slot => /*#__PURE__*/_jsxs("button", {
                onClick: () => slot.available && handleSlotToggle(slot.time),
                disabled: !slot.available,
                className: cn('py-3 rounded-lg text-sm font-medium transition-all', !slot.available && 'bg-background-tertiary text-foreground-muted cursor-not-allowed line-through', slot.available && !selectedSlots.includes(slot.time) && 'bg-green-500/10 text-green-500 hover:bg-green-500/20', selectedSlots.includes(slot.time) && 'bg-primary-500 text-white', slot.isPeak && slot.available && !selectedSlots.includes(slot.time) && 'ring-1 ring-orange-500'),
                children: [slot.time, slot.isPeak && slot.available && /*#__PURE__*/_jsx("span", {
                  className: "text-xs block opacity-70",
                  children: "Cao \u0111i\u1EC3m"
                })]
              }, slot.time))
            })]
          }), selectedSlots.length > 0 && /*#__PURE__*/_jsx("div", {
            className: "mt-6 p-4 bg-primary-500/10 rounded-xl",
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between items-center",
              children: [/*#__PURE__*/_jsxs("span", {
                className: "text-foreground",
                children: ["T\u1ED5ng ti\u1EC1n (", selectedSlots.length, " gi\u1EDD)"]
              }), /*#__PURE__*/_jsx("span", {
                className: "text-xl font-bold text-primary-500",
                children: formatCurrency(totalPrice)
              })]
            })
          })]
        }), step === 'info' && /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-lg font-semibold text-foreground mb-4",
            children: "Th\xF4ng tin li\xEAn h\u1EC7"
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-4",
            children: [/*#__PURE__*/_jsx(Input, {
              label: "H\u1ECD t\xEAn *",
              placeholder: "Nguy\u1EC5n V\u0103n A",
              value: customerInfo.name,
              onChange: e => setCustomerInfo(prev => ({
                ...prev,
                name: e.target.value
              }))
            }), /*#__PURE__*/_jsx(Input, {
              label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i *",
              placeholder: "0912 345 678",
              type: "tel",
              value: customerInfo.phone,
              onChange: e => setCustomerInfo(prev => ({
                ...prev,
                phone: e.target.value
              }))
            }), /*#__PURE__*/_jsx(Input, {
              label: "Email (kh\xF4ng b\u1EAFt bu\u1ED9c)",
              placeholder: "email@example.com",
              type: "email",
              value: customerInfo.email,
              onChange: e => setCustomerInfo(prev => ({
                ...prev,
                email: e.target.value
              }))
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium text-foreground mb-2",
                children: "Ghi ch\xFA"
              }), /*#__PURE__*/_jsx("textarea", {
                placeholder: "Y\xEAu c\u1EA7u \u0111\u1EB7c bi\u1EC7t...",
                value: customerInfo.notes,
                onChange: e => setCustomerInfo(prev => ({
                  ...prev,
                  notes: e.target.value
                })),
                className: "w-full px-4 py-3 bg-background-tertiary border border-border rounded-xl min-h-[100px]"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs("label", {
                className: "block text-sm font-medium text-foreground mb-2",
                children: [/*#__PURE__*/_jsx(CreditCard, {
                  className: "w-4 h-4 inline mr-1"
                }), "Ph\u01B0\u01A1ng th\u1EE9c thanh to\xE1n"]
              }), /*#__PURE__*/_jsx("div", {
                className: "grid grid-cols-3 gap-3",
                children: PAYMENT_METHODS.map(method => /*#__PURE__*/_jsxs("button", {
                  onClick: () => setPaymentMethod(method.id),
                  className: cn('p-3 rounded-xl border-2 text-center transition-all', paymentMethod === method.id ? 'bg-primary-500/10 border-primary-500' : 'bg-background-tertiary border-transparent'),
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-2xl block mb-1",
                    children: method.icon
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-sm",
                    children: method.label
                  })]
                }, method.id))
              })]
            })]
          })]
        }), step === 'confirm' && /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-lg font-semibold text-foreground mb-4",
            children: "X\xE1c nh\u1EADn \u0111\u1EB7t s\xE2n"
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-4",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "p-4 bg-background-tertiary rounded-xl space-y-2",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "S\xE2n"
                }), /*#__PURE__*/_jsx("span", {
                  className: "font-medium text-foreground",
                  children: selectedCourt?.name
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "Ng\xE0y"
                }), /*#__PURE__*/_jsx("span", {
                  className: "font-medium text-foreground",
                  children: selectedDate
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "Th\u1EDDi gian"
                }), /*#__PURE__*/_jsxs("span", {
                  className: "font-medium text-foreground",
                  children: [selectedSlots.sort()[0], " - ", addHour(selectedSlots.sort()[selectedSlots.length - 1])]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "Kh\xE1ch h\xE0ng"
                }), /*#__PURE__*/_jsx("span", {
                  className: "font-medium text-foreground",
                  children: customerInfo.name
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i"
                }), /*#__PURE__*/_jsx("span", {
                  className: "font-medium text-foreground",
                  children: customerInfo.phone
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-foreground-secondary",
                  children: "Thanh to\xE1n"
                }), /*#__PURE__*/_jsx("span", {
                  className: "font-medium text-foreground",
                  children: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label
                })]
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "p-4 bg-primary-500/10 rounded-xl",
              children: /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between items-center",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-lg font-medium text-foreground",
                  children: "T\u1ED5ng ti\u1EC1n"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-2xl font-bold text-primary-500",
                  children: formatCurrency(totalPrice)
                })]
              })
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-sm text-foreground-secondary text-center",
              children: ["B\u1EB1ng vi\u1EC7c x\xE1c nh\u1EADn, b\u1EA1n \u0111\u1ED3ng \xFD v\u1EDBi \u0111i\u1EC1u kho\u1EA3n d\u1ECBch v\u1EE5 c\u1EE7a ", venueName]
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex gap-4 mt-6",
        children: [step !== 'court' && /*#__PURE__*/_jsxs(Button, {
          variant: "ghost",
          className: "flex-1 gap-2",
          onClick: handleBack,
          children: [/*#__PURE__*/_jsx(ChevronLeft, {
            className: "w-4 h-4"
          }), "Quay l\u1EA1i"]
        }), step !== 'confirm' ? /*#__PURE__*/_jsxs(Button, {
          className: "flex-1 gap-2",
          onClick: handleNext,
          disabled: !canProceed(),
          children: ["Ti\u1EBFp t\u1EE5c", /*#__PURE__*/_jsx(ChevronRight, {
            className: "w-4 h-4"
          })]
        }) : /*#__PURE__*/_jsxs(Button, {
          className: "flex-1 gap-2",
          onClick: handleSubmit,
          disabled: isSubmitting,
          children: [isSubmitting ? /*#__PURE__*/_jsx(Loader2, {
            className: "w-4 h-4 animate-spin"
          }) : /*#__PURE__*/_jsx(Check, {
            className: "w-4 h-4"
          }), isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt sân']
        })]
      })]
    })]
  });
}

// Helper function
function addHour(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const newHours = (hours + 1) % 24;
  return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}