import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Repeat } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { bookingApi } from '@/services/booking.service';
import { venueApi } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';
import { ViewToggle, MiniCalendar, WeekView, ListView } from '@/components/calendar';
import { RecurringBookingModal, BookingDetailPanel, NewBookingModal, EditBookingModal } from '@/components/booking';
import { recurringBookingApi } from '@/services/recurring-booking.service';

// Time slots from 6:00 to 23:00
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const TIME_SLOTS = Array.from({
  length: 18
}, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});
function getBookingSlot(booking) {
  const [startH, startM] = booking.startTime.split(':').map(Number);
  const [endH, endM] = booking.endTime.split(':').map(Number);
  const startRow = (startH - 6) * 2 + Math.floor(startM / 30) + 2; // +2 for header
  const endRow = (endH - 6) * 2 + Math.floor(endM / 30) + 2;
  return {
    booking,
    gridRow: startRow,
    gridRowSpan: Math.max(endRow - startRow, 1)
  };
}
function getStatusColor(status) {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-blue-500/20 border-blue-500 text-blue-400';
    case 'IN_PROGRESS':
      return 'bg-green-500/20 border-green-500 text-green-400';
    case 'PENDING':
      return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
    case 'COMPLETED':
      return 'bg-gray-500/20 border-gray-500 text-gray-400';
    case 'CANCELLED':
      return 'bg-red-500/20 border-red-500 text-red-400';
    default:
      return 'bg-gray-500/20 border-gray-500 text-gray-400';
  }
}
function getStatusLabel(status) {
  switch (status) {
    case 'CONFIRMED':
      return 'Đã xác nhận';
    case 'IN_PROGRESS':
      return 'Đang chơi';
    case 'PENDING':
      return 'Chờ xác nhận';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return status;
  }
}
export default function BookingCalendarPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState('day');
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showEditBookingModal, setShowEditBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();

  // Fetch venues
  const {
    data: venuesData
  } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venueApi.getAll({
      isActive: true
    })
  });

  // Set first venue as default
  useEffect(() => {
    if (venuesData?.data && venuesData.data.length > 0 && !selectedVenueId) {
      setSelectedVenueId(venuesData.data[0].id);
    }
  }, [venuesData, selectedVenueId]);

  // Fetch calendar data
  const {
    data: calendarData,
    isLoading
  } = useQuery({
    queryKey: ['calendar', selectedVenueId, selectedDate.toISOString().split('T')[0]],
    queryFn: () => bookingApi.getCalendarData(selectedVenueId, selectedDate.toISOString().split('T')[0], selectedDate.toISOString().split('T')[0]),
    enabled: !!selectedVenueId
  });

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: id => bookingApi.checkIn(id),
    onSuccess: () => {
      toast({
        title: 'Check-in thành công!'
      });
      queryClient.invalidateQueries({
        queryKey: ['calendar']
      });
      setSelectedBooking(null);
    },
    onError: () => {
      toast({
        title: 'Lỗi khi check-in',
        variant: 'error'
      });
    }
  });

  // Check-out mutation
  const checkOutMutation = useMutation({
    mutationFn: id => bookingApi.checkOut(id),
    onSuccess: () => {
      toast({
        title: 'Check-out thành công!'
      });
      queryClient.invalidateQueries({
        queryKey: ['calendar']
      });
      setSelectedBooking(null);
    },
    onError: () => {
      toast({
        title: 'Lỗi khi check-out',
        variant: 'error'
      });
    }
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: id => bookingApi.cancel(id),
    onSuccess: () => {
      toast({
        title: 'Đã hủy lịch đặt!'
      });
      queryClient.invalidateQueries({
        queryKey: ['calendar']
      });
      setSelectedBooking(null);
    },
    onError: () => {
      toast({
        title: 'Lỗi khi hủy',
        variant: 'error'
      });
    }
  });

  // Navigate dates
  const goToPreviousDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };
  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };
  const goToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);
  };

  // Process bookings for grid layout
  const bookingsByCourtId = useMemo(() => {
    if (!calendarData?.bookings) return {};
    const map = {};
    calendarData.bookings.forEach(booking => {
      if (!map[booking.courtId]) map[booking.courtId] = [];
      map[booking.courtId].push(getBookingSlot(booking));
    });
    return map;
  }, [calendarData]);
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col h-full",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold text-foreground",
          children: "L\u1ECBch \u0110\u1EB7t S\xE2n"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-foreground-secondary",
          children: "Qu\u1EA3n l\xFD l\u1ECBch \u0111\u1EB7t s\xE2n theo ng\xE0y"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsxs(Button, {
          variant: "secondary",
          className: "gap-2",
          onClick: () => setShowRecurringModal(true),
          children: [/*#__PURE__*/_jsx(Repeat, {
            className: "w-4 h-4"
          }), /*#__PURE__*/_jsx("span", {
            className: "hidden sm:inline",
            children: "L\u1ECBch c\u1ED1 \u0111\u1ECBnh"
          })]
        }), /*#__PURE__*/_jsxs(Button, {
          className: "gap-2",
          onClick: () => setShowNewBookingModal(true),
          children: [/*#__PURE__*/_jsx(Plus, {
            className: "w-4 h-4"
          }), /*#__PURE__*/_jsx("span", {
            className: "hidden sm:inline",
            children: "\u0110\u1EB7t s\xE2n m\u1EDBi"
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mb-4 p-4 bg-background-secondary rounded-lg border border-border",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-4",
        children: [/*#__PURE__*/_jsx("label", {
          className: "text-sm text-foreground-secondary",
          children: "C\u01A1 s\u1EDF:"
        }), /*#__PURE__*/_jsx("select", {
          value: selectedVenueId,
          onChange: e => setSelectedVenueId(e.target.value),
          className: "bg-background-tertiary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
          children: venuesData?.data.map(venue => /*#__PURE__*/_jsx("option", {
            value: venue.id,
            children: venue.name
          }, venue.id))
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsx(Button, {
          variant: "ghost",
          size: "sm",
          onClick: goToPreviousDay,
          children: /*#__PURE__*/_jsx(ChevronLeft, {
            className: "w-4 h-4"
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 px-4 py-2 bg-background-tertiary rounded-lg",
          children: [/*#__PURE__*/_jsx(CalendarIcon, {
            className: "w-4 h-4 text-foreground-secondary"
          }), /*#__PURE__*/_jsx("span", {
            className: "font-medium",
            children: formatDate(selectedDate)
          }), isToday && /*#__PURE__*/_jsx("span", {
            className: "text-xs px-2 py-0.5 bg-primary-500/20 text-primary-500 rounded",
            children: "H\xF4m nay"
          })]
        }), /*#__PURE__*/_jsx(Button, {
          variant: "ghost",
          size: "sm",
          onClick: goToNextDay,
          children: /*#__PURE__*/_jsx(ChevronRight, {
            className: "w-4 h-4"
          })
        }), !isToday && /*#__PURE__*/_jsx(Button, {
          variant: "outline",
          size: "sm",
          onClick: goToToday,
          children: "H\xF4m nay"
        })]
      }), /*#__PURE__*/_jsx(ViewToggle, {
        activeView: viewMode,
        onViewChange: setViewMode
      }), /*#__PURE__*/_jsx("div", {
        className: "flex items-center gap-4 text-sm",
        children: /*#__PURE__*/_jsxs("span", {
          className: "text-foreground-secondary",
          children: [calendarData?.bookings.length || 0, " l\u1ECBch \u0111\u1EB7t"]
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-1 gap-4 min-h-0",
      children: [/*#__PURE__*/_jsxs("aside", {
        className: "hidden lg:flex flex-col w-72 gap-4",
        children: [/*#__PURE__*/_jsx(MiniCalendar, {
          selectedDate: selectedDate,
          onDateSelect: setSelectedDate
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-background-secondary rounded-xl border border-border p-4",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-sm font-medium text-foreground-secondary mb-3",
            children: "T\u1ED5ng quan h\xF4m nay"
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex justify-between items-center",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm text-foreground-secondary",
                children: "T\u1ED5ng l\u1ECBch \u0111\u1EB7t"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-lg font-bold text-foreground",
                children: calendarData?.bookings.length || 0
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between items-center",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm text-foreground-secondary",
                children: "\u0110ang ch\u01A1i"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-lg font-bold text-green-400",
                children: calendarData?.bookings.filter(b => b.status === 'IN_PROGRESS').length || 0
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between items-center",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm text-foreground-secondary",
                children: "S\u1EAFp t\u1EDBi"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-lg font-bold text-blue-400",
                children: calendarData?.bookings.filter(b => b.status === 'CONFIRMED').length || 0
              })]
            })]
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "flex-1 overflow-auto bg-background-secondary rounded-lg border border-border",
        children: isLoading ? /*#__PURE__*/_jsx("div", {
          className: "flex items-center justify-center h-full",
          children: /*#__PURE__*/_jsx("div", {
            className: "animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
          })
        }) : calendarData?.courts.length === 0 ? /*#__PURE__*/_jsxs("div", {
          className: "flex flex-col items-center justify-center h-full text-foreground-secondary",
          children: [/*#__PURE__*/_jsx(CalendarIcon, {
            className: "w-12 h-12 mb-4 opacity-50"
          }), /*#__PURE__*/_jsx("p", {
            children: "Ch\u01B0a c\xF3 s\xE2n n\xE0o \u0111\u01B0\u1EE3c thi\u1EBFt l\u1EADp"
          })]
        }) : /*#__PURE__*/_jsxs(_Fragment, {
          children: [viewMode === 'day' && /*#__PURE__*/_jsxs("div", {
            className: "grid min-w-max",
            style: {
              gridTemplateColumns: `80px repeat(${calendarData?.courts.length || 1}, minmax(200px, 1fr))`,
              gridTemplateRows: `auto repeat(${TIME_SLOTS.length * 2}, 30px)`
            },
            children: [/*#__PURE__*/_jsx("div", {
              className: "sticky top-0 left-0 z-20 bg-background-tertiary border-b border-r border-border"
            }), calendarData?.courts.map(court => /*#__PURE__*/_jsx("div", {
              className: "sticky top-0 z-10 bg-background-tertiary border-b border-r border-border px-4 py-3 text-center font-medium",
              children: court.name
            }, court.id)), TIME_SLOTS.map((time, idx) => /*#__PURE__*/_jsxs(React.Fragment, {
              children: [/*#__PURE__*/_jsx("div", {
                className: "sticky left-0 z-10 bg-background-secondary border-r border-border px-3 py-1 text-xs text-foreground-secondary text-right",
                style: {
                  gridRow: `${idx * 2 + 2} / span 2`
                },
                children: time
              }, `time-${time}`), calendarData?.courts.map(court => /*#__PURE__*/_jsx("div", {
                className: cn('border-r border-b border-border/50 relative', idx % 2 === 0 ? 'border-b-border' : ''),
                style: {
                  gridColumn: calendarData.courts.indexOf(court) + 2
                }
              }, `cell-${time}-${court.id}`))]
            }, `time-row-${time}`)), calendarData?.courts.map((court, courtIdx) => bookingsByCourtId[court.id]?.map(slot => /*#__PURE__*/_jsx("div", {
              className: cn('absolute mx-1 my-0.5 p-2 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg group', getStatusColor(slot.booking.status)),
              style: {
                gridColumn: courtIdx + 2,
                gridRow: `${slot.gridRow} / span ${slot.gridRowSpan}`,
                position: 'relative'
              },
              onClick: () => setSelectedBooking(slot.booking),
              children: /*#__PURE__*/_jsxs("div", {
                className: "flex flex-col h-full overflow-hidden",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsxs("span", {
                    className: "text-xs font-medium",
                    children: [slot.booking.startTime, " - ", slot.booking.endTime]
                  }), slot.booking.status === 'CONFIRMED' && /*#__PURE__*/_jsx("button", {
                    onClick: e => {
                      e.stopPropagation();
                      checkInMutation.mutate(slot.booking.id);
                    },
                    className: "opacity-0 group-hover:opacity-100 bg-green-500 hover:bg-green-600 text-white text-[10px] px-2 py-0.5 rounded transition-all font-medium",
                    title: "Check-in nhanh",
                    children: "\u2713 Check-in"
                  }), slot.booking.status !== 'CONFIRMED' && /*#__PURE__*/_jsx("span", {
                    className: "text-[10px] opacity-75",
                    children: getStatusLabel(slot.booking.status)
                  })]
                }), slot.booking.customer && /*#__PURE__*/_jsx("div", {
                  className: "mt-1 text-sm font-medium truncate",
                  children: slot.booking.customer.name
                }), /*#__PURE__*/_jsx("div", {
                  className: "mt-auto text-xs opacity-75",
                  children: formatCurrency(slot.booking.totalAmount)
                })]
              })
            }, slot.booking.id)))]
          }), viewMode === 'week' && /*#__PURE__*/_jsx(WeekView, {
            weekStartDate: selectedDate,
            courts: calendarData?.courts || [],
            bookings: calendarData?.bookings || [],
            onSlotClick: (_courtId, date, _time) => {
              setSelectedDate(date);
              setShowNewBookingModal(true);
            },
            onBookingClick: setSelectedBooking
          }), viewMode === 'list' && /*#__PURE__*/_jsx(ListView, {
            bookings: calendarData?.bookings || [],
            onBookingClick: setSelectedBooking
          })]
        })
      })]
    }), /*#__PURE__*/_jsx(BookingDetailPanel, {
      booking: selectedBooking,
      isOpen: !!selectedBooking,
      onClose: () => setSelectedBooking(null),
      onCheckIn: id => checkInMutation.mutate(id),
      onCheckOut: id => checkOutMutation.mutate(id),
      onCancel: id => cancelMutation.mutate(id),
      onEdit: booking => {
        setEditingBooking(booking);
        setShowEditBookingModal(true);
        setSelectedBooking(null);
      }
    }), /*#__PURE__*/_jsx(RecurringBookingModal, {
      isOpen: showRecurringModal,
      onClose: () => setShowRecurringModal(false),
      courts: calendarData?.courts.map(c => ({
        id: c.id,
        name: c.name
      })) || [],
      onSubmit: data => {
        recurringBookingApi.create(data).then(() => {
          toast({
            title: 'Đã tạo lịch đặt định kỳ'
          });
          setShowRecurringModal(false);
          queryClient.invalidateQueries({
            queryKey: ['calendar']
          });
        }).catch(() => {
          toast({
            title: 'Lỗi khi tạo lịch định kỳ',
            variant: 'error'
          });
        });
      }
    }), /*#__PURE__*/_jsx(NewBookingModal, {
      isOpen: showNewBookingModal,
      onClose: () => setShowNewBookingModal(false),
      courts: calendarData?.courts || [],
      selectedDate: selectedDate,
      onSuccess: () => {
        toast({
          title: 'Đã tạo lịch đặt sân!'
        });
        setShowNewBookingModal(false);
        queryClient.invalidateQueries({
          queryKey: ['calendar']
        });
      }
    }), /*#__PURE__*/_jsx(EditBookingModal, {
      isOpen: showEditBookingModal,
      onClose: () => {
        setShowEditBookingModal(false);
        setEditingBooking(null);
      },
      booking: editingBooking,
      onSuccess: () => {
        setShowEditBookingModal(false);
        setEditingBooking(null);
        queryClient.invalidateQueries({
          queryKey: ['calendar']
        });
      }
    })]
  });
}