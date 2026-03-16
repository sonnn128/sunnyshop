import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ui/ToastProvider';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { getBrand, createBrand, updateBrand } from '../../../lib/brandApi';
import { Briefcase, Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';

const emptyTemplate = {
  name: '',
  slug: '',
  logo_url: '',
  description: '',
  is_active: true
};

const BrandForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id && id !== 'new';

  const [form, setForm] = useState(emptyTemplate);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      loadBrand();
    }
  }, [id]);

  const loadBrand = async () => {
    setLoading(true);
    try {
      const data = await getBrand(id);
      if (data) {
        setForm({
          name: data.name || '',
          slug: data.slug || '',
          logo_url: data.logo_url || '',
          description: data.description || '',
          is_active: data.is_active !== false
        });
      }
    } catch (e) {
      toast.push({ title: 'Lỗi', message: 'Không tải được thông tin thương hiệu', type: 'error' });
      navigate('/admin-panel?tab=brands');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from name
      if (field === 'name' && !isEdit) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name?.trim()) {
      newErrors.name = 'Tên thương hiệu là bắt buộc';
    }
    if (!form.slug?.trim()) {
      newErrors.slug = 'Slug là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit) {
        await updateBrand(id, form);
        toast.push({ title: 'Thành công', message: 'Cập nhật thương hiệu thành công', type: 'success' });
      } else {
        await createBrand(form);
        toast.push({ title: 'Thành công', message: 'Tạo thương hiệu mới thành công', type: 'success' });
      }
      navigate('/admin-panel?tab=brands');
    } catch (e) {
      const message = e.response?.data?.message || 'Không thể lưu thương hiệu';
      toast.push({ title: 'Lỗi', message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin-panel?tab=brands')}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-accent" />
            {isEdit ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-foreground mb-4">Thông tin cơ bản</h2>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Tên thương hiệu <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nhập tên thương hiệu"
              error={errors.name}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="slug-thuong-hieu"
              error={errors.slug}
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            <p className="text-muted-foreground text-xs mt-1">
              Slug được dùng trong URL. Tự động tạo từ tên nếu để trống.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Mô tả
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Mô tả về thương hiệu..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
            />
          </div>
        </div>

        {/* Logo Card */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-foreground mb-4">Logo</h2>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              URL Logo
            </label>
            <Input
              value={form.logo_url}
              onChange={(e) => handleChange('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Logo Preview */}
          {form.logo_url && (
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground mb-2">Xem trước:</p>
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-border">
                  <img 
                    src={form.logo_url} 
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('logo_url', '')}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-4">Trạng thái</h2>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-foreground">Hiển thị thương hiệu</span>
          </label>
          <p className="text-muted-foreground text-sm mt-2">
            Khi tắt, thương hiệu sẽ không hiển thị trên trang web
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin-panel?tab=brands')}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BrandForm;
