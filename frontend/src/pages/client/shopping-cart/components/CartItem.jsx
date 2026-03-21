import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useWishlist } from '../../../contexts/WishlistContext';
import { useToast } from '../../../components/ui/ToastProvider';
import { validateStockForSelection } from '../../../lib/productVariants';

const normalizeColorValue = (color) => (
  typeof color === 'string'
    ? color
    : (color?.value || color?.name || '')
);

const normalizeSizeValue = (size) => (
  typeof size === 'string'
    ? size
    : (size?.value || size?.name || '')
);

const findVariantMatch = (variants, size, color) => {
  if (!Array.isArray(variants) || variants.length === 0) return null;
  const normalizedSize = normalizeSizeValue(size);
  const normalizedColor = normalizeColorValue(color);

  if (normalizedSize && normalizedColor) {
    const both = variants.find(v => v.size === normalizedSize && v.color === normalizedColor);
    if (both) return both;
  }

  if (normalizedSize) {
    const sizeMatch = variants.find(v => v.size === normalizedSize);
    if (sizeMatch) return sizeMatch;
  }

  if (normalizedColor) {
    const colorMatch = variants.find(v => v.color === normalizedColor);
    if (colorMatch) return colorMatch;
  }

  return null;
};

const computeVariantPrice = (variants, basePrice, size, color) => {
  const numericBase = Number(basePrice) || 0;
  if (!Array.isArray(variants) || variants.length === 0) return numericBase;
  const match = findVariantMatch(variants, size, color);
  if (match && typeof match.price_adjustment === 'number') {
    return numericBase + match.price_adjustment;
  }
  return numericBase;
};

const getVariantStock = (variant) => (
  Number(variant?.stock_quantity ?? variant?.stock ?? variant?.stockQuantity ?? 0) || 0
);

const computeCartItemStockInfo = (item, sizeValue, colorValue) => {
  const variants = Array.isArray(item?.variants) ? item.variants : [];
  const baseStock = Number(item?.stock_quantity ?? item?.stock ?? 0) || 0;

  if (!variants.length) {
    return { stock: baseStock || null, variant: null, source: 'product' };
  }

  const exactVariant = findVariantMatch(variants, sizeValue, colorValue);
  if (exactVariant) {
    return { stock: getVariantStock(exactVariant), variant: exactVariant, source: 'variant' };
  }

  if (sizeValue) {
    const sizeStock = variants.reduce((sum, variant) => (
      variant?.size === sizeValue ? sum + getVariantStock(variant) : sum
    ), 0);
    if (sizeStock) {
      return { stock: sizeStock, variant: null, source: 'size' };
    }
  }

  if (colorValue) {
    const colorStock = variants.reduce((sum, variant) => (
      variant?.color === colorValue ? sum + getVariantStock(variant) : sum
    ), 0);
    if (colorStock) {
      return { stock: colorStock, variant: null, source: 'color' };
    }
  }

  const totalVariantStock = variants.reduce((sum, variant) => sum + getVariantStock(variant), 0);
  if (totalVariantStock) {
    return { stock: totalVariantStock, variant: null, source: 'variants' };
  }

  return { stock: baseStock || null, variant: null, source: 'product' };
};

const CartItem = ({ item, onUpdateQuantity, onUpdateSizeColor, onRemove, onSaveForLater, onMoveToWishlist }) => {
  const { isInWishlist, refreshWishlist, toggleWishlist } = useWishlist();
  const toast = useToast();
  const [isTogglingWish, setIsTogglingWish] = useState(false);
  const [wishlistState, setWishlistState] = useState(false);
  const [isValidatingQuantity, setIsValidatingQuantity] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(() => {
    const base = item?.basePrice ?? item?.price ?? 0;
    return computeVariantPrice(
      item?.variants,
      base,
      normalizeSizeValue(item?.selectedSize || item?.size),
      normalizeColorValue(item?.selectedColor || item?.color)
    );
  });
  const [isPriceUpdating, setIsPriceUpdating] = useState(false);
  const [draftQuantity, setDraftQuantity] = useState(() => String(item?.quantity || 1));
  const quantityValidationTimeoutRef = useRef(null);
  const lastQuantityValidationRef = useRef({ key: null, success: false });
  const cartItemKey = item?.id || item?.productId || item?._id;
  const normalizedSelectedSize = normalizeSizeValue(item?.selectedSize || item?.size || '');
  const normalizedSelectedColor = normalizeColorValue(item?.selectedColor || item?.color || '');
  const stockInfo = useMemo(
    () => computeCartItemStockInfo(item, normalizedSelectedSize, normalizedSelectedColor),
    [item, normalizedSelectedSize, normalizedSelectedColor]
  );
  const maxSelectableQuantity = typeof stockInfo.stock === 'number'
    ? Math.max(0, Math.min(stockInfo.stock, 99))
    : null;
  const numericDraftQuantity = parseInt(draftQuantity, 10);

  useEffect(() => {
    setDraftQuantity(String(item?.quantity || 1));
  }, [item?.quantity]);
  
  // Update local state when wishlist state changes
  useEffect(() => {
    const productId = item?.productId || item?.id || item?._id;
    if (productId) {
      const inWishlist = isInWishlist(productId);
      console.log('[CartItem] Effect check - Product:', productId, 'In wishlist:', inWishlist);
      setWishlistState(inWishlist);
    }
  }, [item, isInWishlist, refreshWishlist]);

  useEffect(() => {
    let isMounted = true;
    const productId = item?.productId || item?.id || item?._id;
    const numericQuantity = parseInt(draftQuantity, 10);

    if (!productId || Number.isNaN(numericQuantity) || numericQuantity < 1) {
      setIsPriceUpdating(false);
      return () => {
        isMounted = false;
      };
    }

    const basePrice = item?.basePrice ?? item?.price ?? 0;
    const sizeValue = normalizedSelectedSize;
    const colorValue = normalizedSelectedColor;
    const variantId = item?.variant_id
      || stockInfo?.variant?._id
      || stockInfo?.variant?.id
      || null;
    const validationKey = `${productId}::${variantId || ''}::${sizeValue || ''}::${colorValue || ''}::${numericQuantity}`;

    const applyPriceUpdate = () => {
      if (!isMounted) return;
      const nextPrice = computeVariantPrice(item?.variants, basePrice, sizeValue, colorValue);
      setDisplayPrice(nextPrice);
      setIsPriceUpdating(false);
    };

    const enforceQuantityLimit = (limitQuantity, overrideMessage) => {
      if (typeof limitQuantity !== 'number' || Number.isNaN(limitQuantity)) {
        return false;
      }
      const normalizedLimit = Math.max(0, Math.floor(limitQuantity));
      if (normalizedLimit === numericQuantity) {
        return false;
      }
      if (normalizedLimit <= 0) {
        onRemove(cartItemKey);
        setDraftQuantity('');
        toast.push({
          title: 'Sản phẩm hết hàng',
          message: overrideMessage || 'Sản phẩm này đã hết hàng và đã được xóa khỏi giỏ hàng.',
          type: 'warning'
        });
        return true;
      }
      setDraftQuantity(String(normalizedLimit));
      onUpdateQuantity(cartItemKey, normalizedLimit);
      toast.push({
        title: 'Số lượng không đủ',
        message: overrideMessage || `Hiện chỉ còn ${normalizedLimit} sản phẩm trong kho`,
        type: 'warning'
      });
      return true;
    };

    if (
      lastQuantityValidationRef.current?.success &&
      lastQuantityValidationRef.current.key === validationKey
    ) {
      if (
        typeof maxSelectableQuantity === 'number' &&
        numericQuantity > maxSelectableQuantity
      ) {
        enforceQuantityLimit(maxSelectableQuantity);
        if (isMounted) {
          setIsPriceUpdating(false);
        }
      } else {
        applyPriceUpdate();
      }
      return () => {
        isMounted = false;
      };
    }

    if (quantityValidationTimeoutRef.current) {
      clearTimeout(quantityValidationTimeoutRef.current);
    }

    quantityValidationTimeoutRef.current = setTimeout(async () => {
      if (!isMounted) return;
      setIsValidatingQuantity(true);
      setIsPriceUpdating(true);
      try {
        const result = await validateStockForSelection({
          productId,
          quantity: numericQuantity,
          variantId,
          size: sizeValue || null,
          color: colorValue || null
        });

        if (result.success) {
          lastQuantityValidationRef.current = { key: validationKey, success: true };
          if (
            typeof maxSelectableQuantity === 'number' &&
            numericQuantity > maxSelectableQuantity
          ) {
            enforceQuantityLimit(maxSelectableQuantity);
          } else if (numericQuantity !== Number(item?.quantity)) {
            onUpdateQuantity(cartItemKey, numericQuantity);
          }
          applyPriceUpdate();
          return;
        }

        const fallbackQuantity = typeof result.availableQuantity === 'number'
          ? Math.max(0, Math.floor(result.availableQuantity))
          : (typeof maxSelectableQuantity === 'number'
              ? Math.max(0, Math.floor(maxSelectableQuantity))
              : Math.max(1, Math.floor(numericQuantity - 1)));

        lastQuantityValidationRef.current = {
          key: `${productId}::${variantId || ''}::${sizeValue || ''}::${colorValue || ''}::${Math.max(fallbackQuantity, 1)}`,
          success: true
        };

        const fallbackMessage = result.message ||
          (fallbackQuantity > 0
            ? `Hiện chỉ còn ${fallbackQuantity} sản phẩm trong kho`
            : 'Sản phẩm này đã hết hàng và đã được xóa khỏi giỏ hàng.');

        if (!enforceQuantityLimit(fallbackQuantity, fallbackMessage)) {
          if (fallbackQuantity !== Number(item?.quantity) && fallbackQuantity > 0) {
            onUpdateQuantity(cartItemKey, fallbackQuantity);
          }
          applyPriceUpdate();
        } else if (isMounted) {
          setIsPriceUpdating(false);
        }
      } catch (error) {
        console.error('[CartItem] Không thể kiểm tra tồn kho', error);
        if (isMounted) {
          setIsPriceUpdating(false);
        }
      } finally {
        if (isMounted) {
          setIsValidatingQuantity(false);
        }
      }
    }, 800);

    return () => {
      isMounted = false;
      if (quantityValidationTimeoutRef.current) {
        clearTimeout(quantityValidationTimeoutRef.current);
      }
    };
  }, [
    cartItemKey,
    draftQuantity,
    item?.productId,
      item?.quantity,
    item?.variant_id,
    item?.variants,
    item?.basePrice,
    item?.price,
    normalizedSelectedSize,
    normalizedSelectedColor,
    maxSelectableQuantity,
    onRemove,
    onUpdateQuantity,
      toast,
      stockInfo?.variant?._id,
      stockInfo?.variant?.id
  ]);
  
  const handleQuantityChange = (newQuantity) => {
    if (Number.isNaN(newQuantity) || newQuantity < 1) {
      setDraftQuantity('1');
      return;
    }
    setDraftQuantity(String(newQuantity));
  };

  const handleWishlistClick = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (isTogglingWish) return;
    setIsTogglingWish(true);
    try {
      // Prefer productId for wishlist operations
      const productId = item?.productId || item?.id || item?._id;
      console.log('[CartItem] Wishlist action for product:', productId, item?.name, 'Current state:', wishlistState);
      
      if (!wishlistState) {
        // If not in wishlist, add directly
        console.log('[CartItem] Adding to wishlist');
        
        // Update UI immediately for feedback
        setWishlistState(true);
        
        const snapshot = {
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.selectedSize,
          color: item.selectedColor
        };
        
        const added = await toggleWishlist(productId, snapshot);
        console.log('[CartItem] Added directly to wishlist:', added);
        
        if (added) {
          toast.push({ 
            title: 'Đã thêm vào yêu thích', 
            message: `"${item.name}" đã vào danh sách yêu thích`, 
            type: 'success' 
          });
        }
        
        // Force refresh wishlist context
        await refreshWishlist();
      } else {
        // If already in wishlist, delegate to parent which has confirmation dialog logic
        console.log('[CartItem] Calling parent handler for confirmation');
        onMoveToWishlist(productId);
        // Don't update UI state here - let the parent handle it after confirmation
      }
    } finally {
      setIsTogglingWish(false);
    }
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      setDraftQuantity('');
      return;
    }
    const val = parseInt(raw, 10);
    if (!Number.isNaN(val) && val > 0) {
      setDraftQuantity(String(val));
    }
  };

  const handleInputBlur = (e) => {
    if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
      const fallback = maxSelectableQuantity && maxSelectableQuantity > 0 ? maxSelectableQuantity : 1;
      setDraftQuantity(String(fallback));
    }
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    
    // If there's variant pricing, log the change for debugging
    if (item?.variants && Array.isArray(item?.variants)) {
      const currentPrice = getVariantPrice(item?.selectedSize, item?.selectedColor);
      const newPrice = getVariantPrice(newSize, item?.selectedColor);
      console.log('[CartItem] Size change price impact:', {
        from: item?.selectedSize,
        to: newSize,
        currentPrice,
        newPrice,
        priceDifference: newPrice - currentPrice
      });
    }
    
    // Update the cart with the new size
    onUpdateSizeColor(cartItemKey, newSize, item?.selectedColor || item?.color);
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    
    // If there's variant pricing, log the change for debugging
    if (item?.variants && Array.isArray(item?.variants)) {
      const currentPrice = getVariantPrice(item?.selectedSize, item?.selectedColor);
      const newPrice = getVariantPrice(item?.selectedSize, newColor);
      console.log('[CartItem] Color change price impact:', {
        from: item?.selectedColor,
        to: newColor,
        currentPrice,
        newPrice,
        priceDifference: newPrice - currentPrice
      });
    }
    
    // Update the cart with the new color
    onUpdateSizeColor(cartItemKey, item?.selectedSize || item?.size, newColor);
  };

  // Check if the product has variant-specific pricing with price_adjustment
  const getVariantPrice = (size, color) => {
    const basePrice = item?.basePrice ?? item?.price ?? 0;
    const finalPrice = computeVariantPrice(item?.variants, basePrice, size, color);
    if (finalPrice !== basePrice) {
      const matchingVariant = findVariantMatch(item?.variants, size, color);
      console.log('[CartItem] Variant price calculation:', {
        size,
        color,
        basePrice,
        matchingVariant,
        adjustment: matchingVariant?.price_adjustment,
        finalPrice
      });
    }
    return finalPrice;
  };
  const displayedUnitPrice = typeof displayPrice === 'number'
    ? displayPrice
    : getVariantPrice(item?.selectedSize, item?.selectedColor);
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border rounded-lg">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Link to={`/product-detail?id=${item?.productId || item?.id}`}>
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted">
            <Image
              src={item?.image}
              alt={item?.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      </div>
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex-1">
            <Link 
              to={`/product-detail?id=${item?.productId || item?.id}`}
              className="font-medium text-foreground hover:text-accent transition-colors line-clamp-2"
            >
              {item?.name}
            </Link>
            
            {/* Size and Color Selectors */}
            <div className="flex flex-wrap gap-3 mt-2">
              {/* Color - Always show if exists */}
              {(item?.selectedColor || item?.color) && (
                <div className="flex items-center gap-2">
                  {item?.availableColors && item?.availableColors?.length > 0 ? (
                    <>
                      <label className="text-sm text-muted-foreground">Màu:</label>
                      <select
                        value={item?.selectedColor || item?.color || ''}
                        onChange={handleColorChange}
                        className="px-2 py-1 text-sm border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {item?.availableColors?.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Màu: {item?.selectedColor || item?.color}
                    </span>
                  )}
                </div>
              )}
              
              {/* Size - Always show if exists */}
              {(item?.selectedSize || item?.size) && (
                <div className="flex items-center gap-2">
                  {item?.availableSizes && item?.availableSizes?.length > 0 ? (
                    <>
                      <label className="text-sm text-muted-foreground">Size:</label>
                      <select
                        value={item?.selectedSize || item?.size || ''}
                        onChange={handleSizeChange}
                        className="w-16 px-2 py-1 text-sm border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {item?.availableSizes?.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Size: {item?.selectedSize || item?.size}
                    </span>
                  )}
                </div>
              )}
              
              {/* Brand */}
              {item?.brand && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>•</span>
                  <span>Thương hiệu: {item?.brand}</span>
                </div>
              )}
            </div>
            
            {item?.inStock ? (
              <span className="inline-flex items-center gap-1 text-sm text-success mt-1">
                <Icon name="Check" size={14} />
                Còn hàng
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-error mt-1">
                <Icon name="AlertCircle" size={14} />
                Hết hàng
              </span>
            )}
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="font-semibold text-lg text-foreground">
              {formatPrice(displayedUnitPrice)}
            </div>
            {item?.originalPrice && item?.originalPrice > displayedUnitPrice && (
              <div className="text-sm line-through text-red-500">
                {formatPrice(item?.originalPrice)}
              </div>
            )}
            {isPriceUpdating && (
              <div className="text-xs text-blue-600 mt-1">Đang tính giá...</div>
            )}
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          {/* Quantity Controls */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Số lượng:</span>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange((numericDraftQuantity || 1) - 1)}
                  disabled={(numericDraftQuantity || 1) <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Icon name="Minus" size={14} />
                </Button>
                <input
                  type="number"
                  value={draftQuantity}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="w-16 px-2 py-1 text-sm font-medium text-center bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                  min="1"
                  placeholder="1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange((numericDraftQuantity || 0) + 1)}
                  disabled={!item?.inStock}
                  className="h-8 w-8 p-0"
                >
                  <Icon name="Plus" size={14} />
                </Button>
              </div>
            </div>
            {isValidatingQuantity && (
              <span className="text-xs text-blue-600">Đang kiểm tra tồn kho...</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlistClick}
              disabled={isTogglingWish}
              className={`hover:text-accent ${wishlistState ? 'text-error' : 'text-muted-foreground'}`}
            >
              <Icon name="Heart" size={16} className={wishlistState ? 'fill-current' : ''} />
              <span className="hidden sm:inline ml-1">
                {wishlistState ? 'Đã yêu thích' : 'Yêu thích'}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(cartItemKey)}
              className="text-muted-foreground hover:text-error"
            >
              <Icon name="Trash2" size={16} />
              <span className="hidden sm:inline ml-1">Xóa</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;