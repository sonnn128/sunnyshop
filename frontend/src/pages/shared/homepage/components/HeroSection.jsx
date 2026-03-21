import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import { Carousel, Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  const heroSlides = [
    {
      id: 1,
      title: "Bộ Sưu Tập Thu Đông",
      subtitle: "Autumn Winter 2024",
      description: "Sự kết hợp tinh tế giữa chất liệu cao cấp và đường nét tối giản, mang lại vẻ đẹp thanh lịch vượt thời gian.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
      cta: "Khám Phá Ngay",
    },
    {
      id: 2,
      title: "Thời Trang Haute Couture",
      subtitle: "The Elegance",
      description: "Sang trọng trong từng chuyển động. Kiệt tác thời trang dành cho sự kiện đặc biệt.",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2126&auto=format&fit=crop",
      cta: "Mua Sắm Ngay",
    },
    {
      id: 3,
      title: "Phong Cách Tối Giản",
      subtitle: "Minimalist Essentials",
      description: "Đơn giản là đỉnh cao của sự tinh tế. Lựa chọn hoàn hảo cho phong cách thường nhật.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      cta: "Xem Bộ Sưu Tập",
    }
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50">
      <Carousel autoplay effect="fade" dotPlacement="bottom" speed={1500} autoplaySpeed={5000} className="h-[70vh] lg:h-[85vh]">
        {heroSlides?.map((slide) => (
          <div key={slide.id} className="relative h-[70vh] lg:h-[85vh]">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
                <span className="uppercase tracking-[0.3em] font-medium text-white/90 text-sm mb-4">
                  {slide.subtitle}
                </span>
                
                <h1 className="font-serif text-5xl md:text-6xl text-white font-light tracking-wide mb-6">
                  {slide.title}
                </h1>
                
                <p className="text-white/80 text-lg font-light max-w-2xl mb-10 leading-relaxed">
                  {slide.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link 
                    to="/product-catalog" 
                    className="inline-flex items-center justify-center px-10 py-4 bg-white text-slate-900 font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:bg-slate-900 hover:text-white border border-transparent hover:border-white"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Trust Signals */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-white/90 text-sm font-light tracking-wide">
            <div className="flex items-center gap-3">
              <Icon name="Shield" size={18} className="text-white/70" />
              <span className="uppercase">Thanh toán bảo mật</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Truck" size={18} className="text-white/70" />
              <span className="uppercase">Giao hàng toàn quốc</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="RotateCcw" size={18} className="text-white/70" />
              <span className="uppercase">Đổi trả 30 ngày</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Star" size={18} className="text-white/70" />
              <span className="uppercase">Sản phẩm chính hãng</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;