import { useState } from 'react';
import { Building2, Clock, DollarSign, Bell, Save, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
  isExpanded = true,
  onToggle
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "bg-background-secondary rounded-xl border border-border overflow-hidden",
    children: [/*#__PURE__*/_jsxs("button", {
      onClick: onToggle,
      className: "w-full flex items-center justify-between p-4 hover:bg-background-hover transition-colors",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center",
          children: /*#__PURE__*/_jsx(Icon, {
            className: "w-5 h-5 text-primary-500"
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "text-left",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "font-semibold text-foreground",
            children: title
          }), description && /*#__PURE__*/_jsx("p", {
            className: "text-sm text-foreground-secondary",
            children: description
          })]
        })]
      }), /*#__PURE__*/_jsx(ChevronRight, {
        className: cn('w-5 h-5 text-foreground-muted transition-transform', isExpanded && 'rotate-90')
      })]
    }), isExpanded && /*#__PURE__*/_jsx("div", {
      className: "p-4 pt-0 border-t border-border",
      children: children
    })]
  });
}
export function VenueSettingsForm({
  initialSettings,
  onSave
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState('basic');
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
    } finally {
      setIsSaving(false);
    }
  };
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-4",
    children: [/*#__PURE__*/_jsx(SettingsSection, {
      title: "Th\xF4ng tin c\u01A1 s\u1EDF",
      description: "T\xEAn, \u0111\u1ECBa ch\u1EC9 v\xE0 li\xEAn h\u1EC7",
      icon: Building2,
      isExpanded: expandedSection === 'basic',
      onToggle: () => setExpandedSection(expandedSection === 'basic' ? '' : 'basic'),
      children: /*#__PURE__*/_jsxs("div", {
        className: "space-y-4 pt-4",
        children: [/*#__PURE__*/_jsx(Input, {
          label: "T\xEAn c\u01A1 s\u1EDF",
          value: settings.name,
          onChange: e => updateSetting('name', e.target.value),
          placeholder: "VD: S\xE2n c\u1EA7u l\xF4ng ABC"
        }), /*#__PURE__*/_jsx(Input, {
          label: "\u0110\u1ECBa ch\u1EC9",
          value: settings.address,
          onChange: e => updateSetting('address', e.target.value),
          placeholder: "VD: 123 Nguy\u1EC5n V\u0103n A, Qu\u1EADn 1, TP.HCM"
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4",
          children: [/*#__PURE__*/_jsx(Input, {
            label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
            value: settings.phone,
            onChange: e => updateSetting('phone', e.target.value),
            placeholder: "0123 456 789"
          }), /*#__PURE__*/_jsx(Input, {
            label: "Email",
            type: "email",
            value: settings.email,
            onChange: e => updateSetting('email', e.target.value),
            placeholder: "contact@example.com"
          })]
        })]
      })
    }), /*#__PURE__*/_jsx(SettingsSection, {
      title: "Gi\u1EDD ho\u1EA1t \u0111\u1ED9ng",
      description: "Th\u1EDDi gian m\u1EDF c\u1EEDa v\xE0 slot",
      icon: Clock,
      isExpanded: expandedSection === 'hours',
      onToggle: () => setExpandedSection(expandedSection === 'hours' ? '' : 'hours'),
      children: /*#__PURE__*/_jsxs("div", {
        className: "space-y-4 pt-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm font-medium text-foreground mb-1",
              children: "Gi\u1EDD m\u1EDF c\u1EEDa"
            }), /*#__PURE__*/_jsx("input", {
              type: "time",
              value: settings.openTime,
              onChange: e => updateSetting('openTime', e.target.value),
              className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "block text-sm font-medium text-foreground mb-1",
              children: "Gi\u1EDD \u0111\xF3ng c\u1EEDa"
            }), /*#__PURE__*/_jsx("input", {
              type: "time",
              value: settings.closeTime,
              onChange: e => updateSetting('closeTime', e.target.value),
              className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "block text-sm font-medium text-foreground mb-1",
            children: "Th\u1EDDi l\u01B0\u1EE3ng m\u1ED7i slot (ph\xFAt)"
          }), /*#__PURE__*/_jsxs("select", {
            value: settings.slotDuration,
            onChange: e => updateSetting('slotDuration', parseInt(e.target.value)),
            className: "w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg",
            children: [/*#__PURE__*/_jsx("option", {
              value: 30,
              children: "30 ph\xFAt"
            }), /*#__PURE__*/_jsx("option", {
              value: 60,
              children: "60 ph\xFAt"
            }), /*#__PURE__*/_jsx("option", {
              value: 90,
              children: "90 ph\xFAt"
            }), /*#__PURE__*/_jsx("option", {
              value: 120,
              children: "120 ph\xFAt"
            })]
          })]
        })]
      })
    }), /*#__PURE__*/_jsx(SettingsSection, {
      title: "B\u1EA3ng gi\xE1",
      description: "Gi\xE1 thu\xEA s\xE2n theo gi\u1EDD",
      icon: DollarSign,
      isExpanded: expandedSection === 'pricing',
      onToggle: () => setExpandedSection(expandedSection === 'pricing' ? '' : 'pricing'),
      children: /*#__PURE__*/_jsxs("div", {
        className: "space-y-4 pt-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4",
          children: [/*#__PURE__*/_jsx(Input, {
            label: "Gi\xE1 gi\u1EDD th\u01B0\u1EDDng (VN\u0110)",
            type: "number",
            value: settings.defaultHourlyRate.toString(),
            onChange: e => updateSetting('defaultHourlyRate', parseInt(e.target.value) || 0),
            placeholder: "80000"
          }), /*#__PURE__*/_jsx(Input, {
            label: "Gi\xE1 gi\u1EDD cao \u0111i\u1EC3m (VN\u0110)",
            type: "number",
            value: settings.peakHourRate.toString(),
            onChange: e => updateSetting('peakHourRate', parseInt(e.target.value) || 0),
            placeholder: "120000"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "block text-sm font-medium text-foreground mb-2",
            children: "Khung gi\u1EDD cao \u0111i\u1EC3m"
          }), /*#__PURE__*/_jsx("div", {
            className: "flex flex-wrap gap-2",
            children: ['17:00-19:00', '19:00-21:00', '07:00-09:00'].map(slot => /*#__PURE__*/_jsx("button", {
              onClick: () => {
                const isSelected = settings.peakHours.includes(slot);
                updateSetting('peakHours', isSelected ? settings.peakHours.filter(h => h !== slot) : [...settings.peakHours, slot]);
              },
              className: cn('px-3 py-1.5 rounded-lg border text-sm transition-all', settings.peakHours.includes(slot) ? 'bg-primary-500 text-white border-primary-500' : 'bg-background-tertiary border-border hover:border-primary-500'),
              children: slot
            }, slot))
          })]
        })]
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "flex justify-end pt-4",
      children: /*#__PURE__*/_jsxs(Button, {
        onClick: handleSave,
        disabled: isSaving,
        className: "gap-2",
        children: [isSaving ? /*#__PURE__*/_jsx(Loader2, {
          className: "w-4 h-4 animate-spin"
        }) : /*#__PURE__*/_jsx(Save, {
          className: "w-4 h-4"
        }), isSaving ? 'Đang lưu...' : 'Lưu cài đặt']
      })
    })]
  });
}

