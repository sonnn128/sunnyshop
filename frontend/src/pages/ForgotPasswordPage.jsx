import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async e => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: 'Vui lòng nhập email',
        variant: 'error'
      });
      return;
    }
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, this would call:
      // await authApi.requestPasswordReset(email);

      setStep('sent');
      toast({
        title: 'Đã gửi email khôi phục mật khẩu'
      });
    } catch {
      setStep('error');
      toast({
        title: 'Không thể gửi email',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /*#__PURE__*/_jsx("div", {
    className: "min-h-screen bg-background flex items-center justify-center p-4",
    children: /*#__PURE__*/_jsxs("div", {
      className: "w-full max-w-md",
      children: [/*#__PURE__*/_jsxs(Link, {
        to: "/login",
        className: "inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-8 transition-colors",
        children: [/*#__PURE__*/_jsx(ArrowLeft, {
          className: "w-4 h-4"
        }), "Quay l\u1EA1i \u0111\u0103ng nh\u1EADp"]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-background-secondary border border-border rounded-2xl p-8 shadow-xl animate-fadeIn",
        children: [step === 'email' && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsxs("div", {
            className: "text-center mb-8",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4",
              children: /*#__PURE__*/_jsx(Mail, {
                className: "w-8 h-8 text-primary-500"
              })
            }), /*#__PURE__*/_jsx("h1", {
              className: "text-2xl font-bold text-foreground mb-2",
              children: "Qu\xEAn m\u1EADt kh\u1EA9u?"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-foreground-secondary",
              children: "Nh\u1EADp email \u0111\u0103ng k\xFD \u0111\u1EC3 nh\u1EADn link kh\xF4i ph\u1EE5c m\u1EADt kh\u1EA9u"
            })]
          }), /*#__PURE__*/_jsxs("form", {
            onSubmit: handleSubmit,
            className: "space-y-4",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium text-foreground-secondary mb-2",
                children: "Email"
              }), /*#__PURE__*/_jsx(Input, {
                type: "email",
                value: email,
                onChange: e => setEmail(e.target.value),
                placeholder: "name@example.com",
                className: "w-full",
                disabled: isLoading
              })]
            }), /*#__PURE__*/_jsx(Button, {
              type: "submit",
              className: "w-full",
              disabled: isLoading,
              children: isLoading ? /*#__PURE__*/_jsxs("span", {
                className: "flex items-center gap-2",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                }), "\u0110ang g\u1EEDi..."]
              }) : 'Gửi link khôi phục'
            })]
          })]
        }), step === 'sent' && /*#__PURE__*/_jsxs("div", {
          className: "text-center animate-scaleIn",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4",
            children: /*#__PURE__*/_jsx(CheckCircle, {
              className: "w-8 h-8 text-green-500"
            })
          }), /*#__PURE__*/_jsx("h2", {
            className: "text-2xl font-bold text-foreground mb-2",
            children: "Ki\u1EC3m tra email c\u1EE7a b\u1EA1n"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-foreground-secondary mb-6",
            children: ["Ch\xFAng t\xF4i \u0111\xE3 g\u1EEDi link kh\xF4i ph\u1EE5c m\u1EADt kh\u1EA9u \u0111\u1EBFn ", /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("span", {
              className: "font-medium text-foreground",
              children: email
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-3",
            children: [/*#__PURE__*/_jsx(Button, {
              variant: "outline",
              className: "w-full",
              onClick: () => {
                setStep('email');
                setEmail('');
              },
              children: "G\u1EEDi l\u1EA1i email"
            }), /*#__PURE__*/_jsx(Link, {
              to: "/login",
              children: /*#__PURE__*/_jsx(Button, {
                variant: "ghost",
                className: "w-full",
                children: "Quay l\u1EA1i \u0111\u0103ng nh\u1EADp"
              })
            })]
          })]
        }), step === 'error' && /*#__PURE__*/_jsxs("div", {
          className: "text-center animate-scaleIn",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4",
            children: /*#__PURE__*/_jsx(AlertCircle, {
              className: "w-8 h-8 text-red-500"
            })
          }), /*#__PURE__*/_jsx("h2", {
            className: "text-2xl font-bold text-foreground mb-2",
            children: "C\xF3 l\u1ED7i x\u1EA3y ra"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-foreground-secondary mb-6",
            children: "Kh\xF4ng th\u1EC3 g\u1EEDi email kh\xF4i ph\u1EE5c. Vui l\xF2ng th\u1EED l\u1EA1i sau ho\u1EB7c li\xEAn h\u1EC7 qu\u1EA3n tr\u1ECB vi\xEAn."
          }), /*#__PURE__*/_jsx(Button, {
            className: "w-full",
            onClick: () => setStep('email'),
            children: "Th\u1EED l\u1EA1i"
          })]
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "text-center text-foreground-muted text-sm mt-6",
        children: "C\u1EA7n h\u1ED7 tr\u1EE3? Li\xEAn h\u1EC7 qu\u1EA3n tr\u1ECB vi\xEAn c\u1EE7a b\u1EA1n"
      })]
    })
  });
}