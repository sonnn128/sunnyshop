
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input } from 'antd';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = (values) => {
    const { email, password, confirmPassword } = values;
    setFormError('');
    if (password !== confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setLoading(true);
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
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mảng ảnh bên trái */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end p-20">
          <div className="text-white space-y-6 max-w-lg">
            <h2 className="text-4xl font-serif tracking-wide leading-tight">
              Bắt đầu hành trình thời trang của bạn.
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] opacity-80 leading-relaxed font-bold">
              ĐĂNG KÝ TÀI KHOẢN ĐỂ NHẬN NHỮNG ĐẶC QUYỀN RIÊNG VÀ TRẢI NGHIỆM MUA SẮM TUYỆT VỜI CÙNG SUNNY FASHION.
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
            <h3 className="text-[22px] font-serif text-slate-900 tracking-wide mb-2">ĐĂNG KÝ</h3>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">TẠO TÀI KHOẢN MỚI CỦA BẠN</p>
          </div>
          <Form 
            onFinish={handleRegister} 
            layout="vertical" 
            className="space-y-8"
            requiredMark={false}
          >
            {formError && (
              <div className="p-3 bg-red-50/50 text-red-600 text-[11px] uppercase tracking-wider text-center font-bold">
                {formError}
              </div>
            )}

            <Form.Item 
              name="email" 
              label={<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Email</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
              className="mb-6"
            >
              <Input
                placeholder="NHẬP EMAIL CỦA BẠN"
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-slate-200 py-3 px-0 text-[11px] font-bold tracking-widest text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-colors rounded-none"
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              label={<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Mật khẩu</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
              ]}
              className="mb-6"
              extra={<p className="text-[10px] uppercase tracking-widest text-slate-400 mt-2">* Tối thiểu 8 ký tự, bao gồm chữ và số</p>}
            >
              <Input.Password 
                placeholder="NHẬP MẬT KHẨU"
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-slate-200 py-3 px-0 text-[11px] font-bold tracking-widest text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-colors rounded-none [&>input]:bg-transparent"
              />
            </Form.Item>

            <Form.Item 
              name="confirmPassword" 
              label={<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Xác nhận mật khẩu</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập lại mật khẩu!' }
              ]}
              className="mb-8"
            >
              <Input.Password 
                placeholder="NHẬP LẠI MẬT KHẨU"
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-slate-200 py-3 px-0 text-[11px] font-bold tracking-widest text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-colors rounded-none [&>input]:bg-transparent"
              />
            </Form.Item>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors flex justify-center items-center disabled:opacity-50"
              >
                {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ'}
              </button>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[10px] font-bold tracking-widest uppercase text-slate-400">
                    Đã có tài khoản?
                  </span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link to="/login" className="inline-block relative text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-slate-500 transition-colors group">
                  ĐĂNG NHẬP NGAY
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

export default Register;
