import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import Button from '@/components/ui/Button';
import { useWishlist } from '@/contexts/WishlistContext';
import { summarizeVariantOptions } from '@/lib/productVariants';

const normalizeSizeValue = (size) => {
  if (!size) return '';
  if (typeof size === 'string') return size.trim();
  if (typeof size === 'number') return String(size);
  if (typeof size === 'object') {
    return (size.value || size.name || size.label || size.title || '').trim();
  }
  return String(size);
};

const ProductCard = ({ product, onWishlistToggle, onQuickView, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist } = useWishlist();
  const imageList = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images
        .map((img) => {
          if (!img) return null;
          if (typeof img === 'string') return img;
          return img.image_url || img.imageUrl || img.url || null;
        })
        .filter(Boolean);
    }
    if (product?.primaryImage) return [product.primaryImage];
    if (product?.image) return [product.image];
    return [];
  }, [product]);
  const resolvedImage = imageList[currentImageIndex] || imageList[0] || null;
  const variantSummary = useMemo(() => summarizeVariantOptions(product) || { sizes: [], colors: [] }, [product]);
  const sizeOptions = useMemo(() => {
    const uniqueSizes = new Set();
    const addSize = (value) => {
      const normalized = normalizeSizeValue(value);
      if (normalized) uniqueSizes.add(normalized);
    };
    const collectFromArray = (values) => {
      if (!Array.isArray(values)) return;
      values.forEach(addSize);
    };

    collectFromArray(variantSummary?.sizes || []);
    collectFromArray(product?.availableSizes);
    collectFromArray(product?.sizes);

    if (Array.isArray(product?.variants)) {
      product.variants.forEach((variant) => {
        if (!variant) return;
        const candidate = variant.size
          || (variant.name === 'Size' ? variant.value : null)
          || (typeof variant.value === 'string' && !variant.name ? variant.value : null);
        addSize(candidate);
      });
    }

    return Array.from(uniqueSizes);
  }, [variantSummary, product?.availableSizes, product?.sizes, product?.variants]);

  // Check if product is in wishlist
  const isWishlisted = isInWishlist(product?._id || product?.id);

  const handleWishlistClick = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onWishlistToggle(product?.id || product?._id);
  };

  const handleQuickView = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onQuickView(product);
  };

  const handleAddToCart = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onAddToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.price < product?.originalPrice) {
      return Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div 
      className="group relative flex flex-col transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product-detail?id=${product?.id}`} className="block relative overflow-hidden bg-slate-100">
        <div className="aspect-[3/4]">
          <Image
            src={resolvedImage}
            alt={product?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          
          {/* Image Navigation Dots */}
          {imageList.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {imageList.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-smooth ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2 z-10">
            {product?.isNew && (
              <span className="bg-white text-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-transparent shadow-sm">
                Mới
              </span>
            )}
            {discount > 0 && (
              <span className="bg-slate-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                -{discount}%
              </span>
            )}
            {product?.isBestseller && (
              <span className="bg-white text-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-slate-200 shadow-sm">
                Best Seller
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`absolute top-4 right-4 flex flex-col space-y-3 transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          } z-10`}>
            <button
              onClick={handleWishlistClick}
              className={`w-10 h-10 bg-white flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors border border-transparent hover:border-slate-900 shadow-sm ${
                isWishlisted ? 'text-red-500' : 'text-slate-900'
              }`}
            >
              <Icon 
                name="Heart" 
                size={18}
                className={isWishlisted ? 'fill-current' : ''}
              />
            </button>
            
            <button
              onClick={handleQuickView}
              className="w-10 h-10 bg-white flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors shadow-sm"
            >
              <Icon name="Eye" size={18} />
            </button>
          </div>

          {/* Quick Add to Cart */}
          <div className={`absolute bottom-0 left-0 right-0 transition-all duration-500 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
          }`}>
            <button
              onClick={handleAddToCart}
              className="w-full bg-slate-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
            >
              <Icon name="ShoppingCart" size={16} />
              <span>Thêm vào giỏ</span>
            </button>
          </div>
        </div>
      </Link>
      {/* Product Info */}
      <div className="pt-5 pb-2 text-center">
        <Link to={`/product-detail?id=${product?.id}`}>
          {/* Brand */}
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">{product?.brand || 'SF Store'}</p>
          
          {/* Product Name */}
          <h3 className="font-serif text-lg text-slate-900 mb-3 truncate group-hover:text-slate-500 transition-colors">
            {product?.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-center space-x-3">
            <span className="font-medium text-slate-900">
              {formatPrice(product?.price)}
            </span>
            {product?.originalPrice && product?.originalPrice > product?.price && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product?.originalPrice)}
              </span>
            )}
          </div>

          {/* Available Sizes */}
          {sizeOptions.length > 0 && (
            <div className="mt-4 flex justify-center items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-900 tracking-widest hidden group-hover:block transition-all duration-300">
                Size
              </span>
              <div className="flex gap-2 text-[10px] text-slate-500 font-medium">
                {sizeOptions.map((size) => (
                  <span key={size} className="hover:text-slate-900 transition-colors">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Colors */}
          {product?.availableColors && product?.availableColors?.length > 0 && (
            <div className="mt-3 flex justify-center gap-2">
              {product.availableColors.map((color, index) => {
                const label = typeof color === 'string'
                  ? color
                  : (color?.name || color?.value || `Màu ${index + 1}`);
                const swatch = typeof color === 'string'
                  ? color
                  : (color?.color || color?.value || '#e5e5e5');
                const key = typeof color === 'object'
                  ? (color?.value || color?.name || index)
                  : `${color}-${index}`;
                return (
                  <span
                    key={key}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: swatch }}
                    title={label}
                  />
                );
              })}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;