// Notification Settings

export function NotificationSettingsForm({
  initialSettings,
  onSave
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
    } finally {
      setIsSaving(false);
    }
  };
  const toggleSetting = key => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "bg-background-secondary rounded-xl border border-border p-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-3 mb-6",
      children: [/*#__PURE__*/_jsx("div", {
        className: "w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center",
        children: /*#__PURE__*/_jsx(Bell, {
          className: "w-5 h-5 text-primary-500"
        })
      }), /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h3", {
          className: "font-semibold text-foreground",
          children: "Th\xF4ng b\xE1o"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-sm text-foreground-secondary",
          children: "C\xE0i \u0111\u1EB7t email v\xE0 SMS"
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "space-y-4",
      children: [{
        key: 'emailNotifications',
        label: 'Thông báo qua Email',
        description: 'Nhận thông báo qua email'
      }, {
        key: 'smsNotifications',
        label: 'Thông báo qua SMS',
        description: 'Nhận thông báo qua tin nhắn'
      }, {
        key: 'bookingReminder',
        label: 'Nhắc lịch đặt sân',
        description: 'Tự động gửi nhắc nhở trước buổi chơi'
      }, {
        key: 'dailyReport',
        label: 'Báo cáo hàng ngày',
        description: 'Nhận tổng kết cuối ngày'
      }, {
        key: 'lowStockAlert',
        label: 'Cảnh báo tồn kho',
        description: 'Thông báo khi sản phẩm sắp hết'
      }].map(item => /*#__PURE__*/_jsxs("label", {
        className: "flex items-center justify-between p-3 bg-background-tertiary rounded-lg cursor-pointer hover:bg-background-hover transition-colors",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("p", {
            className: "font-medium text-foreground",
            children: item.label
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-foreground-secondary",
            children: item.description
          })]
        }), /*#__PURE__*/_jsx("input", {
          type: "checkbox",
          checked: settings[item.key],
          onChange: () => toggleSetting(item.key),
          className: "w-5 h-5 rounded border-border bg-background-secondary text-primary-500 focus:ring-primary-500"
        })]
      }, item.key))
    }), /*#__PURE__*/_jsx("div", {
      className: "flex justify-end mt-6",
      children: /*#__PURE__*/_jsxs(Button, {
        onClick: handleSave,
        disabled: isSaving,
        className: "gap-2",
        children: [isSaving ? /*#__PURE__*/_jsx(Loader2, {
          className: "w-4 h-4 animate-spin"
        }) : /*#__PURE__*/_jsx(Save, {
          className: "w-4 h-4"
        }), isSaving ? 'Đang lưu...' : 'Lưu cài đặt']
      })
    })]
  });
}