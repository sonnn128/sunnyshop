import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';
import cart from '../../../lib/cart';
import API from '../../../lib/api';
import { resolveQuickVariantSelection } from '../../../lib/productVariants';

const ProductCarousel = ({ title, subtitle, products, sectionId }) => {
  const toast = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const carouselRef = useRef(null);
  const itemsPerView = 4;

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const selection = await resolveQuickVariantSelection(product);
      const productId = product?.id || product?._id || selection.productId;

      await cart.addItem({
        productId,
        name: product.name,
        price: selection.price || product.salePrice || product.price,
        quantity: 1,
        image: product.image,
        selectedSize: selection.selectedSize,
        selectedColor: selection.selectedColor,
        variant_id: selection.variantId
      });
      toast.push({
        title: 'Thành công!',
        message: `Đã thêm "${product.name}" vào giỏ hàng`,
        type: 'success'
      });
    } catch (e) {
      toast.push({
        title: 'Lỗi!',
        message: 'Không thể thêm sản phẩm vào giỏ hàng',
        type: 'error'
      });
    }
  };

  const handleWishlistToggle = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isWishlisted = wishlistedProducts.includes(product.id);
    
    // Optimistically update UI
    setWishlistedProducts(prev => 
      isWishlisted 
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );

    try {
      if (isWishlisted) {
        await API.post('/api/wishlist/remove', { product_id: product.id });
        toast.push({
          title: 'Đã xóa',
          message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
          type: 'info'
        });
      } else {
        await API.post('/api/wishlist/add', {
          product_id: product.id,
          snapshot: {
            name: product.name,
            image: product.image,
            price: product.salePrice || product.price
          }
        });
        toast.push({
          title: 'Đã thêm vào yêu thích!',
          message: `"${product.name}" đã được thêm vào danh sách yêu thích`,
          type: 'success'
        });
      }
    } catch (e) {
      // Revert on error
      setWishlistedProducts(prev => 
        isWishlisted 
          ? [...prev, product.id]
          : prev.filter(id => id !== product.id)
      );
      toast.push({
        title: 'Lỗi!',
        message: 'Không thể cập nhật danh sách yêu thích',
        type: 'error'
      });
    }
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, products?.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, products?.length, itemsPerView]);

  const nextSlide = () => {
    const maxIndex = Math.max(0, products?.length - itemsPerView);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, products?.length - itemsPerView);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-16 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl lg:text-4xl font-serif text-slate-900 mb-2 font-light tracking-wide uppercase">
              {title}
            </h2>
            <p className="text-base font-light text-slate-500 tracking-wide">
              {subtitle}
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={prevSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className="w-12 h-12 flex items-center justify-center border border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all duration-300"
            >
              <Icon name="ChevronLeft" size={20} strokeWidth={1} />
            </button>
            <button
              onClick={nextSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className="w-12 h-12 flex items-center justify-center border border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all duration-300"
            >
              <Icon name="ChevronRight" size={20} strokeWidth={1} />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {products?.map((product) => (
              <div
                key={product?.id}
                className="w-1/4 flex-shrink-0 px-3"
              >
                <div className="bg-transparent group cursor-pointer">
                  {/* Product Image */}
                  <Link to={`/product-detail?id=${product?.id}`} className="relative aspect-[3/4] overflow-hidden block bg-slate-50">
                    <Image
                      src={product?.image}
                      alt={product?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    
                    {/* Dark overly on hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product?.isNew && (
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-900 border border-slate-200">
                          Mới
                        </span>
                      )}
                      {product?.discount && (
                        <span className="bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                          -{product?.discount}%
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={(e) => handleWishlistToggle(product, e)}
                        className={`w-10 h-10 bg-white shadow-sm flex items-center justify-center transition-all hover:bg-slate-900 hover:text-white ${
                          wishlistedProducts.includes(product.id)
                            ? 'text-red-500'
                            : 'text-slate-600'
                        }`}
                      >
                        <Icon 
                          name="Heart" 
                          size={18} 
                          strokeWidth={1.5}
                          className={wishlistedProducts.includes(product.id) ? 'fill-current' : ''}
                        />
                      </button>
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="w-10 h-10 bg-white text-slate-600 shadow-sm flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                        <Icon name="Eye" size={18} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Quick Add to Cart */}
                    <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-500">
                      <Button 
                        size="lg" 
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none py-5 tracking-widest uppercase text-xs font-semibold"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        Thêm vào giỏ
                      </Button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="pt-5 pb-2 text-center">
                    <div className="mb-2 uppercase tracking-widest text-[10px] text-slate-500 font-semibold">
                      {product?.category}
                    </div>
                    
                    <Link to={`/product-detail?id=${product?.id}`} className="block">
                      <h3 className="font-serif text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {product?.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-base font-medium text-slate-900">
                        {formatPrice(product?.price)}
                      </span>
                      {product?.originalPrice && (
                        <span className="text-sm text-slate-400 line-through font-light">
                          {formatPrice(product?.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Variant badges */}
                    {product?.availableSizes && product?.availableSizes.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Size:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.availableSizes.map((size) => (
                            <span
                              key={size}
                              className="px-2 py-0.5 text-xs border border-border rounded-full bg-muted"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {product?.availableColors && product?.availableColors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Màu:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.availableColors.map((color, index) => {
                            const label = typeof color === 'string'
                              ? color
                              : (color?.name || color?.value || `Màu ${index + 1}`);
                            const swatch = typeof color === 'string'
                              ? color
                              : (color?.color || color?.value || '#e5e5e5');
                            return (
                              <span
                                key={`${label}-${index}`}
                                className="flex items-center gap-1 px-2 py-0.5 text-xs border border-border rounded-full bg-muted"
                              >
                                <span
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{ backgroundColor: swatch }}
                                />
                                <span>{label}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-center gap-4 mt-8">
          <button
            onClick={prevSlide}
            className="w-12 h-12 border border-slate-200 text-slate-500 flex items-center justify-center hover:border-slate-900 hover:text-slate-900 transition-all duration-300"
          >
            <Icon name="ChevronLeft" size={20} strokeWidth={1.5} />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 border border-slate-200 text-slate-500 flex items-center justify-center hover:border-slate-900 hover:text-slate-900 transition-all duration-300"
          >
            <Icon name="ChevronRight" size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/product-catalog">
            <button className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-slate-900 text-slate-900 font-medium text-sm tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-all duration-300">
              Xem Tất Cả
              <Icon name="ArrowRight" size={16} className="ml-3" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;