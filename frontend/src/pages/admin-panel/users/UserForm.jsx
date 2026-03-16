import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import Textarea from 'components/ui/Textarea';
import { useToast } from 'components/ui/ToastProvider';
import { createAdminUser, getAdminUserById, updateAdminUser } from 'lib/adminUserApi';
import API from 'lib/api';
import Icon from 'components/AppIcon';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'manager', label: 'Quản lý' },
  { value: 'staff', label: 'Nhân viên' },
  { value: 'support', label: 'Hỗ trợ' },
  { value: 'customer', label: 'Khách hàng' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
  { value: 'suspended', label: 'Tạm khóa' }
];

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  role: 'customer',
  status: 'active',
  password: '',
  confirmPassword: '',
  notes: '',
  avatar: ''
};

const UserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(Boolean(userId));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = useMemo(() => Boolean(userId), [userId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const user = await getAdminUserById(userId);
        if (!user) {
          toast.push({
            title: 'Không tìm thấy',
            message: 'Tài khoản này không tồn tại hoặc backend chưa cung cấp API tương ứng.',
            type: 'warning'
          });
          navigate('/admin-panel?tab=users', { replace: true });
          return;
        }
        setForm({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'customer',
          status: user.status || 'active',
          password: '',
          confirmPassword: '',
          notes: user.raw?.notes || '',
          avatar: user.avatar || ''
        });
      } catch (error) {
        console.error('Error loading user:', error);
        toast.push({
          title: 'Lỗi',
          message: 'Không thể tải thông tin người dùng.',
          type: 'error'
        });
        navigate('/admin-panel?tab=users', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, toast, navigate]);

  const updateField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.push({
        title: 'Lỗi',
        message: 'Vui lòng chọn file ảnh hợp lệ.',
        type: 'error'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.push({
        title: 'Lỗi',
        message: 'Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.',
        type: 'error'
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await API.post('/api/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const url = res?.data?.url;
      if (url) {
        setForm(prev => ({ ...prev, avatar: url }));
        toast.push({
          title: 'Thành công',
          message: 'Ảnh đại diện đã được tải lên.',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể tải lên ảnh. Vui lòng thử lại.',
        type: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Tên hiển thị không được để trống.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email là bắt buộc.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Email không hợp lệ.';
    }

    if (!form.role) {
      nextErrors.role = 'Vui lòng chọn vai trò.';
    }

    if (!form.status) {
      nextErrors.status = 'Vui lòng chọn trạng thái.';
    }

    if (!isEditMode) {
      if (!form.password.trim()) {
        nextErrors.password = 'Mật khẩu là bắt buộc khi tạo mới.';
      } else if (form.password.length < 6) {
        nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
      }

      if (form.password !== form.confirmPassword) {
        nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
      }
    } else if (form.password || form.confirmPassword) {
      if (form.password.length < 6) {
        nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
      }
      if (form.password !== form.confirmPassword) {
        nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      status: form.status,
      notes: form.notes?.trim() || undefined,
      avatar: form.avatar?.trim() || undefined
    };

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEditMode) {
        await updateAdminUser(userId, payload);
        toast.push({
          title: 'Thành công',
          message: 'Thông tin người dùng đã được cập nhật.',
          type: 'success'
        });
      } else {
        await createAdminUser(payload);
        toast.push({
          title: 'Thành công',
          message: 'Tài khoản người dùng mới đã được tạo.',
          type: 'success'
        });
      }
      navigate('/admin-panel?tab=users');
    } catch (error) {
      console.error('Error saving user:', error);
      const apiMessage = error?.response?.data?.message;
      toast.push({
        title: 'Lỗi',
        message: apiMessage || 'Không thể lưu thông tin người dùng.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Đang tải thông tin người dùng...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditMode ? 'Cập nhật người dùng' : 'Tạo người dùng mới'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditMode
              ? 'Điều chỉnh thông tin và quyền truy cập cho tài khoản đã chọn.'
              : 'Nhập thông tin chi tiết để tạo tài khoản nhân sự hoặc khách hàng mới.'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin-panel?tab=users')}>
          Hủy
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>
          
          {/* Avatar Upload Section */}
          <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="relative">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                  <Icon name="User" className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">Ảnh đại diện</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Tải lên ảnh đại diện cho người dùng. Định dạng JPG, PNG. Tối đa 5MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Icon name="Upload" className="w-4 h-4 mr-2" />
                  {uploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
                </Button>
                {form.avatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updateField('avatar', '')}
                    disabled={uploading}
                  >
                    <Icon name="X" className="w-4 h-4 mr-2" />
                    Xóa ảnh
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tên hiển thị"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              error={errors.fullName}
              required
            />
            <Input
              type="email"
              label="Email"
              placeholder="email@company.com"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Số điện thoại"
              placeholder="0123 456 789"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Bạn cũng có thể nhập URL ảnh trực tiếp hoặc sử dụng nút "Tải ảnh lên" bên trên.
          </p>
          <Input
            label="URL ảnh đại diện (tùy chọn)"
            placeholder="https://example.com/avatar.jpg"
            value={form.avatar}
            onChange={(event) => updateField('avatar', event.target.value)}
          />
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Quyền truy cập</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Vai trò"
              options={ROLE_OPTIONS}
              value={form.role}
              onChange={(value) => updateField('role', value)}
              error={errors.role}
              required
            />
            <Select
              label="Trạng thái"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(value) => updateField('status', value)}
              error={errors.status}
              required
            />
          </div>
          <Textarea
            label="Ghi chú nội bộ"
            placeholder="Ghi chú bổ sung về tài khoản này (chỉ hiển thị với quản trị viên)"
            value={form.notes}
            onChange={(event) => updateField('notes', event.target.value)}
          />
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Bảo mật đăng nhập</h2>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? 'Để giữ nguyên mật khẩu hiện tại, vui lòng để trống hai ô dưới đây.'
              : 'Mật khẩu sẽ được sử dụng để đăng nhập vào hệ thống.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="password"
              label="Mật khẩu"
              placeholder={isEditMode ? 'Để trống nếu không muốn đổi' : 'Ít nhất 6 ký tự'}
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              error={errors.password}
            />
            <Input
              type="password"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={(event) => updateField('confirmPassword', event.target.value)}
              error={errors.confirmPassword}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/admin-panel?tab=users')}>
            Hủy
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : isEditMode ? 'Lưu thay đổi' : 'Tạo người dùng'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
