import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { Carousel, Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "Bộ Sưu Tập Thu Đông 2024",
      subtitle: "Khám phá phong cách thời trang mới nhất",
      description: "Từ áo khoác ấm áp đến váy dạ tiệc sang trọng, tìm kiếm trang phục hoàn hảo cho mùa thu đông này.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Khám Phá Ngay",
      discount: "Giảm 30%"
    },
    {
      id: 2,
      title: "Thời Trang Công Sở Hiện Đại",
      subtitle: "Tự tin trong mọi cuộc họp",
      description: "Bộ sưu tập áo sơ mi, blazer và quần tây chuyên nghiệp dành cho phụ nữ hiện đại.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
      cta: "Mua Sắm Ngay",
      discount: "Miễn Phí Ship"
    },
    {
      id: 3,
      title: "Phong Cách Casual Trendy",
      subtitle: "Thoải mái mà vẫn thời trang",
      description: "Áo thun, quần jeans và sneakers cho những ngày cuối tuần thoải mái.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Xem Thêm",
      discount: "Mua 2 Tặng 1"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
      <Carousel autoplay effect="fade" dotPosition="bottom" className="h-[600px] lg:h-[700px]">
        {heroSlides?.map((slide) => (
          <div key={slide.id} className="relative h-[600px] lg:h-[700px]">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium mb-4">
                    <Icon name="Sparkles" size={16} className="mr-2" />
                    {slide.discount}
                  </div>
                  
                  <Title style={{ color: 'white', fontSize: '3rem', lineHeight: 1.2, marginBottom: 16 }}>
                    {slide.title}
                  </Title>
                  
                  <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.5rem', fontWeight: 500, marginBottom: 8 }}>
                    {slide.subtitle}
                  </Paragraph>
                  
                  <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', marginBottom: 32 }}>
                    {slide.description}
                  </Paragraph>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/product-catalog">
                      <Button type="primary" size="large" style={{ display: 'flex', alignItems: 'center' }}>
                        {slide.cta}
                        <Icon name="ArrowRight" size={18} className="ml-2" />
                      </Button>
                    </Link>
                    
                    <Button ghost size="large" style={{ display: 'flex', alignItems: 'center' }}>
                      Xem Video
                      <Icon name="Play" size={18} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Trust Signals */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-white text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={16} />
              <span>Thanh toán bảo mật</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Truck" size={16} />
              <span>Giao hàng miễn phí</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="RotateCcw" size={16} />
              <span>Đổi trả 30 ngày</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Headphones" size={16} />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;