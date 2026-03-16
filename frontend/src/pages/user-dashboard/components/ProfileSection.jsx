import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import API from '../../../lib/api';
import { useToast } from '../../../components/ui/ToastProvider';

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Nguyễn Thị Minh Anh",
    email: "minhanh@email.com",
    phone: "0901234567",
    dateOfBirth: "1995-03-15",
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    (async () => {
  setLoading(true);
      try {
        // map UI fields to backend payload
        const payload = {
          name: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          dateOfBirth: profileData.dateOfBirth,
          gender: profileData.gender,
          avatar: profileData.avatar,
        };
  const res = await API.put('/api/auth/me', payload);
        const updatedUser = res.data.user || res.data;
        // map updated user back to UI fields
        const mapped = {
          fullName: updatedUser.name || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          dateOfBirth: updatedUser.dateOfBirth || '',
          gender: updatedUser.gender || 'other',
          avatar: updatedUser.avatar || '',
        };
        setProfileData(mapped);
        setOriginalProfile(mapped);
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (e) {}
  setIsEditing(false);
  toast.push({ title: 'Cập nhật thành công', message: 'Thông tin cá nhân đã được cập nhật.', type: 'success' });
      } catch (err) {
        console.error('Update profile error:', err?.response?.data?.message || err?.message || err);
        toast.push({ title: 'Lỗi', message: 'Cập nhật thất bại. Vui lòng thử lại sau.', type: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleAvatarFile = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await API.post('/api/auth/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = res?.data?.url;
      if (url) {
        setProfileData(prev => ({ ...prev, avatar: url }));
        // update localStorage user if present
        try {
          const ls = JSON.parse(localStorage.getItem('user') || 'null');
          if (ls) { ls.avatar = url; localStorage.setItem('user', JSON.stringify(ls)); }
        } catch (e) {}
      }
    } catch (e) {
      console.error('Avatar upload failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (originalProfile) setProfileData(originalProfile);
  };

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await API.get('/api/auth/me');
        const user = res?.data?.user || res?.data;
        if (mounted && user) {
          const mapped = {
            fullName: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            dateOfBirth: user.dateOfBirth || '',
            gender: user.gender || 'other',
            avatar: user.avatar || '',
          };
          setProfileData(mapped);
          setOriginalProfile(mapped);
        }
      } catch (err) {
        // fallback: try localStorage user
        try {
          const lsUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || 'null');
          if (lsUser && mounted) {
            const mapped = {
              fullName: lsUser.name || lsUser.fullName || '',
              email: lsUser.email || '',
              phone: lsUser.phone || '',
              dateOfBirth: lsUser.dateOfBirth || '',
              gender: lsUser.gender || 'other',
              avatar: lsUser.avatar || '',
            };
            setProfileData(mapped);
            setOriginalProfile(mapped);
          }
        } catch (e) {}
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Thông tin cá nhân</h2>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            iconName="Edit2"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Hủy
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Check"
              iconPosition="left"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        )}
      </div>
  {/* toasts are used for messages */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
              <Image
                src={profileData?.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <div className="absolute -bottom-1 -right-1 flex items-center space-x-2">
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarFile(e?.target?.files?.[0])}
                />
                <label htmlFor="avatar-file-input" className="cursor-pointer w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <Icon name="Camera" size={16} />
                </label>
              </div>
            )}
          </div>
          {isEditing && (
            <Button variant="outline" size="sm">
              Thay đổi ảnh
            </Button>
          )}
        </div>

        {/* Profile Form */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Họ và tên"
            type="text"
            value={profileData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Email"
            type="email"
            value={profileData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Số điện thoại"
            type="tel"
            value={profileData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Ngày sinh"
            type="date"
            value={profileData?.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
            disabled={!isEditing}
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Giới tính
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={profileData?.gender === 'female'}
                  onChange={(e) => handleInputChange('gender', e?.target?.value)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-accent focus:ring-accent"
                />
                <span className="text-sm text-foreground">Nữ</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={profileData?.gender === 'male'}
                  onChange={(e) => handleInputChange('gender', e?.target?.value)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-accent focus:ring-accent"
                />
                <span className="text-sm text-foreground">Nam</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={profileData?.gender === 'other'}
                  onChange={(e) => handleInputChange('gender', e?.target?.value)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-accent focus:ring-accent"
                />
                <span className="text-sm text-foreground">Khác</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;