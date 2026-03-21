import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Plus, Trash2, Move } from 'lucide-react';

/**
 * ProductVariantsManager - Manage variants array based on ProductMongo schema
 * Schema: { name, value, price_adjustment, stock_quantity, sku, image_url, sort_order }
 */
const ProductVariantsManager = ({ variants = [], onChange, error }) => {
  const [collapsed, setCollapsed] = useState({});

  const addVariant = () => {
    const newVariant = {
      name: '',
      value: '',
      price_adjustment: 0,
      stock_quantity: 0,
      sku: '',
      image_url: '',
      sort_order: variants.length
    };
    onChange([...variants, newVariant]);
    
    // Auto expand new variant
    setCollapsed({ ...collapsed, [variants.length]: false });
  };

  const updateVariant = (index, field, value) => {
    const updated = variants.map((variant, idx) => {
      if (idx === index) {
        return { ...variant, [field]: value };
      }
      return variant;
    });
    onChange(updated);
  };

  const removeVariant = (index) => {
    const filtered = variants.filter((_, idx) => idx !== index);
    // Update sort_order
    filtered.forEach((variant, idx) => {
      variant.sort_order = idx;
    });
    onChange(filtered);
  };

  const moveVariant = (index, direction) => {
    const newVariants = [...variants];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newVariants.length) return;
    
    [newVariants[index], newVariants[targetIndex]] = [newVariants[targetIndex], newVariants[index]];
    
    // Update sort_order
    newVariants.forEach((variant, idx) => {
      variant.sort_order = idx;
    });
    
    onChange(newVariants);
  };

  const toggleCollapse = (index) => {
    setCollapsed({ ...collapsed, [index]: !collapsed[index] });
  };

  if (variants.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-lg p-6 text-center">
        <h4 className="font-medium mb-2">Biến thể sản phẩm</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Thêm các biến thể như kích cỡ, màu sắc, phiên bản...
        </p>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus size={16} className="mr-2" />
          Thêm biến thể
        </Button>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">
          Biến thể sản phẩm ({variants.length})
        </h4>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus size={16} className="mr-2" />
          Thêm biến thể
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-3">
        {variants.map((variant, index) => {
          const isCollapsed = collapsed[index];
          const displayName = variant.name && variant.value 
            ? `${variant.name}: ${variant.value}`
            : `Biến thể ${index + 1}`;

          return (
            <div key={index} className="border border-border rounded-lg bg-card overflow-hidden">
              {/* Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleCollapse(index)}
              >
                <div className="flex items-center gap-3">
                  <Move size={16} className="text-muted-foreground" />
                  <div>
                    <div className="font-medium">{displayName}</div>
                    {variant.sku && (
                      <div className="text-xs text-muted-foreground">SKU: {variant.sku}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {/* Move buttons */}
                  <button
                    type="button"
                    onClick={() => moveVariant(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-muted rounded disabled:opacity-50"
                    title="Di chuyển lên"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveVariant(index, 'down')}
                    disabled={index === variants.length - 1}
                    className="p-1 hover:bg-muted rounded disabled:opacity-50"
                    title="Di chuyển xuống"
                  >
                    ↓
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                    title="Xóa biến thể"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Collapse indicator */}
                  <span className="text-muted-foreground ml-2">
                    {isCollapsed ? '▼' : '▲'}
                  </span>
                </div>
              </div>

              {/* Content */}
              {!isCollapsed && (
                <div className="p-4 pt-0 space-y-4 border-t">
                  {/* Name & Value */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Tên thuộc tính"
                      placeholder="Ví dụ: Màu sắc, Kích cỡ..."
                      value={variant.name || ''}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                    />
                    <Input
                      label="Giá trị"
                      placeholder="Ví dụ: Đỏ, XL, 128GB..."
                      value={variant.value || ''}
                      onChange={(e) => updateVariant(index, 'value', e.target.value)}
                    />
                  </div>

                  {/* SKU */}
                  <Input
                    label="SKU riêng (tùy chọn)"
                    placeholder="Mã SKU cho biến thể này"
                    value={variant.sku || ''}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                  />

                  {/* Price & Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Điều chỉnh giá (VND)"
                      type="number"
                      placeholder="0"
                      value={variant.price_adjustment || 0}
                      onChange={(e) => updateVariant(index, 'price_adjustment', Number(e.target.value))}
                      helper="Số tiền cộng/trừ vào giá gốc (âm = giảm)"
                    />
                    <Input
                      label="Số lượng tồn kho"
                      type="number"
                      placeholder="0"
                      value={variant.stock_quantity || 0}
                      onChange={(e) => updateVariant(index, 'stock_quantity', Number(e.target.value))}
                    />
                  </div>

                  {/* Image URL */}
                  <Input
                    label="URL ảnh (tùy chọn)"
                    placeholder="https://..."
                    value={variant.image_url || ''}
                    onChange={(e) => updateVariant(index, 'image_url', e.target.value)}
                    helper="Ảnh đại diện cho biến thể này"
                  />

                  {/* Image Preview */}
                  {variant.image_url && (
                    <div className="mt-2">
                      <img 
                        src={variant.image_url} 
                        alt={`${variant.name} ${variant.value}`}
                        className="w-24 h-24 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    <strong>Ví dụ:</strong> Nếu sản phẩm giá 100,000đ và điều chỉnh giá là +20,000đ thì biến thể này sẽ bán với giá 120,000đ
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground space-y-1 bg-muted/30 p-3 rounded">
        <p>• Tổng số biến thể: {variants.length}</p>
        <p>• Tổng tồn kho: {variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)}</p>
        <p>• Sử dụng ↑↓ để sắp xếp thứ tự hiển thị</p>
      </div>
    </div>
  );
};

export default ProductVariantsManager;
