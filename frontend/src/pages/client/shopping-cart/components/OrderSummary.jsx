import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const OrderSummary = ({ 
  subtotal, 
  shipping, 
  tax, 
  discount, 
  total, 
  couponCode, 
  setCouponCode, 
  onApplyCoupon, 
  onProceedToCheckout,
  isLoading 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    if (couponCode?.trim()) {
      onApplyCoupon(couponCode?.trim());
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Tóm tắt đơn hàng
      </h3>
      {/* Coupon Code */}
      <form onSubmit={handleApplyCoupon} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Nhập mã giảm giá"
            value={couponCode}
            onChange={(e) => setCouponCode(e?.target?.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={!couponCode?.trim() || isLoading}
          >
            <Icon name="Tag" size={16} />
          </Button>
        </div>
      </form>
      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span className="text-foreground">
            {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Thuế VAT</span>
          <span className="text-foreground">{formatPrice(tax)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-success">Giảm giá</span>
            <span className="text-success">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Tổng cộng</span>
            <span className="font-semibold text-lg text-accent">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      {/* Shipping Info */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Icon name="Truck" size={16} />
          <span>Thông tin vận chuyển</span>
        </div>
        <p className="text-sm text-foreground">
          Miễn phí vận chuyển cho đơn hàng từ 500.000 VND
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Dự kiến giao hàng: 2-3 ngày làm việc
        </p>
      </div>
      {/* Security Badges */}
      <div className="flex items-center justify-center gap-4 mb-6 py-3 border-t border-b border-border">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} />
          <span>Bảo mật SSL</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Icon name="Lock" size={14} />
          <span>Thanh toán an toàn</span>
        </div>
      </div>
      {/* Checkout Button */}
      <Button
        onClick={onProceedToCheckout}
        disabled={isLoading || total <= 0}
        loading={isLoading}
        fullWidth
        className="mb-4"
      >
        Tiến hành thanh toán
      </Button>
      {/* Continue Shopping */}
      <Button
        variant="outline"
        fullWidth
        onClick={() => window.history?.back()}
      >
        Tiếp tục mua sắm
      </Button>
      {/* Payment Methods */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center mb-3">
          Phương thức thanh toán được hỗ trợ
        </p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
            VISA
          </div>
          <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
            MC
          </div>
          <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
            MOMO
          </div>
          <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
            GRAB
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;