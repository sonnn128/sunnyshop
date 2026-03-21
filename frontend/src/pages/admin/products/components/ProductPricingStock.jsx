import React from 'react';
import Input from '@/components/ui/Input';
import { DollarSign, TrendingDown, Package, AlertTriangle } from 'lucide-react';

/**
 * ProductPricingStock - Pricing and inventory section
 * Fields: price, original_price, cost_price, stock_quantity, min_stock_level
 */
const ProductPricingStock = ({ form = {}, onChange, errors = {} }) => {
  const update = (field, value) => onChange(field, value);

  // Calculate discount percentage
  const discountPercent = form.original_price > 0 && form.price > 0
    ? Math.round(((form.original_price - form.price) / form.original_price) * 100)
    : 0;

  // Calculate profit margin
  const profitMargin = form.cost_price > 0 && form.price > 0
    ? Math.round(((form.price - form.cost_price) / form.price) * 100)
    : 0;

  // Stock status
  const stockStatus = form.stock_quantity <= 0
    ? { label: 'Hết hàng', color: 'text-red-600', bg: 'bg-red-50' }
    : form.stock_quantity <= (form.min_stock_level || 5)
    ? { label: 'Sắp hết', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    : { label: 'Còn hàng', color: 'text-green-600', bg: 'bg-green-50' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b">
        <DollarSign size={20} className="text-primary" />
        <h3 className="text-lg font-semibold">Giá & Tồn kho</h3>
      </div>

      {/* Pricing Section */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <DollarSign size={16} />
          Định giá
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Selling Price - Required */}
          <div className="md:col-span-1">
            <Input
              label="Giá bán"
              type="number"
              placeholder="0"
              value={form.price || ''}
              onChange={(e) => update('price', Number(e.target.value))}
              error={errors.price}
              required
              helper="Giá khách hàng thanh toán"
              min={0}
            />
          </div>

          {/* Original Price */}
          <div className="md:col-span-1">
            <Input
              label="Giá gốc (trước khuyến mãi)"
              type="number"
              placeholder="0"
              value={form.original_price || ''}
              onChange={(e) => update('original_price', Number(e.target.value))}
              error={errors.original_price}
              helper="Để trống nếu không giảm giá"
              min={0}
            />
            {discountPercent > 0 && (
              <div className="mt-1 text-sm text-green-600 font-medium">
                Giảm {discountPercent}%
              </div>
            )}
          </div>

          {/* Cost Price */}
          <div className="md:col-span-1">
            <Input
              label="Giá vốn"
              type="number"
              placeholder="0"
              value={form.cost_price || ''}
              onChange={(e) => update('cost_price', Number(e.target.value))}
              error={errors.cost_price}
              helper="Giá nhập hàng"
              min={0}
            />
            {profitMargin > 0 && (
              <div className="mt-1 text-sm text-blue-600 font-medium">
                Lợi nhuận: {profitMargin}%
              </div>
            )}
          </div>
        </div>

        {/* Price Summary */}
        {form.price > 0 && (
          <div className="bg-muted/50 rounded p-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Giá bán:</span>
              <span className="font-semibold">
                {(form.price || 0).toLocaleString('vi-VN')} đ
              </span>
            </div>
            {form.original_price > 0 && form.original_price > form.price && (
              <>
                <div className="flex justify-between text-muted-foreground line-through">
                  <span>Giá gốc:</span>
                  <span>{(form.original_price || 0).toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Tiết kiệm:</span>
                  <span>
                    {(form.original_price - form.price).toLocaleString('vi-VN')} đ (-{discountPercent}%)
                  </span>
                </div>
              </>
            )}
            {form.cost_price > 0 && (
              <div className="flex justify-between border-t pt-1 mt-1">
                <span>Lợi nhuận/sp:</span>
                <span className={form.price > form.cost_price ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {(form.price - form.cost_price).toLocaleString('vi-VN')} đ
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stock Section */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Package size={16} />
          Quản lý tồn kho
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stock Quantity - Required */}
          <div>
            <Input
              label="Số lượng tồn kho"
              type="number"
              placeholder="0"
              value={form.stock_quantity || ''}
              onChange={(e) => update('stock_quantity', Number(e.target.value))}
              disabled={Array.isArray(form.variants) && form.variants.length > 0}
              error={errors.stock_quantity}
              required
              helper="Số lượng sản phẩm hiện có"
              min={0}
            />
          </div>

          {/* Min Stock Level */}
          <div>
            <Input
              label="Mức tồn kho tối thiểu"
              type="number"
              placeholder="5"
              value={form.min_stock_level || ''}
              onChange={(e) => update('min_stock_level', Number(e.target.value))}
              error={errors.min_stock_level}
              helper="Cảnh báo khi tồn kho dưới mức này"
              min={0}
            />
          </div>
        </div>

        {/* Stock Status */}
        <div className={`${stockStatus.bg} border rounded-lg p-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {form.stock_quantity <= (form.min_stock_level || 5) && (
                <AlertTriangle size={18} className={stockStatus.color} />
              )}
              <span className="font-medium">Trạng thái:</span>
              <span className={`${stockStatus.color} font-semibold`}>
                {stockStatus.label}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Tồn kho: </span>
              <span className="font-semibold">{form.stock_quantity || 0} sản phẩm</span>
            </div>
          </div>

          {form.stock_quantity <= (form.min_stock_level || 5) && form.stock_quantity > 0 && (
            <div className="mt-2 text-sm text-yellow-700">
              ⚠️ Sắp hết hàng! Cần nhập thêm {(form.min_stock_level || 5) - form.stock_quantity + 10} sản phẩm
            </div>
          )}

          {form.stock_quantity <= 0 && (
            <div className="mt-2 text-sm text-red-700">
              🚫 Hết hàng! Khách hàng không thể đặt mua
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Mẹo:</h4>
        <ul className="space-y-1 text-blue-800">
          <li>• Giá bán phải lớn hơn giá vốn để có lợi nhuận</li>
          <li>• Giá gốc lớn hơn giá bán sẽ hiển thị % giảm giá</li>
          <li>• Đặt mức tồn kho tối thiểu để được cảnh báo kịp thời</li>
          <li>• Khi tồn kho = 0, sản phẩm tự động chuyển sang "Hết hàng"</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductPricingStock;
