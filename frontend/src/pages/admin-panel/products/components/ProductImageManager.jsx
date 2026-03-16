import React, { useState } from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import API from '../../../../lib/api';
import { useToast } from '../../../../components/ui/ToastProvider';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

/**
 * ProductImageManager - Manage images array based on ProductMongo schema
 * Schema: { image_url, alt_text, sort_order, is_primary }
 */
const ProductImageManager = ({ images = [], onChange, error }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const toast = useToast();

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.push({ title: 'Lỗi', message: 'Chỉ cho phép upload file ảnh', type: 'error' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.push({ title: 'Lỗi', message: 'Kích thước ảnh không được vượt quá 5MB', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await API.post('/api/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = res?.data?.url;
      if (imageUrl) {
        // Create new image object matching ProductMongo schema
        const newImage = {
          image_url: imageUrl,
          alt_text: '',
          sort_order: images.length,
          is_primary: images.length === 0 // First image is primary
        };
        onChange([...images, newImage]);
        toast.push({ title: 'Thành công', message: 'Upload ảnh thành công', type: 'success' });
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.push({ 
        title: 'Lỗi', 
        message: error?.response?.data?.message || 'Upload ảnh thất bại', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageByUrl = () => {
    const url = imageUrl.trim();
    if (!url) {
      toast.push({ title: 'Lỗi', message: 'Vui lòng nhập URL ảnh hợp lệ', type: 'error' });
      return;
    }

    try {
      // Simple URL validation
      new URL(url);
    } catch (err) {
      toast.push({ title: 'Lỗi', message: 'URL không hợp lệ', type: 'error' });
      return;
    }

    const newImage = {
      image_url: url,
      alt_text: '',
      sort_order: images.length,
      is_primary: images.length === 0
    };

    onChange([...images, newImage]);
    setImageUrl('');
    toast.push({ title: 'Thành công', message: 'Đã thêm ảnh từ URL', type: 'success' });
  };

  const updateImage = (index, field, value) => {
    const updated = images.map((img, idx) => {
      if (idx === index) {
        // If setting as primary, unset others
        if (field === 'is_primary' && value === true) {
          return { ...img, is_primary: true };
        }
        return { ...img, [field]: value };
      }
      // Unset primary for other images if this one is set to primary
      if (field === 'is_primary' && value === true) {
        return { ...img, is_primary: false };
      }
      return img;
    });
    onChange(updated);
  };

  const removeImage = (index) => {
    const filtered = images.filter((_, idx) => idx !== index);
    // If removed image was primary, set first image as primary
    if (images[index]?.is_primary && filtered.length > 0) {
      filtered[0].is_primary = true;
    }
    onChange(filtered);
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    
    // Update sort_order
    newImages.forEach((img, idx) => {
      img.sort_order = idx;
    });
    
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            placeholder="Dán URL ảnh (https://...)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={handleAddImageByUrl} disabled={!imageUrl.trim()}>
            Thêm từ URL
          </Button>
        </div>

        <div className="flex items-center gap-4">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Upload size={18} />
          <span>{uploading ? 'Đang tải...' : 'Tải ảnh lên'}</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
            disabled={uploading}
          />
        </label>
        {uploading && (
          <div className="text-sm text-muted-foreground">
            <div className="animate-pulse">Đang upload...</div>
          </div>
        )}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <ImageIcon size={48} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Chưa có ảnh nào</p>
          <p className="text-sm text-muted-foreground mt-1">Upload ảnh để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden bg-card">
              {/* Image Preview */}
              <div className="relative aspect-square bg-muted">
                <img 
                  src={image.image_url} 
                  alt={image.alt_text || `Ảnh ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Primary Badge */}
                {image.is_primary && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-white text-xs font-medium rounded">
                    Ảnh chính
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                >
                  <X size={16} />
                </button>

                {/* Sort Order Buttons */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 bg-background/80 rounded text-xs hover:bg-background disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    className="px-2 py-1 bg-background/80 rounded text-xs hover:bg-background disabled:opacity-50"
                  >
                    ↓
                  </button>
                </div>
              </div>

              {/* Image Details */}
              <div className="p-3 space-y-2">
                <Input
                  placeholder="Mô tả ảnh (alt text)"
                  value={image.alt_text || ''}
                  onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
                  className="text-sm"
                />
                
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={image.is_primary || false}
                    onChange={(e) => updateImage(index, 'is_primary', e.target.checked)}
                    className="rounded"
                  />
                  <span>Đặt làm ảnh chính</span>
                </label>

                <div className="text-xs text-muted-foreground">
                  Thứ tự: {image.sort_order + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>• Ảnh đầu tiên sẽ tự động là ảnh chính</p>
        <p>• Sử dụng nút ↑↓ để sắp xếp thứ tự hiển thị</p>
        <p>• Kích thước tối đa: 5MB</p>
      </div>
    </div>
  );
};

export default ProductImageManager;
