import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyCart = () => {
  const suggestedCategories = [
    { name: 'Áo thun', path: '/product-catalog?category=t-shirts', icon: 'Shirt' },
    { name: 'Quần jeans', path: '/product-catalog?category=jeans', icon: 'Zap' },
    { name: 'Giày dép', path: '/product-catalog?category=shoes', icon: 'Footprints' },
    { name: 'Phụ kiện', path: '/product-catalog?category=accessories', icon: 'Watch' }
  ];

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Empty Cart Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <Icon name="ShoppingCart" size={48} className="text-muted-foreground" />
        </div>

        {/* Empty State Message */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-muted-foreground mb-8">
          Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm vào giỏ hàng để bắt đầu mua sắm!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 mb-12">
          <Link to="/product-catalog">
            <Button size="lg" className="w-full sm:w-auto">
              <Icon name="Search" size={20} />
              <span className="ml-2">Khám phá sản phẩm</span>
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/user-dashboard">
              <Button variant="outline" size="sm">
                <Icon name="Heart" size={16} />
                <span className="ml-2">Xem danh sách yêu thích</span>
              </Button>
            </Link>
            <Link to="/homepage">
              <Button variant="outline" size="sm">
                <Icon name="Home" size={16} />
                <span className="ml-2">Về trang chủ</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Suggested Categories */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Danh mục phổ biến
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {suggestedCategories?.map((category) => (
              <Link
                key={category?.name}
                to={category?.path}
                className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-all duration-300 hover:border-accent group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-accent/20 transition-colors">
                    <Icon name={category?.icon} size={24} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {category?.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-2">
                <Icon name="Truck" size={24} className="text-success" />
              </div>
              <h4 className="font-medium text-foreground mb-1">Miễn phí vận chuyển</h4>
              <p className="text-xs text-muted-foreground">Đơn hàng từ 500.000 VND</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                <Icon name="RotateCcw" size={24} className="text-accent" />
              </div>
              <h4 className="font-medium text-foreground mb-1">Đổi trả dễ dàng</h4>
              <p className="text-xs text-muted-foreground">Trong vòng 30 ngày</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2">
                <Icon name="Shield" size={24} className="text-blue-500" />
              </div>
              <h4 className="font-medium text-foreground mb-1">Thanh toán an toàn</h4>
              <p className="text-xs text-muted-foreground">Bảo mật 100%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;