import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, User as UserOutlined } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập hoặc email'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    login
  } = useAuthStore();
  const {
    toast
  } = useToast();
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const onSubmit = async data => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        login(response.data.user, response.data.accessToken, response.data.refreshToken);
        toast({
          title: 'Đăng nhập thành công',
          description: `Chào mừng ${response.data.user.name}!`,
          variant: 'success'
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Đăng nhập thất bại',
        description: error.response?.data?.message || 'Đã xảy ra lỗi',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen flex",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between relative overflow-hidden",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "absolute inset-0 opacity-10",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute top-20 left-20 w-64 h-64 border border-white rounded-full"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute bottom-40 right-20 w-96 h-96 border border-white rounded-full"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute top-1/2 left-1/3 w-48 h-48 border border-white rounded-full"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3 relative z-10",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur",
          children: /*#__PURE__*/_jsx("span", {
            className: "text-white font-bold text-xl",
            children: "C"
          })
        }), /*#__PURE__*/_jsx("span", {
          className: "text-2xl font-bold text-white",
          children: "Courtify"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative z-10",
        children: [/*#__PURE__*/_jsxs("h1", {
          className: "text-4xl font-bold text-white mb-4",
          children: ["Qu\u1EA3n l\xFD s\xE2n c\u1EA7u l\xF4ng", /*#__PURE__*/_jsx("br", {}), "chuy\xEAn nghi\u1EC7p"]
        }), /*#__PURE__*/_jsx("p", {
          className: "text-white/80 text-lg max-w-md",
          children: "H\u1EC7 th\u1ED1ng to\xE0n di\u1EC7n cho vi\u1EC7c qu\u1EA3n l\xFD \u0111\u1EB7t s\xE2n, kh\xE1ch h\xE0ng, thanh to\xE1n v\xE0 b\xE1o c\xE1o doanh thu."
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex gap-12 relative z-10",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-3xl font-bold text-white",
            children: "500+"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-white/70",
            children: "Kh\xE1ch h\xE0ng"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-3xl font-bold text-white",
            children: "50+"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-white/70",
            children: "S\xE2n ho\u1EA1t \u0111\u1ED9ng"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-3xl font-bold text-white",
            children: "10K+"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-white/70",
            children: "L\u01B0\u1EE3t \u0111\u1EB7t s\xE2n"
          })]
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-background",
      children: /*#__PURE__*/_jsxs("div", {
        className: "w-full max-w-md",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "lg:hidden flex items-center gap-3 mb-8 justify-center",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center",
            children: /*#__PURE__*/_jsx("span", {
              className: "text-white font-bold text-xl",
              children: "C"
            })
          }), /*#__PURE__*/_jsx("span", {
            className: "text-2xl font-bold text-primary-500",
            children: "Courtify"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "mb-8",
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-2xl font-bold text-foreground",
            children: "\u0110\u0103ng nh\u1EADp"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-foreground-secondary mt-2",
            children: "Nh\u1EADp th\xF4ng tin t\xE0i kho\u1EA3n \u0111\u1EC3 truy c\u1EADp h\u1EC7 th\u1ED1ng"
          })]
        }), /*#__PURE__*/_jsxs("form", {
          onSubmit: handleSubmit(onSubmit),
          className: "space-y-5",
          children: [/*#__PURE__*/_jsx(Input, {
            label: "Tên đăng nhập / Email",
            type: "text",
            placeholder: "admin@courtify.vn",
            icon: /*#__PURE__*/_jsx(UserOutlined, {
              className: "w-4 h-4"
            }),
            error: errors.username?.message,
            ...register('username')
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative",
            children: [/*#__PURE__*/_jsx(Input, {
              label: "M\u1EADt kh\u1EA9u",
              type: showPassword ? 'text' : 'password',
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
              icon: /*#__PURE__*/_jsx(Lock, {
                className: "w-4 h-4"
              }),
              error: errors.password?.message,
              ...register('password')
            }), /*#__PURE__*/_jsx("button", {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-[38px] text-foreground-muted hover:text-foreground transition-colors",
              children: showPassword ? /*#__PURE__*/_jsx(EyeOff, {
                className: "w-4 h-4"
              }) : /*#__PURE__*/_jsx(Eye, {
                className: "w-4 h-4"
              })
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between",
            children: [/*#__PURE__*/_jsxs("label", {
              className: "flex items-center gap-2 cursor-pointer",
              children: [/*#__PURE__*/_jsx("input", {
                type: "checkbox",
                className: "w-4 h-4 rounded border-border bg-background-secondary text-primary-500 focus:ring-primary-500"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-sm text-foreground-secondary",
                children: "Ghi nh\u1EDB \u0111\u0103ng nh\u1EADp"
              })]
            }), /*#__PURE__*/_jsx(Link, {
              to: "/forgot-password",
              className: "text-sm text-primary-500 hover:underline",
              children: "Qu\xEAn m\u1EADt kh\u1EA9u?"
            })]
          }), /*#__PURE__*/_jsx(Button, {
            type: "submit",
            className: "w-full",
            size: "lg",
            isLoading: isLoading,
            children: "\u0110\u0103ng nh\u1EADp"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "mt-8 p-4 bg-background-secondary rounded-lg border border-border",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-xs text-foreground-muted mb-2",
            children: "T\xE0i kho\u1EA3n demo:"
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-1 text-xs text-foreground-secondary",
            children: [/*#__PURE__*/_jsxs("p", {
              children: [/*#__PURE__*/_jsx("strong", {
                children: "Admin:"
              }), " admin@courtify.vn / admin123"]
            }), /*#__PURE__*/_jsxs("p", {
              children: [/*#__PURE__*/_jsx("strong", {
                children: "Manager:"
              }), " manager@courtify.vn / manager123"]
            }), /*#__PURE__*/_jsxs("p", {
              children: [/*#__PURE__*/_jsx("strong", {
                children: "Staff:"
              }), " staff@courtify.vn / staff123"]
            })]
          })]
        })]
      })
    })]
  });
}