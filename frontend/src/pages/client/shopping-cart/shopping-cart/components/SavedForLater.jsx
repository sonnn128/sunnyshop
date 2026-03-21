import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';

const SavedForLater = ({ items, onMoveToCart, onRemove, onMoveToWishlist }) => {
  const toast = useToast();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const handleMoveToCart = (itemId) => {
    const item = items.find(i => i.id === itemId);
    onMoveToCart(itemId);
    if (item) {
      toast.push({
        title: 'Thành công!',
        message: `Đã thêm "${item.name}" vào giỏ hàng`,
        type: 'success'
      });
    }
  };

  if (!items || items?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Đã lưu để mua sau ({items?.length})
        </h3>
        <Button variant="ghost" size="sm">
          <Icon name="MoreHorizontal" size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((item) => (
          <div key={item?.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Product Image */}
            <Link to={`/product-detail?id=${item?.id}`}>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                <Image
                  src={item?.image}
                  alt={item?.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div className="space-y-2">
              <Link 
                to={`/product-detail?id=${item?.id}`}
                className="font-medium text-sm text-foreground hover:text-accent transition-colors line-clamp-2"
              >
                {item?.name}
              </Link>

              <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                <span>{item?.color}</span>
                <span>•</span>
                <span>Size {item?.size}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-foreground">
                    {formatPrice(item?.price)}
                  </span>
                  {item?.originalPrice && item?.originalPrice > item?.price && (
                    <span className="text-xs text-muted-foreground line-through ml-1">
                      {formatPrice(item?.originalPrice)}
                    </span>
                  )}
                </div>
                
                {item?.inStock ? (
                  <span className="text-xs text-success">Còn hàng</span>
                ) : (
                  <span className="text-xs text-error">Hết hàng</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMoveToCart(item?.id)}
                  disabled={!item?.inStock}
                  className="flex-1 text-xs"
                >
                  <Icon name="ShoppingCart" size={14} />
                  <span className="ml-1">Thêm vào giỏ</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMoveToWishlist(item?.id)}
                  className="p-2"
                >
                  <Icon name="Heart" size={14} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(item?.id)}
                  className="p-2 text-error hover:text-error"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedForLater;