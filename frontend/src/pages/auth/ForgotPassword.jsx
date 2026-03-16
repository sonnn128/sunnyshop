import React, { useState } from 'react';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    const { email } = values;
    setMessage('');
    setLoading(true);
    try {
      const res = await API.post('/api/auth/forgot-password', { email });
      const data = res?.data || {};
      // show friendly toast
      toast.push({ title: 'Yêu cầu đã gửi', message: data.message || 'Nếu email tồn tại, mã đã được gửi.', type: 'success' });
      // save the email to sessionStorage so ResetPassword can prefill the email field
      try { sessionStorage.setItem('resetEmail', email); } catch (e) {}
      navigate('/reset-password');
    } catch (err) {
      console.error('Forgot password error', err);
      const serverMsg = err?.response?.data?.message;
      setMessage(serverMsg || 'Không thể gửi mã. Vui lòng thử lại sau.');
    } finally { setLoading(false); }
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
              An tâm mua sắm.
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] opacity-80 leading-relaxed font-bold">
              ĐỪNG LO LẮNG NẾU BẠN QUÊN MẬT KHẨU. SUNNY FASHION SẼ GIÚP BẠN KHÔI PHỤC QUYỀN TRUY CẬP NHANH CHÓNG.
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
            <h3 className="text-[22px] font-serif text-slate-900 tracking-wide mb-2">QUÊN MẬT KHẨU</h3>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold max-w-[280px] leading-relaxed">
              NHẬP EMAIL CỦA BẠN ĐỂ NHẬN MÃ ĐẶT LẠI MẬT KHẨU
            </p>
          </div>

          <Form onFinish={handleFinish} layout="vertical" className="space-y-8" requiredMark={false}>
            {message && (
              <div className="p-3 bg-red-50/50 text-red-600 text-[11px] uppercase tracking-wider text-center font-bold">
                {message}
              </div>
            )}
            
            <Form.Item
              name="email"
              label={<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Email</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
              className="mb-8"
            >
              <Input 
                placeholder="NHẬP EMAIL CỦA BẠN" 
                autoComplete="email" 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-slate-200 py-3 px-2 text-[11px] font-bold tracking-widest text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-colors rounded-none"
              />
            </Form.Item>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors flex justify-center items-center disabled:opacity-50"
              >
                {loading ? 'ĐANG GỬI...' : 'GỬI MÃ XÁC NHẬN'}
              </button>
            </div>

            <div className="mt-10 flex flex-col items-center space-y-4">
              <Link to="/login" className="inline-block relative text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-slate-500 transition-colors group">
                QUAY LẠI ĐĂNG NHẬP
                <span className="absolute -bottom-1 left-0 w-full h-px bg-slate-900 transition-all duration-300 group-hover:bg-slate-500" />
              </Link>

              <Link to="/reset-password" className="inline-block relative text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group">
                ĐÃ CÓ MÃ XÁC NHẬN? ĐẶT LẠI NGAY
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-900 transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

