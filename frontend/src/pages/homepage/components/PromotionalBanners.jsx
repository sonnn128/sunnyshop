import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PromotionalBanners = () => {
  const mainPromo = {
    id: 1,
    title: "Flash Sale 24H",
    subtitle: "Giảm đến 70% cho tất cả sản phẩm",
    description: "Cơ hội vàng để sở hữu những món đồ yêu thích với giá không thể tốt hơn. Chỉ trong 24 giờ!",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    cta: "Mua Ngay",
    timeLeft: "23:45:12",
    discount: "70%"
  };

  const sidePromos = [
    {
      id: 2,
      title: "Thành Viên Mới",
      subtitle: "Giảm 20% đơn đầu tiên",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      cta: "Đăng Ký",
      badge: "Ưu đãi đặc biệt"
    },
    {
      id: 3,
      title: "Miễn Phí Vận Chuyển",
      subtitle: "Cho đơn hàng từ 500k",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      cta: "Mua Sắm",
      badge: "Tiết kiệm"
    }
  ];

  const bottomBanners = [
    {
      id: 4,
      title: "Bộ Sưu Tập Xuân Hè",
      subtitle: "Tươi mới và năng động",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      cta: "Khám Phá"
    },
    {
      id: 5,
      title: "Thời Trang Nam",
      subtitle: "Phong cách lịch lãm",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      cta: "Xem Ngay"
    },
    {
      id: 6,
      title: "Phụ Kiện Cao Cấp",
      subtitle: "Hoàn thiện phong cách",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      cta: "Mua Ngay"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Flash Sale Banner */}
        <div className="mb-8">
          <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-r from-error to-warning shadow-product">
            <div className="absolute inset-0 bg-black/40" />
            <Image
              src={mainPromo?.image}
              alt={mainPromo?.title}
              className="w-full h-full object-cover mix-blend-overlay"
            />
            
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl mx-auto text-center px-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-error text-error-foreground text-sm font-bold mb-6 animate-pulse">
                  <Icon name="Zap" size={16} className="mr-2" />
                  FLASH SALE - {mainPromo?.discount} OFF
                </div>
                
                <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                  {mainPromo?.title}
                </h2>
                
                <p className="text-xl lg:text-2xl text-white/90 mb-2 font-medium">
                  {mainPromo?.subtitle}
                </p>
                
                <p className="text-lg text-white/80 mb-8">
                  {mainPromo?.description}
                </p>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-white">23</div>
                    <div className="text-xs text-white/80">Giờ</div>
                  </div>
                  <div className="text-white text-2xl">:</div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-white">45</div>
                    <div className="text-xs text-white/80">Phút</div>
                  </div>
                  <div className="text-white text-2xl">:</div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-xs text-white/80">Giây</div>
                  </div>
                </div>
                
                <Link to="/product-catalog">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8">
                    {mainPromo?.cta}
                    <Icon name="ShoppingBag" size={20} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Side Promotional Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {sidePromos?.map((promo) => (
            <div
              key={promo?.id}
              className="relative h-[250px] rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 to-primary/20 shadow-elegant hover:shadow-product transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-black/30" />
              <Image
                src={promo?.image}
                alt={promo?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              <div className="absolute top-4 left-4">
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {promo?.badge}
                </span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {promo?.title}
                </h3>
                <p className="text-white/90 mb-4">
                  {promo?.subtitle}
                </p>
                <Link to="/product-catalog">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    {promo?.cta}
                    <Icon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Collection Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bottomBanners?.map((banner) => (
            <Link
              key={banner?.id}
              to="/product-catalog"
              className="group relative h-[300px] rounded-2xl overflow-hidden shadow-elegant hover:shadow-product transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <Image
                src={banner?.image}
                alt={banner?.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                  {banner?.title}
                </h3>
                <p className="text-white/80 mb-4">
                  {banner?.subtitle}
                </p>
                <div className="flex items-center gap-2 text-accent">
                  <span className="font-medium">{banner?.cta}</span>
                  <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;