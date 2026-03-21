import React from 'react';
import Input from '../../../../components/ui/Input';
import Textarea from '../../../../components/ui/Textarea';
import { Package, FileText, Hash, Link as LinkIcon } from 'lucide-react';

/**
 * ProductBasicInfo - Basic product information section
 * Fields: name, slug, short_description, description, sku
 */
const ProductBasicInfo = ({ form = {}, onChange, errors = {} }) => {
  const update = (field, value) => onChange(field, value);

  // Auto-generate slug from name
  const generateSlug = () => {
    if (!form.name) return;
    const slug = form.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-') // Replace multiple - with single -
      .trim();
    update('slug', slug);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b">
        <FileText size={20} className="text-primary" />
        <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
      </div>

      {/* Product Name - Required */}
      <div>
        <Input
          label="Tên sản phẩm"
          placeholder="Nhập tên sản phẩm"
          value={form.name || ''}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
          required
          helper="Tên sản phẩm sẽ hiển thị trên trang web"
        />
      </div>

      {/* Slug & SKU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Slug - Required */}
        <div className="relative">
          <Input
            label="Slug (URL thân thiện)"
            placeholder="san-pham-mau-do"
            value={form.slug || ''}
            onChange={(e) => update('slug', e.target.value)}
            error={errors.slug}
            required
            helper="URL của sản phẩm (duy nhất)"
            icon={<LinkIcon size={16} />}
          />
          <button
            type="button"
            onClick={generateSlug}
            className="absolute right-2 top-9 px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Tự động tạo
          </button>
        </div>

        {/* SKU */}
        <Input
          label="SKU (Mã sản phẩm)"
          placeholder="PROD-001"
          value={form.sku || ''}
          onChange={(e) => update('sku', e.target.value)}
          error={errors.sku}
          helper="Mã định danh duy nhất (tùy chọn)"
          icon={<Hash size={16} />}
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Mô tả ngắn
        </label>
        <Textarea
          placeholder="Mô tả ngắn gọn về sản phẩm (2-3 câu)"
          value={form.short_description || ''}
          onChange={(e) => update('short_description', e.target.value)}
          error={errors.short_description}
          rows={3}
          maxLength={200}
          helper={`${(form.short_description || '').length}/200 ký tự`}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Mô tả chi tiết
        </label>
        <Textarea
          placeholder="Mô tả chi tiết về sản phẩm, tính năng, chất liệu..."
          value={form.description || ''}
          onChange={(e) => update('description', e.target.value)}
          error={errors.description}
          rows={6}
          helper="Mô tả càng chi tiết càng tốt để khách hàng hiểu rõ sản phẩm"
        />
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Mẹo:</h4>
        <ul className="space-y-1 text-blue-800">
          <li>• Tên sản phẩm nên ngắn gọn, dễ nhớ (30-60 ký tự)</li>
          <li>• Slug nên chứa từ khóa quan trọng cho SEO</li>
          <li>• Mô tả ngắn hiển thị trên danh sách sản phẩm</li>
          <li>• Mô tả chi tiết nên có thông tin đầy đủ: chất liệu, kích thước, cách sử dụng...</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductBasicInfo;
