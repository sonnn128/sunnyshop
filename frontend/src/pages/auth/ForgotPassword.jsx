import React, { useState } from 'react';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email) { setMessage('Vui lòng nhập email.'); return; }
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8">
        <h2 className="text-xl font-semibold mb-4">Quên mật khẩu</h2>
        <p className="text-sm text-muted-foreground mb-4">Nhập email của bạn để nhận mã đặt lại mật khẩu.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <div className="text-sm text-red-500">{message}</div>}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" className="w-full px-4 py-3 border border-border rounded-md" placeholder="you@example.com" required />
          </div>
          <div>
            <button className="w-full px-4 py-3 bg-accent text-white rounded-md">{loading ? 'Đang gửi...' : 'Gửi mã'}</button>
          </div>
          <p className="text-sm text-muted-foreground">Đã có mã? <Link to="/reset-password" className="text-accent">Đặt lại mật khẩu</Link></p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
