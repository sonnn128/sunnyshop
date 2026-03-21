import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import API from '../../../lib/api';
import Modal from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/ToastProvider';
import { useNavigate } from 'react-router-dom';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [settings, setSettings] = useState({
    notifications: {
      orderUpdates: true,
      promotions: true,
      newArrivals: false,
      priceAlerts: true,
      newsletter: true
    },
    privacy: {
      profileVisibility: 'private',
      showPurchaseHistory: false,
      allowRecommendations: true,
      dataCollection: true
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: '30'
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'security', label: 'Bảo mật', icon: 'Shield' },
    { id: 'notifications', label: 'Thông báo', icon: 'Bell' },
    { id: 'privacy', label: 'Quyền riêng tư', icon: 'Lock' }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [setting]: value
      }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    // clear previous form-level error when user edits password fields
    try { setFormError && setFormError(''); } catch (e) {}
  };

  const handlePasswordSubmit = () => {
    setFormError('');
    if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp');
      return;
    }
    // open confirmation modal
    setConfirmModalOpen(true);
  };

  const handleEnable2FA = () => {
    // Mock 2FA setup
    handleSettingChange('security', 'twoFactorEnabled', !settings?.security?.twoFactorEnabled);
  };

  const [saving, setSaving] = React.useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // send only settings object
      const res = await API.put('/api/auth/me', { settings });
  setFormError('');
  toast.push({ title: 'Thành công', message: 'Cài đặt đã được lưu', type: 'success' });
    } catch (err) {
  console.error('Save settings error:', err?.response?.data?.message || err?.message || err);
  setFormError('Lưu cài đặt thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const confirmChangePassword = async () => {
    setConfirmModalOpen(false);
    // client-side validations before calling API (also double-check here in case modal confirmed old state)
    if (!passwordForm?.currentPassword || !passwordForm?.newPassword || !passwordForm?.confirmPassword) {
      setFormError('Vui lòng điền đầy đủ thông tin mật khẩu.');
      return;
    }
    if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (passwordForm?.newPassword === passwordForm?.currentPassword) {
      setFormError('Mật khẩu mới không được giống mật khẩu hiện tại.');
      return;
    }

    try {
      const res = await API.post('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setFormError('');
      toast.push({ title: 'Thành công', message: 'Đổi mật khẩu thành công', type: 'success' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // auto logout after password change
      try {
        await API.post('/api/auth/logout');
      } catch (e) {}
      try { localStorage.removeItem('user'); localStorage.removeItem('token'); } catch (e) {}
      navigate('/login');
    } catch (err) {
      console.error('Change password error:', err?.response?.data?.message || err?.message || err);
      const status = err?.response?.status;
      if (status === 401) {
        setFormError('Mật khẩu hiện tại không đúng.');
      } else if (status === 400 || status === 422) {
        setFormError(err?.response?.data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        setFormError('Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <>
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Cài đặt tài khoản</h2>
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-border">
        {tabs?.map((tab) => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab?.id)}
            className="rounded-b-none"
          >
            <Icon name={tab?.icon} size={16} className="mr-2" />
            {tab?.label}
          </Button>
        ))}
      </div>
      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-4 flex items-center">
              <Icon name="Key" size={16} className="mr-2" />
              Đổi mật khẩu
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Mật khẩu hiện tại"
                  type="password"
                  value={passwordForm?.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              
              <Input
                label="Mật khẩu mới"
                type="password"
                value={passwordForm?.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                placeholder="Nhập mật khẩu mới"
              />
              
              <Input
                label="Xác nhận mật khẩu mới"
                type="password"
                value={passwordForm?.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            {/* inline form error for password flows */}
            {formError && <div className="text-sm text-red-500 mt-2">{formError}</div>}
            
            <Button
              variant="default"
              size="sm"
              iconName="Check"
              iconPosition="left"
                onClick={handlePasswordSubmit}
              className="mt-4"
            >
              Cập nhật mật khẩu
            </Button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-foreground flex items-center">
                  <Icon name="Smartphone" size={16} className="mr-2" />
                  Xác thực hai yếu tố (2FA)
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Tăng cường bảo mật tài khoản với xác thực hai yếu tố
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${settings?.security?.twoFactorEnabled ? 'text-success' : 'text-muted-foreground'}`}>
                  {settings?.security?.twoFactorEnabled ? 'Đã bật' : 'Đã tắt'}
                </span>
                <Button
                  variant={settings?.security?.twoFactorEnabled ? 'destructive' : 'default'}
                  size="sm"
                  onClick={handleEnable2FA}
                >
                  {settings?.security?.twoFactorEnabled ? 'Tắt 2FA' : 'Bật 2FA'}
                </Button>
              </div>
            </div>
          </div>

          {/* Login Alerts */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground flex items-center">
                  <Icon name="AlertTriangle" size={16} className="mr-2" />
                  Cảnh báo đăng nhập
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Nhận thông báo khi có đăng nhập từ thiết bị mới
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.security?.loginAlerts}
                  onChange={(e) => handleSettingChange('security', 'loginAlerts', e?.target?.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>

          {/* Session Timeout */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-4 flex items-center">
              <Icon name="Clock" size={16} className="mr-2" />
              Thời gian chờ phiên làm việc
            </h3>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Tự động đăng xuất sau:</span>
              <select
                value={settings?.security?.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', e?.target?.value)}
                className="px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="15">15 phút</option>
                <option value="30">30 phút</option>
                <option value="60">1 giờ</option>
                <option value="120">2 giờ</option>
                <option value="never">Không bao giờ</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="default" size="sm" onClick={handleSaveSettings} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </Button>
          </div>
        </div>
      )}
      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {[
            { key: 'orderUpdates', label: 'Cập nhật đơn hàng', desc: 'Thông báo về trạng thái đơn hàng và giao hàng' },
            { key: 'promotions', label: 'Khuyến mãi', desc: 'Thông báo về các chương trình khuyến mãi và giảm giá' },
            { key: 'newArrivals', label: 'Sản phẩm mới', desc: 'Thông báo khi có sản phẩm mới phù hợp với sở thích' },
            { key: 'priceAlerts', label: 'Cảnh báo giá', desc: 'Thông báo khi sản phẩm yêu thích có thay đổi giá' },
            { key: 'newsletter', label: 'Bản tin', desc: 'Nhận bản tin hàng tuần về xu hướng thời trang' }
          ]?.map((item) => (
            <div key={item?.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h3 className="font-medium text-foreground">{item?.label}</h3>
                <p className="text-sm text-muted-foreground">{item?.desc}</p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.notifications?.[item?.key]}
                  onChange={(e) => handleSettingChange('notifications', item?.key, e?.target?.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          ))}
        </div>
      )}
      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-4 flex items-center">
              <Icon name="Eye" size={16} className="mr-2" />
              Hiển thị hồ sơ
            </h3>
            
            <div className="space-y-2">
              {[
                { value: 'public', label: 'Công khai', desc: 'Mọi người có thể xem hồ sơ của bạn' },
                { value: 'private', label: 'Riêng tư', desc: 'Chỉ bạn có thể xem hồ sơ' }
              ]?.map((option) => (
                <label key={option?.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option?.value}
                    checked={settings?.privacy?.profileVisibility === option?.value}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e?.target?.value)}
                    className="w-4 h-4 text-accent focus:ring-accent mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">{option?.label}</span>
                    <p className="text-xs text-muted-foreground">{option?.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Other Privacy Settings */}
          {[
            { 
              key: 'showPurchaseHistory', 
              label: 'Hiển thị lịch sử mua hàng', 
              desc: 'Cho phép hiển thị lịch sử mua hàng trong hồ sơ công khai' 
            },
            { 
              key: 'allowRecommendations', 
              label: 'Cho phép gợi ý cá nhân hóa', 
              desc: 'Sử dụng dữ liệu mua hàng để cải thiện gợi ý sản phẩm' 
            },
            { 
              key: 'dataCollection', 
              label: 'Thu thập dữ liệu phân tích', 
              desc: 'Cho phép thu thập dữ liệu để cải thiện trải nghiệm mua sắm' 
            }
          ]?.map((item) => (
            <div key={item?.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h3 className="font-medium text-foreground">{item?.label}</h3>
                <p className="text-sm text-muted-foreground">{item?.desc}</p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.privacy?.[item?.key]}
                  onChange={(e) => handleSettingChange('privacy', item?.key, e?.target?.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          ))}
        </div>
      )}
  </div>
    <Modal
      open={confirmModalOpen}
      onClose={() => setConfirmModalOpen(false)}
      title="Xác nhận đổi mật khẩu"
      footer={(
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirmModalOpen(false)}>Hủy</Button>
          <Button variant="default" size="sm" onClick={confirmChangePassword}>Xác nhận</Button>
        </div>
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-accent/10 rounded-md">
          <Icon name="Lock" size={28} />
        </div>
        <div>
          <h4 className="text-lg font-semibold">Bạn thực sự muốn đổi mật khẩu?</h4>
          <p className="text-sm text-muted-foreground mt-2">Sau khi đổi mật khẩu, bạn sẽ được đăng xuất để bảo mật. Vui lòng ghi nhớ mật khẩu mới để đăng nhập lại.</p>
        </div>
      </div>
    </Modal>
    </>
  );
};

export default AccountSettings;