import React, { useState, useEffect } from 'react';
import API from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    try {
      const e = sessionStorage.getItem('resetEmail');
      if (e) {
        setInitialEmail(e);
        form.setFieldsValue({ email: e });
      }
    } catch (err) { }
  }, [form]);

  const handleFinish = async (values) => {
    const { email, code, newPassword, confirm } = values;
    setMessage('');
    if (newPassword !== confirm) {
      setMessage('Mật khẩu xác nhận không khớp.');
      return;
    }
    setLoading(true);
    try {
      await API.post('/api/auth/reset-password', { email, code, newPassword });
      toast.push({ title: 'Thành công', message: 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập.', type: 'success' });
      navigate('/login');
    } catch (err) {
      console.error('Reset password error', err);
      const status = err?.response?.status;
      if (status === 400) setMessage(err?.response?.data?.message || 'Mã không hợp lệ hoặc đã hết hạn.');
      else setMessage('Không thể đặt lại mật khẩu. Vui lòng thử lại sau.');
    } finally { setLoading(false); }
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
              Bảo mật tuyệt đối.
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] opacity-80 leading-relaxed font-bold">
              TẠO MẬT KHẨU MỚI ĐỂ TIẾP TỤC TRẢI NGHIỆM MUA SẮM AN TOÀN VÀ ĐẲNG CẤP CÙNG SUNNY FASHION.
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
            <h3 className="text-[22px] font-serif text-slate-900 tracking-wide mb-2">ĐẶT LẠI MẬT KHẨU</h3>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold max-w-[280px] leading-relaxed">
              NHẬP MÃ XÁC NHẬN VÀ TẠO MẬT KHẨU MỚI
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[400px]">
            <div className="bg-white py-8 px-4 sm:px-0">
              <Form form={form} onFinish={handleFinish} layout="vertical" className="space-y-8" requiredMark={false}>
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
                  className="mb-6"
                >
                  <Input
                    placeholder="NHẬP EMAIL CỦA BẠN"
                    autoComplete="email"
                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-slate-200 py-3 px-2 text-[11px] font-bold tracking-widest text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-colors rounded-none"
                  />
                </Form.Item>

                <Form.Item
                  name="code"
                  label={<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Mã xác minh</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}
                  className="mb-6"
                >
                  <Input
                    placeholder="NHẬP MÃ XÁC MINH CỦA BẠN"
                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-slate-200 py-3 px-2 text-[11px] font-bold tracking-[0.3em] text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-colors rounded-none"
                  />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label={<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Mật khẩu mới</span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
                  ]}
                  className="mb-6"
                >
                  <Input.Password
                    placeholder="NHẬP MẬT KHẨU MỚI"
                    autoComplete="new-password"
                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-slate-200 py-3 px-2 text-[11px] font-bold tracking-widest text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-colors rounded-none [&>input]:bg-transparent"
                  />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label={<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Xác nhận mật khẩu</span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập lại mật khẩu!' }
                  ]}
                  className="mb-8"
                >
                  <Input.Password
                    placeholder="NHẬP LẠI MẬT KHẨU"
                    autoComplete="new-password"
                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-slate-200 py-3 px-2 text-[11px] font-bold tracking-widest text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-colors rounded-none [&>input]:bg-transparent"
                  />
                </Form.Item>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors flex justify-center items-center disabled:opacity-50"
                  >
                    {loading ? 'ĐANG XỬ LÝ...' : 'LƯU MẬT KHẨU MỚI'}
                  </button>
                </div>

                <div className="mt-10 flex flex-col items-center">
                  <Link to="/login" className="inline-block relative text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-slate-500 transition-colors group">
                    QUAY LẠI ĐĂNG NHẬP
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-slate-900 transition-all duration-300 group-hover:bg-slate-500" />
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

