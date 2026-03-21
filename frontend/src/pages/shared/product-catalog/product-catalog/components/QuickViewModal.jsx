import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart, onWishlistToggle }) => {
  const [selectedSize, setSelectedSize] = useState(product?.availableSizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.availableColors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const toast = useToast();
  const imageList = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images
        .map((img) => {
          if (!img) return null;
          if (typeof img === 'string') return img;
          return img.image_url || img.imageUrl || img.url || null;
        })
        .filter(Boolean);
    }
    if (product?.primaryImage) return [product.primaryImage];
    if (product?.image) return [product.image];
    return [];
  }, [product]);
  const resolvedImage = imageList[currentImageIndex] || imageList[0] || null;

  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.price < product?.originalPrice) {
      return Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100);
    }
    return 0;
  };

  const handleAddToCart = () => {
    if (!selectedSize && product?.availableSizes?.length > 0) {
      toast.push({
        title: 'Thiếu thông tin',
        message: 'Vui lòng chọn kích thước',
        type: 'warning'
      });
      return;
    }

    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });

    toast.push({
      title: 'Thành công!',
      message: `Đã thêm ${quantity} sản phẩm vào giỏ hàng`,
      type: 'success'
    });

    onClose();
  };

  const handleWishlistToggle = () => {
    onWishlistToggle(product?.id);
    
    // Show toast notification
    if (product?.isWishlisted) {
      toast.push({
        title: 'Đã xóa',
        message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
        type: 'info'
      });
    } else {
      toast.push({
        title: 'Đã thêm vào yêu thích!',
        message: `"${product?.name}" đã được thêm vào danh sách yêu thích`,
        type: 'success'
      });
    }
  };

  const discount = calculateDiscount();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-elegant max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Xem nhanh sản phẩm</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 rounded-full"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={resolvedImage}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            {imageList.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {imageList.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-smooth ${
                      index === currentImageIndex ? 'border-accent' : 'border-border'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product?.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand and Name */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">{product?.brand}</p>
              <h1 className="text-2xl font-semibold text-foreground mb-2">{product?.name}</h1>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(product?.price)}
              </span>
              {product?.originalPrice && product?.originalPrice > product?.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product?.originalPrice)}
                  </span>
                  <span className="px-2 py-1 bg-error text-error-foreground text-sm font-medium rounded">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {product?.description || `Sản phẩm chất lượng cao từ thương hiệu ${product?.brand}. Thiết kế hiện đại, phù hợp với nhiều phong cách khác nhau.`}
              </p>
            </div>

            {/* Color Selection */}
            {product?.availableColors && product?.availableColors?.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  Màu sắc: {selectedColor?.name}
                </h4>
                <div className="flex space-x-2">
                  {product?.availableColors?.map((color) => (
                    <button
                      key={color?.value}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-smooth ${
                        selectedColor?.value === color?.value
                          ? 'border-accent shadow-lg'
                          : 'border-border hover:border-accent'
                      }`}
                      style={{ backgroundColor: color?.color }}
                      title={color?.name}
                    >
                      {selectedColor?.value === color?.value && (
                        <Icon 
                          name="Check" 
                          size={16} 
                          className={`m-auto ${color?.value === 'white' ? 'text-black' : 'text-white'}`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product?.availableSizes && product?.availableSizes?.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  Kích thước: {selectedSize || 'Chưa chọn'}
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {product?.availableSizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 text-sm border rounded-lg transition-smooth ${
                        selectedSize === size
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'bg-background text-foreground border-border hover:border-accent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Số lượng</h4>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Icon name="Minus" size={16} />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="default"
                onClick={handleAddToCart}
                className="flex-1"
                iconName="ShoppingCart"
                iconPosition="left"
              >
                Thêm vào giỏ hàng
              </Button>
              
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                className={product?.isWishlisted ? 'text-error border-error' : ''}
              >
                <Icon 
                  name="Heart" 
                  size={20}
                  className={product?.isWishlisted ? 'fill-current' : ''}
                />
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Truck" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="RotateCcw" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Đổi trả 30 ngày</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Bảo hành chính hãng</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="CreditCard" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Thanh toán an toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;