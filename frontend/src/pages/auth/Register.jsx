
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = (e) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password) {
      setFormError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp.');
      return;
    }
    API.post('/api/auth/register', { email, password })
      .then(res => {
        const { user, token } = res.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        // show success then redirect
        setFormError('');
        toast.push({ title: 'Đăng ký thành công', message: 'Chào mừng! Đang chuyển hướng...', type: 'success' });
        setTimeout(() => navigate('/user-dashboard'), 1000);
      })
    .catch(err => {
      console.error('Register error:', err);
      const status = err?.response?.status;
      if (status === 409) {
        setFormError('Email này đã được sử dụng. Vui lòng dùng email khác hoặc đăng nhập.');
      } else if (status === 400 || status === 422) {
        setFormError(err?.response?.data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        setFormError('Đăng ký thất bại. Vui lòng thử lại sau.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col items-start justify-center p-8 bg-gradient-to-br from-primary to-accent text-white">
          <h3 className="text-2xl font-bold mb-2">Tham gia ABC Fashion</h3>
          <p className="mb-6 text-sm opacity-90">Tạo tài khoản để nhận ưu đãi độc quyền và theo dõi đơn hàng của bạn.</p>
          <ul className="space-y-2 text-sm">
            <li>• Ưu đãi thành viên</li>
            <li>• Quản lý đơn hàng nhanh chóng</li>
            <li>• Lưu sản phẩm yêu thích</li>
          </ul>
        </div>

        <div className="p-8">
          <div className="max-w-md mx-auto">
            <div className="mb-6 text-center">
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary to-accent mx-auto mb-3 flex items-center justify-center text-white font-bold">AF</div>
              <h2 className="text-2xl font-semibold">Tạo tài khoản mới</h2>
              <p className="text-sm text-muted-foreground mt-1">Chỉ mất vài bước để bắt đầu mua sắm</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
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
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Ít nhất 8 ký tự"
                  type="password"
                  className="block w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <div className="text-xs text-muted-foreground mt-1">Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ và số.</div>
              </div>

              <div>
                <label className="block text-sm mb-1">Xác nhận mật khẩu</label>
                <input
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                  className="block w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <button className="w-full px-4 py-3 bg-accent text-white rounded-md font-medium hover:opacity-95">Tạo tài khoản</button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <div className="text-xs text-muted-foreground">Hoặc đăng ký với</div>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md text-sm">Google</button>
                <button type="button" className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md text-sm">Facebook</button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">Bạn đã có tài khoản? <Link to="/login" className="text-accent">Đăng nhập</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
