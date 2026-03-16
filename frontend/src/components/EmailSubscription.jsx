import React, { useState } from 'react';
import { useToast } from './ui/ToastProvider';

const EmailSubscription = ({ className = '', compact = false }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    promotions: true,
    newsletters: true,
    productUpdates: true
  });
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.push({
        title: 'Lỗi',
        message: 'Vui lòng nhập email',
        type: 'error'
      });
      return;
    }

    try {
      setLoading(true);

      const response = await API.post('/api/email/subscribe', {
        email: email.trim(),
        name: name.trim() || undefined,
        preferences: d
      });

      const data = response.data || {};

      if (data.success) {
        toast.push({
          title: 'Thành công',
          message: data.message || 'Đăng ký email thành công!',
          type: 'success'
        });
        setEmail('');
        setName('');
      } else {
        toast.push({
          title: 'Lỗi',
          message: data.message || 'Có lỗi xảy ra',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể kết nối đến server',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  if (compact) {
    return (
      <div className={`bg-gray-50 p-6 rounded-lg ${className}`}>
        <h3 className="text-lg font-semibold mb-2">Đăng ký nhận tin</h3>
        <p className="text-gray-600 text-sm mb-4">
          Nhận thông tin khuyến mãi và sản phẩm mới
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-white p-8 rounded-lg shadow-lg ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Đăng ký nhận tin</h2>
        <p className="text-gray-600">
          Hãy đăng ký để nhận thông tin khuyến mãi, sản phẩm mới và xu hướng thời trang
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Họ tên (tùy chọn)"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        <div className="space-y-2">
          <p className="font-medium text-gray-700">Tôi muốn nhận:</p>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.promotions}
                onChange={() => handlePreferenceChange('promotions')}
                className="form-checkbox"
              />
              <span className="text-sm">Thông tin khuyến mãi</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.newsletters}
                onChange={() => handlePreferenceChange('newsletters')}
                className="form-checkbox"
              />
              <span className="text-sm">Bản tin hàng tuần</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.productUpdates}
                onChange={() => handlePreferenceChange('productUpdates')}
                className="form-checkbox"
              />
              <span className="text-sm">Cập nhật sản phẩm mới</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 font-semibold"
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký ngay'}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Chúng tôi cam kết bảo mật thông tin của bạn và không spam.
        Bạn có thể hủy đăng ký bất cứ lúc nào.
      </p>
    </div>
  );
};

export default EmailSubscription;