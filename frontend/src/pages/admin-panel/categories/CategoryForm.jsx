import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../lib/api';
import { useToast } from '../../../components/ui/ToastProvider';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import { Folder, Image as ImageIcon, X } from 'lucide-react';
import { formatCategoriesWithHierarchy, normalizeCategoryId } from '../../../utils/categoryTree';

const emptyTemplate = {
  name: '',
  slug: '',
  description: '',
  parent_id: null,
  image_url: '',
  is_active: true,
  is_featured: false,
  sort_order: 0,
  meta_title: '',
  meta_description: '',
};

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(!!id);
  const [form, setForm] = useState(emptyTemplate);
  const [errors, setErrors] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = () => {
    if (!form.name) return;
    const slug = form.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    update('slug', slug);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.push({ title: 'Lỗi', message: 'Chỉ chấp nhận file ảnh', type: 'error' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.push({ title: 'Lỗi', message: 'File quá lớn (max 5MB)', type: 'error' });
      return;
    }

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await API.post('/api/uploads/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = res?.data?.url;
      if (url) {
        update('image_url', url);
        toast.push({ title: 'Thành công', message: 'Upload ảnh thành công', type: 'success' });
      }
    } catch (e) {
      console.error('Upload error:', e);
      toast.push({ title: 'Lỗi', message: 'Upload ảnh thất bại', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Fetch all categories (for parent select)
  useEffect(() => {
    const currentId = id ? String(id) : null;
    (async () => {
      try {
        const res = await API.get('/api/categories');
        const cats = res?.data?.data || res?.data?.categories || res?.data || [];
        const sortedCats = Array.isArray(cats)
          ? [...cats].sort((a, b) => (a?.sort_order || 0) - (b?.sort_order || 0))
          : [];
        const formatted = formatCategoriesWithHierarchy(sortedCats);
        setAllCategories(
          currentId
            ? formatted.filter(cat => (cat.normalizedId || String(cat._id || '')) !== currentId)
            : formatted
        );
      } catch (e) {
        console.error('Load categories error:', e);
        if (e.response?.status === 404) {
          console.warn('Categories API not available yet.');
        }
        setAllCategories([]);
      }
    })();
  }, [id]);

  // Load category if editing
  useEffect(() => {
    if (!id) return;
    
    (async () => {
      try {
        const res = await API.get(`/api/categories/${id}`);
        console.log('📝 Load category response:', res.data);
        const cat = res?.data?.data || res?.data?.category || res?.data;
        console.log('📝 Category data:', cat);
        if (cat) {
          const normalizedParentId = normalizeCategoryId(cat.parent_id);
          setForm({
            name: cat.name || '',
            slug: cat.slug || '',
            description: cat.description || '',
            parent_id: normalizedParentId,
            image_url: cat.image_url || '',
            is_active: cat.is_active !== false,
            is_featured: !!cat.is_featured,
            sort_order: cat.sort_order || 0,
            meta_title: cat.meta_title || '',
            meta_description: cat.meta_description || '',
          });
        }
      } catch (e) {
        console.error('Load category error:', e);
        toast.push({ 
          title: 'Lỗi', 
          message: 'Không tải được danh mục', 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    setErrors(null);
    
    try {
      const toSend = {
        name: form.name?.trim() || '',
        slug: form.slug?.trim() || '',
        description: form.description?.trim() || '',
        parent_id: form.parent_id || null,
        image_url: form.image_url?.trim() || '',
        is_active: !!form.is_active,
        is_featured: !!form.is_featured,
        sort_order: Number(form.sort_order) || 0,
        meta_title: form.meta_title?.trim() || '',
        meta_description: form.meta_description?.trim() || '',
      };

      if (id) {
        await API.put(`/api/categories/${id}`, toSend);
        toast.push({ 
          title: 'Thành công', 
          message: 'Cập nhật danh mục thành công', 
          type: 'success' 
        });
      } else {
        await API.post('/api/categories', toSend);
        toast.push({ 
          title: 'Thành công', 
          message: 'Tạo danh mục mới thành công', 
          type: 'success' 
        });
      }
      
      navigate('/admin-panel?tab=categories');
    } catch (e) {
      console.error('Save error:', e);
      const errorData = e.response?.data;
      
      if (errorData?.errors) {
        setErrors(errorData.errors);
      }
      
      toast.push({ 
        title: 'Lỗi', 
        message: errorData?.message || 'Lưu danh mục thất bại', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Folder className="text-primary" />
                {id ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {id ? 'Cập nhật thông tin danh mục' : 'Tạo danh mục mới cho sản phẩm'}
              </p>
            </div>
            {id && form.name && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Đang chỉnh sửa</div>
                <div className="font-semibold text-primary">{form.name}</div>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          
          {/* === THÔNG TIN CƠ BẢN === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>

            {/* Name, Slug & Sort Order - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Input
                  label="Tên danh mục"
                  placeholder="VD: Áo nam"
                  value={form.name || ''}
                  onChange={(e) => update('name', e.target.value)}
                  error={errors?.name}
                  required
                />
              </div>
              <div>
                <Input
                  label="Slug (URL)"
                  placeholder="ao-nam"
                  value={form.slug || ''}
                  onChange={(e) => update('slug', e.target.value)}
                  error={errors?.slug}
                  required
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="mt-1 text-xs text-primary hover:underline"
                >
                  Tạo tự động
                </button>
              </div>
              <div>
                <Input
                  label="Thứ tự"
                  type="number"
                  placeholder="0"
                  value={form.sort_order || ''}
                  onChange={(e) => update('sort_order', Number(e.target.value))}
                  error={errors?.sort_order}
                  min={0}
                  helper="Nhỏ hơn → trước"
                />
              </div>
            </div>

            {/* Description & Parent - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Textarea
                  label="Mô tả"
                  placeholder="Mô tả về danh mục..."
                  rows={4}
                  value={form.description || ''}
                  onChange={(e) => update('description', e.target.value)}
                  error={errors?.description}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Danh mục cha</label>
                <select
                  value={form.parent_id || ''}
                  onChange={(e) => update('parent_id', e.target.value || null)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">-- Không có (Danh mục gốc) --</option>
                  {Array.isArray(allCategories) && allCategories.map(cat => {
                    const optionValue = cat?.normalizedId || cat?._id || cat?.id;
                    if (!optionValue) return null;
                    return (
                      <option
                        key={optionValue}
                        value={optionValue}
                        title={cat?.displayLabel || cat?.name}
                      >
                        {cat?.indentedLabel || cat?.displayLabel || cat?.name}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Để tạo danh mục con (subcategory)
                </p>
              </div>
            </div>
          </div>

          {/* === HÌNH ẢNH & TRẠNG THÁI === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-primary" />
              Hình ảnh & Trạng thái
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Image */}
              <div>
                {/* Current Image */}
                {form.image_url && (
                  <div className="mb-3 relative inline-block">
                    <img
                      src={form.image_url}
                      alt={form.name}
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => update('image_url', '')}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Upload */}
                <label className="block w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    disabled={uploadingImage}
                  />
                  <ImageIcon size={32} className="mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm font-medium">
                    {uploadingImage ? 'Đang upload...' : 'Click để chọn ảnh'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF (Max 5MB)
                  </div>
                </label>

                {/* Or URL */}
                <div className="mt-3">
                  <Input
                    label="Hoặc nhập URL ảnh"
                    placeholder="https://..."
                    value={form.image_url || ''}
                    onChange={(e) => update('image_url', e.target.value)}
                    error={errors?.image_url}
                  />
                </div>
              </div>

              {/* Right: Status */}
              <div>
                <label className="block text-sm font-medium mb-3">Trạng thái</label>
                <div className="space-y-3">
                  {/* Active */}
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => update('is_active', e.target.checked)}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-medium text-sm">Hoạt động</div>
                      <div className="text-xs text-muted-foreground">
                        Hiển thị trên website
                      </div>
                    </div>
                  </label>

                  {/* Featured */}
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => update('is_featured', e.target.checked)}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-medium text-sm">Nổi bật</div>
                      <div className="text-xs text-muted-foreground">
                        Ưu tiên trang chủ
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* === SEO === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">SEO</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Meta Title"
                placeholder="SEO title..."
                value={form.meta_title || ''}
                onChange={(e) => update('meta_title', e.target.value)}
                error={errors?.meta_title}
                helper="Tiêu đề Google"
              />
              <Textarea
                label="Meta Description"
                placeholder="SEO description..."
                rows={3}
                value={form.meta_description || ''}
                onChange={(e) => update('meta_description', e.target.value)}
                error={errors?.meta_description}
                helper="Mô tả Google"
              />
            </div>
          </div>

          {/* === ACTIONS === */}
          <div className="flex justify-end gap-3 sticky bottom-0 bg-background p-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin-panel?tab=categories')} 
              type="button" 
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? 'Đang lưu...' : 'Lưu danh mục'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
