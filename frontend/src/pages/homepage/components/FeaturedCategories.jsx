import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FeaturedCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Áo Khoác",
      description: "Ấm áp và thời trang",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      itemCount: "120+ sản phẩm",
      trending: true
    },
    {
      id: 2,
      name: "Váy Đầm",
      description: "Thanh lịch và quyến rũ",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      itemCount: "85+ sản phẩm",
      trending: false
    },
    {
      id: 3,
      name: "Áo Sơ Mi",
      description: "Chuyên nghiệp và hiện đại",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      itemCount: "95+ sản phẩm",
      trending: true
    },
    {
      id: 4,
      name: "Quần Jeans",
      description: "Thoải mái mọi lúc",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      itemCount: "75+ sản phẩm",
      trending: false
    },
    {
      id: 5,
      name: "Phụ Kiện",
      description: "Hoàn thiện phong cách",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      itemCount: "150+ sản phẩm",
      trending: true
    },
    {
      id: 6,
      name: "Giày Dép",
      description: "Bước chân tự tin",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      itemCount: "110+ sản phẩm",
      trending: false
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Danh Mục Nổi Bật
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá các danh mục thời trang hot nhất với hàng trăm sản phẩm chất lượng cao
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <Link
              key={category?.id}
              to="/product-catalog"
              className="group relative overflow-hidden rounded-2xl bg-card shadow-elegant hover:shadow-product transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={category?.image}
                  alt={category?.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Trending Badge */}
                {category?.trending && (
                  <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Icon name="TrendingUp" size={14} />
                    Trending
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {category?.name}
                </h3>
                <p className="text-white/80 mb-3">
                  {category?.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">
                    {category?.itemCount}
                  </span>
                  <div className="flex items-center gap-1 text-accent">
                    <span className="text-sm font-medium">Xem thêm</span>
                    <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/product-catalog">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Xem Tất Cả Danh Mục
              <Icon name="Grid3X3" size={20} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;