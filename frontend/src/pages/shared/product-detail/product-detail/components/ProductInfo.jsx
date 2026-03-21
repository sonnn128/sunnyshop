import React, { useState, useEffect, useRef } from 'react';
import cart from '../../../lib/cart';
import { useToast } from '../../../components/ui/ToastProvider';
import { useWishlist } from '../../../contexts/WishlistContext';
import Icon from '../../../components/AppIcon';
import { validateStockForSelection } from '../../../lib/productVariants';

const UNAVAILABLE_STATUSES = ['inactive', 'out_of_stock', 'archived'];
const buildVariantKey = (size, color) => `${size || ''}_${color || ''}`;
const normalizeColorValue = (color) => (
  typeof color === 'string'
    ? color
    : (color?.value || color?.name || '')
);
const colorDisplayName = (color) => (
  typeof color === 'string'
    ? color
    : (color?.label || color?.name || color?.value || '')
);

const ProductInfo = ({ product, onAddToWishlist }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isValidatingQuantity, setIsValidatingQuantity] = useState(false);
  const toast = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const quantityValidationTimeoutRef = useRef(null);
  const lastQuantityValidationRef = useRef({ key: null, success: false });
  const productIdentifier = product?._id || product?.id || product?.product_id || null;

  // Check if product is in wishlist
  const isWishlisted = isInWishlist(product?._id || product?.id);

  const sizes = product?.sizes || [];
  const colors = product?.colors || [];
  const sizeAvailability = product?.sizeAvailability || {};
  const colorAvailability = product?.colorAvailability || {};
  const variantsMap = product?.variantsMap || {};
  const variantEntries = Object.values(variantsMap || {});
  const hasVariantData = variantEntries.length > 0;
  const hasSizeOptions = sizes.length > 0;
  const hasColorOptions = colors.length > 0;

  const getVariantStock = (variant) => Number(variant?.stock_quantity ?? variant?.stock ?? 0);
  const findFirstAvailableVariant = () => variantEntries.find(v => getVariantStock(v) > 0) || variantEntries[0] || null;
  const findAvailableColorForSize = (size) => {
    if (!size || !hasVariantData) return null;
    const match = variantEntries.find(v => v.size === size && getVariantStock(v) > 0);
    return match?.color || null;
  };
  const findAvailableSizeForColor = (colorValue) => {
    if (!hasVariantData) return null;
    const normalizedColor = colorValue || '';
    const match = variantEntries.find(v => (v.color || '') === normalizedColor && getVariantStock(v) > 0);
    return match?.size || null;
  };
  const ensureColorForSize = (size, currentColor) => {
    if (!hasVariantData || !hasColorOptions) return currentColor;
    if (!size) return currentColor;
    if (currentColor) {
      const variant = variantsMap[buildVariantKey(size, currentColor)] || null;
      if (variant && getVariantStock(variant) > 0) return currentColor;
    }
    return findAvailableColorForSize(size) || '';
  };
  const ensureSizeForColor = (colorValue, currentSize) => {
    if (!hasVariantData || !hasSizeOptions) return currentSize;
    if (!colorValue) return currentSize;
    if (currentSize) {
      const variant = variantsMap[buildVariantKey(currentSize, colorValue)] || null;
      if (variant && getVariantStock(variant) > 0) return currentSize;
    }
    return findAvailableSizeForColor(colorValue) || currentSize;
  };
  const isSizeSelectable = (size) => {
    if (!size) return false;
    if (hasVariantData) {
      if (hasColorOptions && selectedColor) {
        const variant = variantsMap[buildVariantKey(size, selectedColor)] || null;
        return variant ? getVariantStock(variant) > 0 : false;
      }
      return variantEntries.some(v => v.size === size && getVariantStock(v) > 0);
    }
    return sizeAvailability[size] !== false;
  };
  const isColorSelectable = (colorValue) => {
    if (!colorValue) return false;
    if (hasVariantData) {
      if (hasSizeOptions && selectedSize) {
        const variant = variantsMap[buildVariantKey(selectedSize, colorValue)] || null;
        return variant ? getVariantStock(variant) > 0 : false;
      }
      return variantEntries.some(v => (v.color || '') === colorValue && getVariantStock(v) > 0);
    }
    return colorAvailability[colorValue] !== false;
  };
  const getColorLabelByValue = (value) => {
    if (!value) return '';
    const matched = colors.find(color => normalizeColorValue(color) === value);
    return matched ? colorDisplayName(matched) : value;
  };

  // Auto-select valid variant combination when product loads
  useEffect(() => {
    if (!product) return;
    if (hasVariantData) {
      const initialVariant = findFirstAvailableVariant();
      const nextSize = initialVariant?.size || (hasSizeOptions ? sizes[0] : '');
      const nextColor = hasColorOptions
        ? (initialVariant?.color || normalizeColorValue(colors[0]))
        : '';
      setSelectedSize(nextSize || '');
      setSelectedColor(nextColor || '');
    } else {
      const defaultSize = hasSizeOptions ? sizes[0] : '';
      const defaultColor = hasColorOptions ? normalizeColorValue(colors[0]) : '';
      setSelectedSize(defaultSize || '');
      setSelectedColor(defaultColor || '');
    }
  }, [product?.id]);

  const computeCurrentStockInfo = () => {
    const baseStock = Number(product?.totalStock ?? product?.stock_quantity ?? 0);
    if (!hasVariantData) {
      return { stock: baseStock, source: 'product', variant: null };
    }

    if (hasSizeOptions && selectedSize && (!hasColorOptions || selectedColor !== '')) {
      const key = buildVariantKey(selectedSize, selectedColor || '');
      const matchedVariant = variantsMap[key];
      if (matchedVariant) {
        return {
          stock: getVariantStock(matchedVariant),
          source: 'variant',
          variant: matchedVariant
        };
      }
      if (hasColorOptions && selectedColor) {
        return { stock: 0, source: 'variant', variant: null };
      }
    }

    if (!hasSizeOptions && hasColorOptions && selectedColor) {
      const key = buildVariantKey('', selectedColor);
      const matchedColorVariant = variantsMap[key];
      if (matchedColorVariant) {
        return {
          stock: getVariantStock(matchedColorVariant),
          source: 'variant',
          variant: matchedColorVariant
        };
      }
      return { stock: 0, source: 'variant', variant: null };
    }

    if (selectedSize) {
      const sizeStock = variantEntries.reduce((sum, variant) => (
        variant.size === selectedSize ? sum + getVariantStock(variant) : sum
      ), 0);
      if (sizeStock) {
        return { stock: sizeStock, source: 'size', variant: null };
      }
    }

    if (selectedColor) {
      const colorStock = variantEntries.reduce((sum, variant) => (
        (variant.color || '') === selectedColor ? sum + getVariantStock(variant) : sum
      ), 0);
      if (colorStock) {
        return { stock: colorStock, source: 'color', variant: null };
      }
    }

    const totalVariantStock = variantEntries.reduce((sum, variant) => sum + getVariantStock(variant), 0);
    return { stock: totalVariantStock || baseStock, source: 'variant', variant: null };
  };

  const currentStockInfo = computeCurrentStockInfo();
  const isInStock = currentStockInfo.stock > 0 && !UNAVAILABLE_STATUSES.includes(product?.status);
  const maxSelectableQuantity = currentStockInfo.stock > 0
    ? Math.min(currentStockInfo.stock, 99)
    : 99;

  useEffect(() => {
    if (!productIdentifier) return;
    if (typeof quantity !== 'number' || quantity < 1) return;

    const variantKey = buildVariantKey(selectedSize, selectedColor || '');
    const matchedVariant = product?.variantsMap ? product.variantsMap[variantKey] : null;
    const selectedVariantId = matchedVariant?._id || matchedVariant?.id || null;
    const validationKey = `${productIdentifier}::${selectedSize || ''}::${selectedColor || ''}::${quantity}`;

    if (
      lastQuantityValidationRef.current?.success &&
      lastQuantityValidationRef.current.key === validationKey
    ) {
      return;
    }

    if (quantityValidationTimeoutRef.current) {
      clearTimeout(quantityValidationTimeoutRef.current);
    }

    quantityValidationTimeoutRef.current = setTimeout(async () => {
      setIsValidatingQuantity(true);
      try {
        const result = await validateStockForSelection({
          productId: productIdentifier,
          quantity,
          variantId: selectedVariantId,
          size: selectedSize || null,
          color: selectedColor || null
        });

        if (result.success) {
          lastQuantityValidationRef.current = { key: validationKey, success: true };
          return;
        }

        const fallbackQuantity = typeof result.availableQuantity === 'number'
          ? Math.max(1, result.availableQuantity)
          : Math.max(1, currentStockInfo.stock || 1);

        if (fallbackQuantity !== quantity) {
          setQuantity(fallbackQuantity);
        }

        lastQuantityValidationRef.current = {
          key: `${productIdentifier}::${selectedSize || ''}::${selectedColor || ''}::${fallbackQuantity}`,
          success: true
        };

        toast.push({
          title: 'Số lượng không đủ',
          message: result.message || `Hiện chỉ còn ${fallbackQuantity} sản phẩm trong kho`,
          type: 'warning'
        });
      } catch (error) {
        console.error('[ProductDetail] Không thể kiểm tra tồn kho', error);
      } finally {
        setIsValidatingQuantity(false);
      }
    }, 500);

    return () => {
      if (quantityValidationTimeoutRef.current) {
        clearTimeout(quantityValidationTimeoutRef.current);
      }
    };
  }, [
    quantity,
    selectedSize,
    selectedColor,
    productIdentifier,
    currentStockInfo.stock,
    product?.variantsMap,
    toast
  ]);

  const handleSizeChange = (size) => {
    if (!size) return;
    setSelectedSize(size);
    let adjustedColor = selectedColor;
    if (hasColorOptions) {
      adjustedColor = ensureColorForSize(size, selectedColor);
      if (adjustedColor !== selectedColor) {
        setSelectedColor(adjustedColor);
      }
    }
    
    // 3NF: Lookup variant từ variantsMap hoặc variants array
    if (product?.variantsMap) {
      const key = `${size}_${adjustedColor || ''}`;
      const variant = product.variantsMap[key];
      if (variant && typeof variant.price_adjustment === 'number') {
        console.log('[ProductDetail 3NF] Size change price impact:', {
          from: selectedSize,
          to: size,
          basePrice: product.price,
          adjustment: variant.price_adjustment,
          newPrice: product.price + variant.price_adjustment
        });
      }
    } else if (product?.variants && Array.isArray(product.variants)) {
      // Legacy format support
      const basePrice = product.price;
      const variant = product.variants.find(v => 
        (v.name === 'Size' && v.value === size) || v.size === size
      );
      
      if (variant && typeof variant.price_adjustment === 'number') {
        console.log('[ProductDetail] Size change price impact:', {
          from: selectedSize,
          to: size,
          basePrice,
          adjustment: variant.price_adjustment,
          newPrice: basePrice + variant.price_adjustment
        });
      }
    }
  };

  const handleColorChange = (color) => {
    if (!color) return;
    setSelectedColor(color);
    let adjustedSize = selectedSize;
    if (hasSizeOptions) {
      adjustedSize = ensureSizeForColor(color, selectedSize);
      if (adjustedSize && adjustedSize !== selectedSize) {
        setSelectedSize(adjustedSize);
      }
    }
    
    // 3NF: Lookup variant từ variantsMap hoặc variants array
    if (product?.variantsMap) {
      const key = `${adjustedSize || ''}_${color}`;
      const variant = product.variantsMap[key];
      if (variant && typeof variant.price_adjustment === 'number') {
        console.log('[ProductDetail 3NF] Color change price impact:', {
          from: selectedColor,
          to: color,
          basePrice: product.price,
          adjustment: variant.price_adjustment,
          newPrice: product.price + variant.price_adjustment
        });
      }
    } else if (product?.variants && Array.isArray(product.variants)) {
      // Legacy format support
      const basePrice = product.price;
      const variant = product.variants.find(v => 
        (v.name === 'Color' && v.value === color) || v.color === color
      );
      
      if (variant && typeof variant.price_adjustment === 'number') {
        console.log('[ProductDetail] Color change price impact:', {
          from: selectedColor,
          to: color,
          basePrice,
          adjustment: variant.price_adjustment,
          newPrice: basePrice + variant.price_adjustment
        });
      }
    }
  };

  const handleQuantityChange = (change) => {
    const limit = maxSelectableQuantity || 99;
    const currentQty = typeof quantity === 'number' ? quantity : 1;
    const newQuantity = currentQty + change;
    if (newQuantity >= 1 && newQuantity <= limit) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    const desiredQuantity = typeof quantity === 'number' ? quantity : 1;
    const hasSizes = sizes.length > 0;
    const hasColors = colors.length > 0;
    const baseProductId = productIdentifier || product?.id;

    if (hasSizes && !selectedSize) {
      toast.push({
        title: 'Vui lòng chọn kích thước',
        message: 'Bạn cần chọn kích thước trước khi thêm vào giỏ hàng',
        type: 'warning'
      });
      return;
    }

    if (hasColors && !selectedColor) {
      toast.push({
        title: 'Vui lòng chọn màu sắc',
        message: 'Bạn cần chọn màu sắc trước khi thêm vào giỏ hàng',
        type: 'warning'
      });
      return;
    }

    if (!isInStock) {
      toast.push({
        title: 'Hết hàng',
        message: 'Sản phẩm hoặc biến thể này hiện đã hết hàng',
        type: 'warning'
      });
      return;
    }

    if (currentStockInfo.stock > 0 && desiredQuantity > currentStockInfo.stock) {
      toast.push({
        title: 'Không đủ hàng',
        message: `Chỉ còn ${currentStockInfo.stock} sản phẩm khả dụng`,
        type: 'warning'
      });
      setQuantity(Math.max(1, currentStockInfo.stock));
      return;
    }

    setIsAddingToCart(true);
    try {
      const imageUrl = product.images && product.images.length > 0 
        ? (product.images[0].image_url || product.images[0]) 
        : null;

      // Calculate variant-adjusted price
      const variantPrice = getVariantPrice();
      
      // Add variants information to pass along
      const variants = Array.isArray(product.variants)
        ? product.variants.map(v => ({
            _id: v._id || v.id || null,
            name: v.name || null,
            value: v.value || null,
            size: v.size || (v.name === 'Size' ? v.value : null),
            color: v.color || (v.name === 'Color' ? v.value : null),
            price_adjustment: Number(v.price_adjustment) || 0,
            stock_quantity: Number(v.stock_quantity || v.stock) || 0,
            sku: v.sku || null,
            image_url: v.image_url || null
          }))
        : [];
      
      // 3NF: Get variant_id if available
      const variantId = getSelectedVariantId();
      
      await cart.addItem({
        id: baseProductId,
        productId: baseProductId,
        name: product.name,
        price: variantPrice, // Use the variant-adjusted price
        image: imageUrl,
        selectedSize: selectedSize || null,
        // ensure we pass color as a string (name/value) for key matching
        selectedColor: (typeof selectedColor === 'string' ? selectedColor : (selectedColor?.name || selectedColor?.value)) || null,
        quantity: desiredQuantity,
        // 3NF: variant_id for database reference
        variant_id: variantId,
        // Add variants information for the cart (legacy support)
        variants: variants.length > 0 ? variants : null
      });

      toast.push({
        title: 'Thêm vào giỏ hàng thành công!',
        message: `${product.name} đã được thêm vào giỏ hàng`,
        type: 'success'
      });
      
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.push({
        title: 'Có lỗi xảy ra',
        message: 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!',
        type: 'error'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    const finalProductId = product?._id || product?.id;

    try {
      // Use wishlist context - pass complete snapshot with size, color, stock
      const wasAdded = await toggleWishlist(finalProductId, {
        name: product?.name,
        brand: product?.brand,
        image: product?.images?.[0]?.image_url || product?.images?.[0] || product?.image,
        price: product?.price,
        originalPrice: product?.originalPrice,
        category: product?.category,
        // Add selected size and color
        size: selectedSize || null,
        color: selectedColor || null,
        // Add stock info
        stock_quantity: product?.stock_quantity || 0,
        status: product?.status || 'active'
      });

      // Show toast
      if (wasAdded) {
        toast.push({
          title: 'Đã thêm vào yêu thích!',
          message: `"${product?.name}" đã được thêm vào danh sách yêu thích`,
          type: 'success'
        });
      } else {
        toast.push({
          title: 'Đã xóa',
          message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
          type: 'info'
        });
      }
      
      // DO NOT call parent callback to avoid duplicate toast
      // if (onAddToWishlist) {
      //   onAddToWishlist();
      // }
    } catch (error) {
      console.error('[ProductInfo Wishlist Error]', error.response?.data || error.message);
      toast.push({
        title: 'Lỗi!',
        message: error.response?.data?.message || 'Không thể cập nhật danh sách yêu thích',
        type: 'error'
      });
    }
  };

  // Calculate the price with variant adjustments (3NF support)
  const getSelectedVariant = () => {
    if (!product?.variantsMap) return null;
    const key = buildVariantKey(selectedSize, selectedColor);
    return product.variantsMap[key] || null;
  };

  const getVariantPrice = () => {
    // Base price
    const basePrice = product?.price || 0;
    
    // 3NF: Use variantsMap for lookup
    if (product?.variantsMap) {
      const variant = getSelectedVariant();
      
      if (variant && typeof variant.price_adjustment === 'number') {
        const finalPrice = basePrice + variant.price_adjustment;
        console.log('[ProductDetail 3NF] Applied price adjustment:', {
          basePrice,
          adjustment: variant.price_adjustment,
          finalPrice,
          variant: { size: variant.size, color: variant.color }
        });
        return finalPrice;
      }
    }
    
    // Legacy format support
    if (!product?.variants || !Array.isArray(product.variants)) {
      return basePrice;
    }
    
    // Find matching variant based on selected size or color
    const matchingVariant = product.variants.find(v => 
      (v.name === 'Size' && v.value === selectedSize) ||
      (v.name === 'Color' && v.value === selectedColor) ||
      (v.size === selectedSize && v.color === selectedColor)
    );
    
    if (matchingVariant && typeof matchingVariant.price_adjustment === 'number') {
      const finalPrice = basePrice + matchingVariant.price_adjustment;
      console.log('[ProductDetail] Applied price adjustment:', {
        basePrice,
        adjustment: matchingVariant.price_adjustment,
        finalPrice,
        variant: matchingVariant
      });
      return finalPrice;
    }
    
    return basePrice;
  };
  
  // Get variant_id for add to cart (3NF)
  const getSelectedVariantId = () => getSelectedVariant()?._id || null;
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Product Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product?.name}
            </h1>
            {product?.sku && (
              <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>
            )}
          </div>
          <button 
            onClick={handleWishlistToggle}
            className={`p-3 rounded-full transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-50 hover:bg-red-100' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Icon 
              name="Heart" 
              size={24} 
              className={`transition-colors ${
                isWishlisted 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-red-600">
            {formatPrice(getVariantPrice())}
          </span>
          {product?.original_price && product.original_price > getVariantPrice() && (
            <>
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.original_price)}
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                -{Math.round((1 - getVariantPrice() / product.original_price) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Icon name="Star" size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="font-medium">4.8</span>
            <span className="text-gray-500">(128 đánh giá)</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className={`flex items-center gap-1 ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
            <Icon name={isInStock ? 'Check' : 'AlertTriangle'} size={16} />
            <span>
              {isInStock
                ? (currentStockInfo.stock > 0
                    ? `Còn ${currentStockInfo.stock} sản phẩm`
                    : 'Còn hàng')
                : 'Hết hàng'}
            </span>
          </div>
          {currentStockInfo.variant?.sku && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">SKU biến thể: {currentStockInfo.variant.sku}</span>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Product Options */}
      <div className="space-y-6">
        {/* Size Selection */}
        {sizes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Kích thước</h3>
              {selectedSize && (
                <span className="text-sm text-gray-600">Đã chọn: <span className="font-medium">{selectedSize}</span></span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isSizeAvailable = isSizeSelectable(size);
                return (
                  <button
                    key={size}
                    onClick={() => isSizeAvailable && handleSizeChange(size)}
                    disabled={!isSizeAvailable}
                    className={`min-w-[60px] px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-105'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    } ${!isSizeAvailable ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
                    title={!isSizeAvailable ? 'Hết hàng' : ''}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {colors.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Màu sắc</h3>
              {selectedColor && (
                <span className="text-sm text-gray-600">Đã chọn: <span className="font-medium">{getColorLabelByValue(selectedColor)}</span></span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const value = normalizeColorValue(color);
                if (!value) return null;
                const label = colorDisplayName(color);
                const isColorAvailable = isColorSelectable(value);
                return (
                  <button
                    key={value}
                    onClick={() => isColorAvailable && handleColorChange(value)}
                    disabled={!isColorAvailable}
                    className={`min-w-[80px] px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      selectedColor === value
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-105'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    } ${!isColorAvailable ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
                    title={!isColorAvailable ? 'Hết hàng' : ''}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Số lượng</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="Minus" size={18} />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    setQuantity('');
                    return;
                  }
                  const val = parseInt(raw, 10);
                  if (!Number.isNaN(val) && val > 0) {
                    setQuantity(val);
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (Number.isNaN(val) || val < 1) {
                    setQuantity(1);
                  } else {
                    setQuantity(val);
                  }
                }}
                className="w-20 h-12 text-center text-lg font-semibold border-x-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                placeholder="1"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Icon name="Plus" size={18} />
              </button>
            </div>
            <span className={`text-sm ${isValidatingQuantity ? 'text-blue-600' : 'text-gray-500'}`}>
              {isValidatingQuantity ? 'Đang kiểm tra tồn kho...' : 'Nhập số lượng mong muốn'}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !isInStock}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang thêm...</span>
            </>
          ) : (
            <>
              <Icon name="ShoppingCart" size={20} />
              <span>{isInStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}</span>
            </>
          )}
        </button>
        
        <button
          className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isInStock}
        >
          <Icon name="CreditCard" size={20} />
          <span>Mua ngay</span>
        </button>
      </div>

      {/* Product Features */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Icon name="Truck" size={20} className="text-blue-600" />
          <span className="text-gray-700">Miễn phí vận chuyển cho đơn hàng trên 500.000đ</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Icon name="RotateCcw" size={20} className="text-blue-600" />
          <span className="text-gray-700">Đổi trả miễn phí trong 7 ngày</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Icon name="Shield" size={20} className="text-blue-600" />
          <span className="text-gray-700">Bảo hành chính hãng 12 tháng</span>
        </div>
      </div>

      {/* Product Description */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h3>
        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
          {product?.description}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
