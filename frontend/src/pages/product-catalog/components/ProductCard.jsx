import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useWishlist } from '../../../contexts/WishlistContext';
import { summarizeVariantOptions } from '../../../lib/productVariants';

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
      className="group relative bg-card rounded-lg overflow-hidden shadow-elegant hover:shadow-product transition-smooth"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product-detail?id=${product?.id}`} className="block relative">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={resolvedImage}
            alt={product?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
          
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
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product?.isNew && (
              <span className="px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded">
                Mới
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded">
                -{discount}%
              </span>
            )}
            {product?.isBestseller && (
              <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
                Bán chạy
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`absolute top-2 right-2 flex flex-col space-y-2 transition-smooth ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlistClick}
              className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm ${
                isWishlisted ? 'text-error' : 'text-foreground'
              }`}
            >
              <Icon 
                name="Heart" 
                size={16}
                className={isWishlisted ? 'fill-current' : ''}
              />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickView}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm text-foreground"
            >
              <Icon name="Eye" size={16} />
            </Button>
          </div>

          {/* Quick Add to Cart */}
          <div className={`absolute bottom-2 left-2 right-2 transition-smooth ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddToCart}
              className="w-full"
              iconName="ShoppingCart"
              iconPosition="left"
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </Link>
      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product-detail?id=${product?.id}`}>
          {/* Brand */}
          <p className="text-sm text-muted-foreground mb-1">{product?.brand}</p>
          
          {/* Product Name */}
          <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-smooth">
            {product?.name}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-foreground">
              {formatPrice(product?.price)}
            </span>
            {product?.originalPrice && product?.originalPrice > product?.price && (
              <span className="text-xs text-red-500 line-through">
                {formatPrice(product?.originalPrice)}
              </span>
            )}
          </div>

          {/* Available Sizes */}
          {sizeOptions.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-muted-foreground">Size:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {sizeOptions.map((size) => (
                  <span
                    key={size}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Colors */}
          {product?.availableColors && product?.availableColors?.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Màu:</span>
              <div className="flex flex-wrap gap-1 mt-1">
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
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted border border-border"
                      title={label}
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
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;