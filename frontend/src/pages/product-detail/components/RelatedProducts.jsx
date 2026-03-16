import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';
import cart from '../../../lib/cart';
import API from '../../../lib/api';
import { resolveQuickVariantSelection, summarizeVariantOptions } from '../../../lib/productVariants';

const RelatedProducts = ({ products, title = "Sản phẩm liên quan" }) => {
  const toast = useToast();
  const [wishlistedProducts, setWishlistedProducts] = React.useState([]);
  const enrichedProducts = React.useMemo(() => {
    return (products || []).map((product) => {
      const { sizes = [], colors = [] } = summarizeVariantOptions(product) || {};
      return {
        ...product,
        availableSizes: sizes.length ? sizes : product?.availableSizes || product?.sizes || [],
        availableColors: colors.length ? colors : product?.availableColors || product?.colors || []
      };
    });
  }, [products]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

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

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <Link
          to="/product-catalog"
          className="text-accent hover:underline text-sm font-medium"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {enrichedProducts?.map((product) => (
          <div key={product?.id} className="group">
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-square mb-3">
              <Link to={`/product-detail?id=${product?.id}`}>
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                />
              </Link>
              
              {/* Quick Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth">
                <div className="flex flex-col space-y-1">
                  <button 
                    onClick={(e) => handleWishlistToggle(product, e)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-elegant transition-smooth ${
                      wishlistedProducts.includes(product.id)
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white/90 hover:bg-white text-gray-700'
                    }`}
                  >
                    <Icon 
                      name="Heart" 
                      size={14} 
                      className={wishlistedProducts.includes(product.id) ? 'fill-current' : ''}
                    />
                  </button>
                  <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-elegant transition-smooth">
                    <Icon name="Eye" size={14} />
                  </button>
                </div>
              </div>

              {/* Sale Badge */}
              {product?.originalPrice > product?.salePrice && (
                <div className="absolute top-2 left-2">
                  <span className="bg-error text-error-foreground px-2 py-1 rounded text-xs font-medium">
                    -{Math.round(((product?.originalPrice - product?.salePrice) / product?.originalPrice) * 100)}%
                  </span>
                </div>
              )}

              {/* Stock Status */}
              {product?.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white text-foreground px-3 py-1 rounded text-sm font-medium">
                    Hết hàng
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Link
                to={`/product-detail?id=${product?.id}`}
                className="block"
              >
                <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-accent transition-smooth">
                  {product?.name}
                </h3>
              </Link>

              <div className="flex items-center space-x-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={12}
                    className={i < Math.floor(product?.rating) ? 'text-accent fill-accent' : 'text-gray-300'}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  ({product?.reviewCount})
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(product?.salePrice)}
                  </span>
                  {product?.originalPrice > product?.salePrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(product?.originalPrice)}
                    </span>
                  )}
                </div>

                {product?.availableSizes && product.availableSizes.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wide">Size</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.availableSizes.map((size) => (
                        <span
                          key={size}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-muted border border-border"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product?.availableColors && product.availableColors.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wide">Màu</span>
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
                            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-muted border border-border"
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
              </div>

              {/* Quick Add to Cart */}
              <Button
                size="sm"
                variant="outline"
                className="w-full opacity-0 group-hover:opacity-100 transition-smooth"
                iconName="ShoppingCart"
                iconPosition="left"
                disabled={product?.stock === 0}
                onClick={(e) => handleAddToCart(product, e)}
              >
                {product?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;