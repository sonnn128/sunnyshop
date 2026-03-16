import React, { useState } from 'react';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  React.useEffect(() => {
    try {
      const e = sessionStorage.getItem('resetEmail');
      if (e) setEmail(e);
    } catch (err) {}
  }, []);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email || !code || !newPassword) { setMessage('Vui lòng điền đầy đủ thông tin.'); return; }
    if (newPassword !== confirm) { setMessage('Mật khẩu xác nhận không khớp.'); return; }
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8">
        <h2 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h2>
        <p className="text-sm text-muted-foreground mb-4">Nhập email, mã bạn nhận được và mật khẩu mới.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <div className="text-sm text-red-500">{message}</div>}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" className="w-full px-4 py-3 border border-border rounded-md" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Mã</label>
            <input value={code} onChange={e => setCode(e.target.value)} type="text" className="w-full px-4 py-3 border border-border rounded-md" placeholder="Nhập mã" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Mật khẩu mới</label>
            <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" autoComplete="new-password" className="w-full px-4 py-3 border border-border rounded-md" placeholder="Mật khẩu mới" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Xác nhận mật khẩu</label>
            <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" autoComplete="new-password" className="w-full px-4 py-3 border border-border rounded-md" placeholder="Nhập lại mật khẩu" required />
          </div>
          <div>
            <button className="w-full px-4 py-3 bg-accent text-white rounded-md">{loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
