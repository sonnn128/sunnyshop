import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const RecentlyViewed = ({ products }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  if (!products || products?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Clock" size={20} className="text-accent" />
        <h2 className="text-xl font-semibold text-foreground">
          Sản phẩm đã xem
        </h2>
      </div>
      <div className="space-y-4">
        {products?.map((product) => (
          <div key={product?.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted transition-smooth">
            <Link
              to={`/product-detail?id=${product?.id}`}
              className="flex-shrink-0"
            >
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                to={`/product-detail?id=${product?.id}`}
                className="block"
              >
                <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-accent transition-smooth">
                  {product?.name}
                </h3>
              </Link>

              <div className="flex items-center space-x-1 mt-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={12}
                    className={i < Math.floor(product?.rating) ? 'text-accent fill-accent' : 'text-gray-300'}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  ({product?.reviewCount})
                </span>
              </div>

              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-semibold text-foreground">
                  {formatPrice(product?.salePrice)}
                </span>
                {product?.originalPrice > product?.salePrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product?.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <button className="w-8 h-8 bg-accent/10 hover:bg-accent/20 rounded-full flex items-center justify-center transition-smooth">
                <Icon name="ShoppingCart" size={14} className="text-accent" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Link
          to="/user-dashboard"
          className="text-sm text-accent hover:underline font-medium"
        >
          Xem tất cả lịch sử xem sản phẩm
        </Link>
      </div>
    </div>
  );
};

export default RecentlyViewed;