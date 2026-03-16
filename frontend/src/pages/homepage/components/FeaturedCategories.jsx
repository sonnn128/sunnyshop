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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif text-slate-900 mb-4 font-light tracking-wide uppercase">
            Danh Mục Nổi Bật
          </h2>
          <div className="w-16 h-0.5 bg-slate-900 mx-auto mb-6"></div>
          <p className="text-base text-slate-500 max-w-2xl mx-auto font-light tracking-wide">
            Khám phá các danh mục thời trang hot nhất với hàng trăm sản phẩm chất lượng cao
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <Link
              key={category?.id}
              to="/product-catalog"
              className="group relative overflow-hidden bg-slate-100 transition-all duration-500 hover:shadow-2xl"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <Image
                  src={category?.image}
                  alt={category?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Trending Badge */}
                {category?.trending && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest flex items-center gap-1">
                    <Icon name="TrendingUp" size={14} className="text-slate-900" />
                    Trending
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl font-serif font-light mb-2 tracking-wide text-white">
                  {category?.name}
                </h3>
                <p className="text-white/70 mb-4 font-light text-sm tracking-widest uppercase">
                  {category?.description}
                </p>
                <div className="flex items-center justify-between border-t border-white/20 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <span className="text-xs text-white/60 tracking-widest uppercase">
                    {category?.itemCount}
                  </span>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-xs font-medium tracking-widest uppercase">Khám phá</span>
                    <Icon name="ArrowRight" size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link to="/product-catalog">
            <button className="inline-flex items-center gap-3 px-10 py-4 bg-white border border-slate-900 text-slate-900 font-medium text-sm tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-all duration-300">
              Xem Tất Cả Danh Mục
              <Icon name="ArrowRight" size={16} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;