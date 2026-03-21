import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../lib/api';
import { useToast } from '../../../components/ui/ToastProvider';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import Textarea from '../../../components/ui/Textarea';
import { Folder, Image as ImageIcon, X } from 'lucide-react';
import { uploadImage } from '../../../lib/uploadApi';

const emptyTemplate = {
  name: '',
  slug: '',
  description: '',
  image_url: '',
  sort_order: 0,
};

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(!!id);
  const [form, setForm] = useState(emptyTemplate);
  const [errors, setErrors] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [localImageFile, setLocalImageFile] = useState(null);
  const [localImagePreview, setLocalImagePreview] = useState('');

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

  const handleImageUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.push({ title: 'Lỗi', message: 'Chỉ chấp nhận file ảnh', type: 'error' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.push({ title: 'Lỗi', message: 'File quá lớn (max 5MB)', type: 'error' });
      return;
    }

    if (localImagePreview && localImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(localImagePreview);
    }

    setLocalImageFile(file);
    setLocalImagePreview(URL.createObjectURL(file));
    toast.push({ title: 'Đã chọn ảnh', message: 'Ảnh sẽ được upload khi bấm Lưu danh mục', type: 'info' });
  };

  useEffect(() => {
    return () => {
      if (localImagePreview && localImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(localImagePreview);
      }
    };
  }, [localImagePreview]);

  // Load category if editing
  useEffect(() => {
    if (!id) return;
    
    (async () => {
      try {
        const res = await API.get(`/categories/${id}`);
        console.log('📝 Load category response:', res.data);
        const cat = res?.data?.data || res?.data?.category || res?.data;
        console.log('📝 Category data:', cat);
        if (cat) {
          setForm({
            name: cat.name || '',
            slug: cat.slug || '',
            description: cat.description || '',
            image_url: cat.image_url || cat.imageUrl || '',
            sort_order: cat.sort_order || cat.sortOrder || 0,
          });
          setLocalImageFile(null);
          setLocalImagePreview('');
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
      let imageUrlToSave = form.image_url?.trim() || '';

      if (localImageFile) {
        setUploadingImage(true);
        const uploadedUrl = await uploadImage(localImageFile);
        if (!uploadedUrl) {
          throw new Error('Không nhận được URL ảnh từ server');
        }
        imageUrlToSave = uploadedUrl;
      }

      const toSend = {
        name: form.name?.trim() || '',
        slug: form.slug?.trim() || '',
        description: form.description?.trim() || '',
        image_url: imageUrlToSave,
        sort_order: Number(form.sort_order) || 0,
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
      setUploadingImage(false);
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
          </div>

          {/* === HÌNH ẢNH === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-primary" />
              Hình ảnh
            </h3>

            <div>
                {/* Current Image */}
                {(localImagePreview || form.image_url) && (
                  <div className="mb-3 relative inline-block">
                    <img
                      src={localImagePreview || form.image_url}
                      alt={form.name}
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        update('image_url', '');
                        setLocalImageFile(null);
                        if (localImagePreview && localImagePreview.startsWith('blob:')) {
                          URL.revokeObjectURL(localImagePreview);
                        }
                        setLocalImagePreview('');
                      }}
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
                    PNG, JPG, GIF (Max 5MB) • Upload khi bấm Lưu danh mục
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
