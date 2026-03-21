import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import Button from '@/components/ui/Button';

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
          <div className="relative h-[50vh] min-h-[400px] lg:min-h-[600px] overflow-hidden bg-slate-900 flex items-center justify-center text-center">
            <Image
              src={mainPromo?.image}
              alt={mainPromo?.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
            />
            
            <div className="relative z-10 max-w-3xl px-6 flex flex-col items-center">
              <span className="uppercase tracking-[0.3em] text-xs font-medium text-white/90 mb-6 border border-white/30 px-4 py-1.5">
                Chỉ Còn Hôm Nay
              </span>
              
              <h2 className="text-5xl lg:text-7xl font-serif text-white mb-6 font-light tracking-wider">
                {mainPromo?.title}
              </h2>
              
              <p className="text-lg lg:text-xl text-white/80 font-light mb-12 tracking-wide uppercase">
                {mainPromo?.subtitle} - {mainPromo?.discount} OFF
              </p>

              {/* Countdown Timer */}
              <div className="flex items-center justify-center gap-6 mb-12 font-serif text-white/90">
                <div className="flex flex-col items-center">
                  <div className="text-4xl lg:text-5xl font-light">23</div>
                  <div className="text-[10px] uppercase tracking-widest mt-2 text-white/50">Giờ</div>
                </div>
                <div className="text-3xl font-light text-white/30 mb-5">:</div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl lg:text-5xl font-light">45</div>
                  <div className="text-[10px] uppercase tracking-widest mt-2 text-white/50">Phút</div>
                </div>
                <div className="text-3xl font-light text-white/30 mb-5">:</div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl lg:text-5xl font-light">12</div>
                  <div className="text-[10px] uppercase tracking-widest mt-2 text-white/50">Giây</div>
                </div>
              </div>
              
              <Link to="/product-catalog">
                <button className="inline-flex items-center justify-center px-10 py-4 bg-white text-slate-900 font-medium text-sm tracking-widest uppercase hover:bg-slate-100 transition-all duration-300">
                  {mainPromo?.cta}
                  <Icon name="ArrowRight" size={16} className="ml-3" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Side Promotional Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {sidePromos?.map((promo) => (
            <div
              key={promo?.id}
              className="relative h-[300px] overflow-hidden bg-slate-100 group"
            >
              <Image
                src={promo?.image}
                alt={promo?.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              
              <div className="absolute top-6 left-6">
                <span className="bg-white text-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-transparent">
                  {promo?.badge}
                </span>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl font-serif font-light mb-2 tracking-wide">
                  {promo?.title}
                </h3>
                <p className="text-white/80 text-sm font-light uppercase tracking-widest mb-6 border-b border-white/20 pb-4 inline-block">
                  {promo?.subtitle}
                </p>
                <Link to="/product-catalog" className="flex items-center text-xs font-semibold uppercase tracking-widest text-white/90 hover:text-white transition-colors">
                  {promo?.cta}
                  <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
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
              className="group relative h-[400px] overflow-hidden bg-slate-100"
            >
              <Image
                src={banner?.image}
                alt={banner?.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {banner?.subtitle}
                </p>
                <h3 className="text-2xl font-serif font-light mb-4 tracking-wide group-hover:text-blue-200 transition-colors">
                  {banner?.title}
                </h3>
                <div className="flex items-center text-xs font-medium uppercase tracking-widest text-white mt-4 border-t border-white/20 pt-4">
                  <span>{banner?.cta}</span>
                  <Icon name="ArrowRight" size={14} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
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