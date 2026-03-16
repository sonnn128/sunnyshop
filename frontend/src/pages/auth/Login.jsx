
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';

const Login = () => {
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('rememberedEmail') || '';
    } catch (e) { return ''; }
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password) {
      setFormError('Vui lòng nhập email và mật khẩu.');
      return;
    }
    API.post('/api/auth/login', { email, password })
      .then(res => {
        const { user, token } = res.data;
        try {
          if (remember) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            // Lưu email để đăng nhập tương lai
            try { localStorage.setItem('rememberedEmail', email); } catch (e) {}
          } else {
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('token', token);
            // Loại bỏ rememberedEmail đã lưu khi người dùng chọn không
            try { localStorage.removeItem('rememberedEmail'); } catch (e) {}
            // Đảm bảo không có token/user cũ trong localStorage
            try { localStorage.removeItem('user'); localStorage.removeItem('token'); } catch (e) {}
          }
        } catch (e) {}
        
        // Xác định chuyển hướng dựa trên vai trò người dùng
        const userRole = user?.role || 'customer';
        const isAdminUser = ['staff', 'manager', 'admin'].includes(userRole);
        const redirectPath = isAdminUser ? '/admin-panel' : '/user-dashboard';
        
        // Debug: Log thông tin người dùng
        console.log('🔍 Login Debug:', {
          user,
          userRole,
          isAdminUser,
          redirectPath
        });
        
        // Hiển thị thành công rồi chuyển hướng
        setFormError('');
        toast.push({ 
          title: 'Đăng nhập thành công', 
          message: isAdminUser ? 'Chào mừng đến trang quản trị!' : 'Đang chuyển hướng...', 
          type: 'success' 
        });
        setTimeout(() => navigate(redirectPath), 800);
      })
      .catch(err => {
        console.error('Lỗi đăng nhập:', err);
        const status = err?.response?.status;
        if (status === 401) {
          setFormError('Tài khoản hoặc mật khẩu không chính xác.');
        } else if (status === 400 || status === 422) {
          // expose server validation message when available, otherwise show a friendly Vietnamese hint
          setFormError(err?.response?.data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        } else {
          setFormError('Đăng nhập thất bại. Vui lòng thử lại.');
        }
      });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left graphic / promo */}
        <div className="hidden lg:flex flex-col items-start justify-center p-8 bg-gradient-to-br from-primary to-accent text-white">
          <h3 className="text-2xl font-bold mb-2">Chào mừng đến với ABC Fashion</h3>
          <p className="mb-6 text-sm opacity-90">Đăng nhập để xem đơn hàng, lưu sản phẩm yêu thích và thanh toán nhanh hơn.</p>
          <ul className="space-y-2 text-sm">
            <li>• Quản lý đơn hàng nhanh chóng</li>
            <li>• Lưu sản phẩm yêu thích</li>
            <li>• Ưu đãi dành riêng cho thành viên</li>
          </ul>
        </div>

        {/* Right: form */}
        <div className="p-8">
          <div className="max-w-md mx-auto">
            <div className="mb-6 text-center">
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary to-accent mx-auto mb-3 flex items-center justify-center text-white font-bold">AF</div>
              <h2 className="text-2xl font-semibold">Đăng nhập</h2>
              <p className="text-sm text-muted-foreground mt-1">Đăng nhập bằng email của bạn để tiếp tục</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                {formError && <div className="text-sm text-red-500">{formError}</div>}

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  className="block w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Mật khẩu</label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="block w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                  >
                    {showPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="form-checkbox" />
                  <span className="text-sm">Ghi nhớ tôi</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-accent">Quên mật khẩu?</Link>
              </div>

              <div>
                <button className="w-full px-4 py-3 bg-accent text-white rounded-md font-medium hover:opacity-95">Đăng nhập</button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <div className="text-xs text-muted-foreground">Hoặc tiếp tục với</div>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.23c0-.77-.07-1.51-.2-2.23H12v4.22h5.48c-.24 1.3-.98 2.4-2.1 3.14v2.62h3.4c1.99-1.83 3.13-4.53 3.13-7.75z" fill="#4285F4"/><path d="M12 22c2.7 0 4.96-.9 6.62-2.45l-3.4-2.62c-.94.63-2.14.99-3.22.99-2.48 0-4.58-1.67-5.33-3.93H3.05v2.47C4.7 19.9 8.05 22 12 22z" fill="#34A853"/><path d="M6.67 13.99A6.99 6.99 0 016 12c0-.66.1-1.3.28-1.9V7.63H3.05A9.99 9.99 0 002 12c0 1.6.36 3.1 1.05 4.44l3.62-2.45z" fill="#FBBC05"/><path d="M12 6.48c1.47 0 2.79.5 3.83 1.48l2.86-2.86C16.95 3.46 14.7 2.5 12 2.5 8.05 2.5 4.7 4.6 3.05 7.63l3.62 2.47C7.42 8.15 9.52 6.48 12 6.48z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12a10 10 0 10-11.6 9.87v-6.99H7.9v-2.88h2.5V9.41c0-2.47 1.46-3.83 3.7-3.83 1.07 0 2.19.19 2.19.19v2.41h-1.23c-1.21 0-1.59.76-1.59 1.54v1.83h2.72l-.44 2.88h-2.28v6.99A10 10 0 0022 12z" fill="#1877F2"/></svg>
                  Facebook
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">Bạn chưa có tài khoản? <Link to="/register" className="text-accent">Tạo tài khoản</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
