import React, { useState, useEffect } from 'react';
import cart from '../../lib/cart'
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import RelatedProducts from './components/RelatedProducts';
import StylingTips from './components/StylingTips';
import RecentlyViewed from './components/RecentlyViewed';
import Icon from '../../components/AppIcon';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';
import ProductRecommendations from '../../components/ProductRecommendations';

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams?.get('id') || '1';
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);

  // No mock fallback; page will rely on API data only

  // map server product to UI-friendly shape (3NF support)
  const buildVariantKey = (size, color) => `${size || ''}_${color || ''}`;
  const extractColorValue = (colorInput) => {
    if (!colorInput) return '';
    if (typeof colorInput === 'string') return colorInput;
    if (typeof colorInput === 'object') {
      return colorInput.value || colorInput.name || colorInput.label || '';
    }
    return '';
  };
  const buildColorOption = (colorValue, source = {}, variant = {}) => ({
    name: source.name || source.label || colorValue,
    value: colorValue,
    code: source.code || source.color_code || source.colorCode || variant.color_code || variant.colorCode || '#dddddd',
    image: source.image || source.image_url || source.thumbnail || variant.image_url || null
  });

  const mapServerProductToUI = (p) => {
    if (!p) return null;
    
    // Extract sizes and colors from variants
    const sizes = [];
    const colors = [];
    const sizeAvailabilityCounter = {};
    const colorAvailabilityCounter = {};
    const variantsMap = {}; // Map để tra cứu variant theo size+color
    let totalVariantStock = 0;
    
    // 3NF: Variants giờ là array các objects từ ProductVariant collection
    // hoặc legacy embedded array
    if (p.variants && Array.isArray(p.variants)) {
      p.variants.forEach(variant => {
        const normalizedSize = variant.size || (variant.name === 'Size' ? variant.value : '') || '';
        const rawColor = variant.color;
        const normalizedColor = extractColorValue(rawColor) || (variant.name === 'Color' ? variant.value : '') || '';
        const safeStock = Number(variant.stock_quantity || variant.stock) || 0;
        const safePriceAdjustment = Number(variant.price_adjustment) || 0;

        // 3NF format: { size, color, stock_quantity, price_adjustment, ... }
        if (normalizedSize) {
          if (!sizes.includes(normalizedSize)) {
            sizes.push(normalizedSize);
          }
          sizeAvailabilityCounter[normalizedSize] = (sizeAvailabilityCounter[normalizedSize] || 0) + safeStock;
        }
        
        if (normalizedColor) {
          const existingColor = colors.find(c => (c.value || c.name) === normalizedColor);
          if (!existingColor) {
            colors.push(buildColorOption(normalizedColor, typeof rawColor === 'object' ? rawColor : {}, variant));
          } else {
            if (!existingColor.value) existingColor.value = normalizedColor;
            if (!existingColor.name) existingColor.name = normalizedColor;
          }
          colorAvailabilityCounter[normalizedColor] = (colorAvailabilityCounter[normalizedColor] || 0) + safeStock;
        }
        
        // Map variant theo size+color để lookup khi add to cart
        const key = buildVariantKey(normalizedSize, normalizedColor);
        variantsMap[key] = {
          ...variant,
          size: normalizedSize || null,
          color: normalizedColor || null,
          stock_quantity: safeStock,
          price_adjustment: safePriceAdjustment
        };
        totalVariantStock += safeStock;
        
        // Legacy format support: { name: 'Size', value: 'M' }
        if (variant.name === 'Size' && variant.value) {
          if (!sizes.includes(variant.value)) {
            sizes.push(variant.value);
          }
          sizeAvailabilityCounter[variant.value] = (sizeAvailabilityCounter[variant.value] || 0) + safeStock;
        } else if (variant.name === 'Color') {
          const existingColor = colors.find(c => c.name === variant.value);
          if (!existingColor) {
            colors.push({ name: variant.value, code: '#dddddd' });
          }
          colorAvailabilityCounter[variant.value] = (colorAvailabilityCounter[variant.value] || 0) + safeStock;
        }
      });
    }
    
    // Fallback to old format if variants not present
    const fallbackColors = (p.colors || []).map(c => {
      if (typeof c === 'string') {
        return { name: c, value: c, code: '#dddddd' };
      }
      const fallbackName = c?.name || c?.value || '';
      return {
        ...c,
        name: c?.name || fallbackName,
        value: c?.value || fallbackName,
        code: c?.code || c?.color_code || c?.colorCode || '#dddddd'
      };
    });
    const fallbackSizes = p.sizes || [];
    fallbackSizes.forEach(s => { 
      if (!sizes.includes(s)) sizes.push(s);
      if (!Object.prototype.hasOwnProperty.call(sizeAvailabilityCounter, s)) {
        sizeAvailabilityCounter[s] = Number(p.stock_quantity) || 0;
      }
    });
    fallbackColors.forEach(color => {
      const colorName = typeof color === 'string' ? color : (color?.name || color?.value);
      if (!colorName) return;
      if (!colors.find(c => (c.name || c.value) === colorName)) {
        if (typeof color === 'string') {
          colors.push({ name: colorName, value: colorName, code: '#dddddd' });
        } else {
          colors.push({
            ...color,
            name: color.name || color.value || colorName,
            value: color.value || color.name || colorName
          });
        }
      }
      if (!Object.prototype.hasOwnProperty.call(colorAvailabilityCounter, colorName)) {
        colorAvailabilityCounter[colorName] = Number(p.stock_quantity) || 0;
      }
    });
    
    const normalizedSizeAvailability = Object.fromEntries(
      Object.entries(sizeAvailabilityCounter).map(([key, value]) => [key, value > 0])
    );
    const normalizedColorAvailability = Object.fromEntries(
      Object.entries(colorAvailabilityCounter).map(([key, value]) => [key, value > 0])
    );
    
    const fallbackSizeAvailability = Object.keys(normalizedSizeAvailability).length
      ? normalizedSizeAvailability
      : fallbackSizes.reduce((acc, s) => ({ ...acc, [s]: true }), {});
    const fallbackColorAvailability = Object.keys(normalizedColorAvailability).length
      ? normalizedColorAvailability
      : fallbackColors.reduce((acc, c) => {
          const colorName = typeof c === 'string' ? c : (c?.name || c?.value);
          if (!colorName) return acc;
          acc[colorName] = true;
          return acc;
        }, {});
    
    const productStock = Number(p.stock_quantity) || 0;
    const aggregatedStock = totalVariantStock > 0 ? totalVariantStock : productStock;
    const status = p.status || 'active';
    const unavailableStatuses = ['inactive', 'out_of_stock', 'archived'];
    const isInStock = aggregatedStock > 0 && !unavailableStatuses.includes(status);
    
    // 3NF: Images có thể từ ProductImage collection hoặc legacy array
    const images = (p.images || []).map(img => {
      if (typeof img === 'string') return img;
      return img.image_url || img.url || img;
    });
    
    // 3NF: Brand có thể là object từ populate hoặc string legacy
    const brandName = typeof p.brand_id === 'object' 
      ? p.brand_id?.name 
      : (p.brand || '');
    
    return {
      ...p,
      id: p._id || p.id || p.sku,
      salePrice: p.price,
      originalPrice: p.original_price || p.price,
      images: images,
      colors: colors.length > 0 ? colors : fallbackColors,
      sizes: sizes.length > 0 ? sizes : fallbackSizes,
      sizeAvailability: Object.keys(fallbackSizeAvailability).length > 0 
        ? fallbackSizeAvailability 
        : { 'S': true, 'M': true, 'L': true },
      colorAvailability: fallbackColorAvailability,
      variantsMap: variantsMap, // Để tra cứu variant_id khi add to cart
      brand: brandName,
      totalVariantStock,
      totalStock: aggregatedStock,
      isInStock
    };
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await API.get(`/api/products/${productId}`);
        const p = res?.data?.product;
        if (p && mounted) setProduct(mapServerProductToUI(p));
      } catch (e) {
        // keep null on error (no mock)
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [productId]);

  const toast = useToast();

  const handleAddToCart = async (productData) => {
    try {
      await cart.addItem(productData);
      toast.push({ title: 'Thành công', message: 'Đã thêm sản phẩm vào giỏ hàng!', type: 'success' })
    } catch (e) {
      toast.push({ title: 'Lỗi', message: 'Không thể thêm sản phẩm vào giỏ hàng', type: 'error' })
    }
  }

  const handleAddToWishlist = () => {
    (async () => {
      try {
        if (!product) return;
        await API.post('/api/wishlist/add', { 
          product_id: product.id, 
          snapshot: { name: product.name, image: product?.image || product?.images?.[0], price: product.salePrice || product.price } 
        });
        toast.push({ title: 'Đã thêm', message: 'Đã thêm sản phẩm vào danh sách yêu thích!', type: 'success' });
      } catch (e) {
        const msg = e?.response?.data?.message || 'Không thể thêm vào danh sách yêu thích';
        toast.push({ title: 'Lỗi', message: msg, type: 'error' });
      }
    })();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <a href="/homepage" className="hover:text-foreground transition-smooth">Trang chủ</a>
            <Icon name="ChevronRight" size={16} />
            <a href="/product-catalog" className="hover:text-foreground transition-smooth">Sản phẩm</a>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground">Áo sơ mi nữ</span>
          </nav>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ProductImageGallery 
              images={(product?.images && product.images.length) ? product.images : []} 
              productName={product?.name} 
            />
            <ProductInfo 
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>

          {/* Product Details Tabs */}
          <div className="mb-12">
            {product && <ProductTabs product={product} />}
          </div>

          {/* Styling Tips */}
          <div className="mb-12">
            {product && (
              <StylingTips 
                product={product}
                stylingTips={product.stylingTips || []}
              />
            )}
          </div>

          {/* Related Products and Recently Viewed */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3">
              {/* Product Recommendations */}
              {product && (
                <ProductRecommendations
                  productId={product._id}
                  title="Sản Phẩm Tương Tự"
                  limit={6}
                  showTrending={false}
                />
              )}
            </div>
            <div className="xl:col-span-1">
              {/* Recently viewed hidden when no API data */}
            </div>
          </div>
        </div>
      </div>
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        <button
          onClick={() => {
            if (!product) return;
            const firstSize = Array.isArray(product?.sizes) && product.sizes.length > 0 ? product.sizes[0] : null;
            const firstColorEntry = Array.isArray(product?.colors) && product.colors.length > 0 ? product.colors[0] : null;
            const firstColor = typeof firstColorEntry === 'string' ? firstColorEntry : (firstColorEntry?.name || firstColorEntry?.value || null);
            handleAddToCart({
              ...product,
              selectedSize: firstSize,
              selectedColor: firstColor,
              quantity: 1
            });
          }}
          className="w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-elegant flex items-center justify-center transition-smooth hover:scale-105"
        >
          <Icon name="ShoppingCart" size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;