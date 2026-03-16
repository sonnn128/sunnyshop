import { useState } from 'react';
import { ClipboardList, Plus, AlertTriangle, CheckCircle, Info, Send, Clock, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const NOTE_TYPES = [{
  id: 'urgent',
  label: 'Khẩn cấp',
  icon: AlertTriangle,
  color: 'text-red-500 bg-red-500/10'
}, {
  id: 'info',
  label: 'Thông tin',
  icon: Info,
  color: 'text-blue-500 bg-blue-500/10'
}, {
  id: 'completed',
  label: 'Hoàn thành',
  icon: CheckCircle,
  color: 'text-green-500 bg-green-500/10'
}];
function formatTime(date) {
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
function formatDate(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) {
    return 'Hôm nay';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Hôm qua';
  }
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit'
  });
}
export function ShiftHandover({
  notes,
  currentUser,
  onAddNote,
  onAcknowledge
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState({
    type: 'info',
    message: ''
  });
  const unacknowledgedCount = notes.filter(n => !n.acknowledged && n.type === 'urgent').length;
  const handleSubmit = () => {
    if (!newNote.message.trim()) return;
    onAddNote({
      type: newNote.type,
      message: newNote.message,
      author: currentUser
    });
    setNewNote({
      type: 'info',
      message: ''
    });
    setShowAddForm(false);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "bg-background-secondary rounded-xl border border-border overflow-hidden",
    children: [/*#__PURE__*/_jsxs("button", {
      onClick: () => setIsExpanded(!isExpanded),
      className: "w-full flex items-center justify-between p-4 hover:bg-background-hover transition-colors",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsx("div", {
          className: cn('w-10 h-10 rounded-lg flex items-center justify-center', unacknowledgedCount > 0 ? 'bg-red-500/20' : 'bg-primary-500/20'),
          children: /*#__PURE__*/_jsx(ClipboardList, {
            className: cn('w-5 h-5', unacknowledgedCount > 0 ? 'text-red-500' : 'text-primary-500')
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "text-left",
          children: [/*#__PURE__*/_jsxs("h3", {
            className: "font-semibold text-foreground flex items-center gap-2",
            children: ["Ghi ch\xFA b\xE0n giao ca", unacknowledgedCount > 0 && /*#__PURE__*/_jsxs("span", {
              className: "bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse",
              children: [unacknowledgedCount, " c\u1EA7n x\xE1c nh\u1EADn"]
            })]
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-sm text-foreground-secondary",
            children: [notes.length, " ghi ch\xFA"]
          })]
        })]
      }), isExpanded ? /*#__PURE__*/_jsx(ChevronUp, {
        className: "w-5 h-5 text-foreground-muted"
      }) : /*#__PURE__*/_jsx(ChevronDown, {
        className: "w-5 h-5 text-foreground-muted"
      })]
    }), isExpanded && /*#__PURE__*/_jsxs("div", {
      className: "border-t border-border",
      children: [/*#__PURE__*/_jsx("div", {
        className: "p-4 border-b border-border",
        children: !showAddForm ? /*#__PURE__*/_jsxs(Button, {
          variant: "outline",
          className: "w-full gap-2",
          onClick: () => setShowAddForm(true),
          children: [/*#__PURE__*/_jsx(Plus, {
            className: "w-4 h-4"
          }), "Th\xEAm ghi ch\xFA b\xE0n giao"]
        }) : /*#__PURE__*/_jsxs("div", {
          className: "space-y-3 animate-fadeIn",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex gap-2",
            children: NOTE_TYPES.map(type => {
              const Icon = type.icon;
              return /*#__PURE__*/_jsxs("button", {
                onClick: () => setNewNote(prev => ({
                  ...prev,
                  type: type.id
                })),
                className: cn('flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-all text-sm', newNote.type === type.id ? `${type.color} border-current` : 'border-border hover:border-foreground-muted'),
                children: [/*#__PURE__*/_jsx(Icon, {
                  className: "w-4 h-4"
                }), type.label]
              }, type.id);
            })
          }), /*#__PURE__*/_jsx("textarea", {
            value: newNote.message,
            onChange: e => setNewNote(prev => ({
              ...prev,
              message: e.target.value
            })),
            placeholder: "Nh\u1EADp n\u1ED9i dung ghi ch\xFA...",
            className: "w-full h-24 bg-background-tertiary border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-2",
            children: [/*#__PURE__*/_jsx(Button, {
              variant: "ghost",
              className: "flex-1",
              onClick: () => setShowAddForm(false),
              children: "H\u1EE7y"
            }), /*#__PURE__*/_jsxs(Button, {
              className: "flex-1 gap-2",
              onClick: handleSubmit,
              disabled: !newNote.message.trim(),
              children: [/*#__PURE__*/_jsx(Send, {
                className: "w-4 h-4"
              }), "G\u1EEDi"]
            })]
          })]
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "max-h-80 overflow-auto divide-y divide-border",
        children: notes.length === 0 ? /*#__PURE__*/_jsxs("div", {
          className: "py-8 text-center text-foreground-secondary",
          children: [/*#__PURE__*/_jsx(ClipboardList, {
            className: "w-12 h-12 mx-auto mb-2 opacity-30"
          }), /*#__PURE__*/_jsx("p", {
            children: "Ch\u01B0a c\xF3 ghi ch\xFA b\xE0n giao"
          })]
        }) : notes.map(note => {
          const typeConfig = NOTE_TYPES.find(t => t.id === note.type) || NOTE_TYPES[1];
          const TypeIcon = typeConfig.icon;
          return /*#__PURE__*/_jsx("div", {
            className: cn('p-4 transition-colors', !note.acknowledged && note.type === 'urgent' && 'bg-red-500/5'),
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex items-start gap-3",
              children: [/*#__PURE__*/_jsx("div", {
                className: cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', typeConfig.color),
                children: /*#__PURE__*/_jsx(TypeIcon, {
                  className: "w-4 h-4"
                })
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex-1 min-w-0",
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-foreground",
                  children: note.message
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-3 mt-2 text-xs text-foreground-muted",
                  children: [/*#__PURE__*/_jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [/*#__PURE__*/_jsx(User, {
                      className: "w-3 h-3"
                    }), note.author]
                  }), /*#__PURE__*/_jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [/*#__PURE__*/_jsx(Clock, {
                      className: "w-3 h-3"
                    }), formatDate(note.createdAt), " ", formatTime(note.createdAt)]
                  })]
                }), note.acknowledged ? /*#__PURE__*/_jsxs("p", {
                  className: "mt-2 text-xs text-green-500 flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(CheckCircle, {
                    className: "w-3 h-3"
                  }), "\u0110\xE3 x\xE1c nh\u1EADn b\u1EDFi ", note.acknowledgedBy]
                }) : note.type === 'urgent' && note.author !== currentUser && /*#__PURE__*/_jsxs(Button, {
                  size: "sm",
                  variant: "outline",
                  className: "mt-2 h-7 text-xs",
                  onClick: () => onAcknowledge(note.id),
                  children: [/*#__PURE__*/_jsx(CheckCircle, {
                    className: "w-3 h-3 mr-1"
                  }), "X\xE1c nh\u1EADn \u0111\xE3 \u0111\u1ECDc"]
                })]
              })]
            })
          }, note.id);
        })
      })]
    })]
  });
}