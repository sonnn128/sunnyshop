
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';

const Login = () => {
  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem('rememberedUsername') || '';
    } catch (e) { return ''; }
  });
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = (values) => {
    const { username, password } = values;
    setFormError('');
    if (!username || !password) {
      setFormError('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }
    API.post('/auth/login', { username, password })
      .then(res => {
        // Backend returns ApiResponse, so we look for 'data' property
        const loginData = res.data?.data || res.data;
        const { user, token } = loginData;

        if (!token) {
          throw new Error('Token không tồn tại trong phản hồi.');
        }

        try {
          if (remember) {
            if (user) localStorage.setItem('user', JSON.stringify(user));
            if (token) localStorage.setItem('token', token);
            // Lưu username để đăng nhập tương lai
            try { localStorage.setItem('rememberedUsername', username); } catch (e) {}
          } else {
            if (user) sessionStorage.setItem('user', JSON.stringify(user));
            if (token) sessionStorage.setItem('token', token);
            // Loại bỏ rememberedUsername đã lưu khi người dùng chọn không
            try { localStorage.removeItem('rememberedUsername'); } catch (e) {}
            // Đảm bảo không có token/user cũ trong localStorage
            try { localStorage.removeItem('user'); localStorage.removeItem('token'); } catch (e) {}
          }
        } catch (e) {
          console.error('Lỗi lưu trữ thông tin đăng nhập:', e);
        }
        
        // Xác định chuyển hướng dựa trên vai trò người dùng
        // Role từ backend đã được normalize về lowercase trong User model
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mảng ảnh bên trái */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end p-20">
          <div className="text-white space-y-6 max-w-lg">
            <h2 className="text-4xl font-serif tracking-wide leading-tight">
              Thời trang là ngôn ngữ tự hào.
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] opacity-80 leading-relaxed font-bold">
              KẾT NỐI VỚI BỘ SƯU TẬP MỚI NHẤT SHOWROOM CAO CẤP TỪ SUNNY FASHION VÀ KHÁM PHÁ PHONG CÁCH CỦA RIÊNG BẠN.
            </p>
          </div>
        </div>
      </div>

      {/* Form bên phải */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-8 sm:px-12 xl:px-24">
        <div className="w-full max-w-[420px] mx-auto">
          <Link to="/homepage" className="flex mb-12 group">
            <span className="font-serif text-3xl tracking-widest text-slate-900 uppercase group-hover:opacity-70 transition-opacity">
              Sunny<span className="font-light">Fashion</span>
            </span>
          </Link>

          <div className="mb-10">
            <h3 className="text-[22px] font-serif text-slate-900 tracking-wide mb-2">ĐĂNG NHẬP</h3>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">CHÀO MỪNG QUAY LẠI THẾ GIỚI CỦA SUNNY</p>
          </div>
          <Form 
            onFinish={handleLogin} 
            layout="vertical" 
            className="space-y-8"
            initialValues={{ username, remember }}
            requiredMark={false}
          >
            {formError && (
              <div className="p-3 bg-red-50/50 text-red-600 text-[11px] uppercase tracking-wider text-center font-bold">
                {formError}
              </div>
            )}

            <Form.Item 
              name="username" 
              label={<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Tên đăng nhập / Email</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập hoặc email!' }
              ]}
              className="mb-6"
            >
              <Input
                placeholder="NHẬP TÊN ĐĂNG NHẬP HOẶC EMAIL"
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-slate-200 py-3 px-0 text-[11px] font-bold tracking-widest text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-colors rounded-none"
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              label={<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Mật khẩu</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' }
              ]}
              className="mb-8"
            >
              <Input.Password 
                placeholder="NHẬP MẬT KHẨU" 
                autoComplete="current-password"
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-slate-200 py-3 px-0 text-[11px] font-bold tracking-widest text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-colors rounded-none [&>input]:bg-transparent"
              />
            </Form.Item>

            <div className="flex items-center justify-between mt-2 mb-8">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-3.5 h-3.5 border-slate-300 text-slate-900 focus:ring-slate-900 rounded-sm" 
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 group-hover:text-slate-900 transition-colors">GHI NHỚ ĐĂNG NHẬP</span>
                </label>
              </Form.Item>
              <Link to="/forgot-password" className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-slate-900 transition-colors">QUÊN MẬT KHẨU?</Link>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full bg-slate-900 text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors flex justify-center items-center">
                ĐĂNG NHẬP
              </button>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[10px] font-bold tracking-widest uppercase text-slate-400">
                    Chưa có tài khoản?
                  </span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link to="/register" className="inline-block relative text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-slate-500 transition-colors group">
                  TẠO TÀI KHOẢN MỚI
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-slate-900 transition-all duration-300 group-hover:bg-slate-500" />
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
