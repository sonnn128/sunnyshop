import API from './api';

const variantCache = new Map();

const normalizeId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value.toString === 'function') return value.toString();
  return null;
};

const normalizeColorValue = (color) => {
  if (!color) return null;
  if (typeof color === 'string') return color;
  if (typeof color === 'object') {
    return color.name || color.value || color.label || color.color || null;
  }
  return null;
};

const normalizeColorObject = (color) => {
  if (!color) return null;
  if (typeof color === 'string') {
    const normalized = color.trim();
    if (!normalized) return null;
    return {
      name: normalized,
      value: normalized,
      color: normalized.startsWith('#') ? normalized : undefined
    };
  }
  if (typeof color === 'object') {
    const name = color.name || color.label || color.title || color.value || color.color;
    const value = color.value || color.slug || name;
    if (!name && !value) return null;
    return {
      name: name || value,
      value: value || name,
      color: color.color || color.hex || color.code || null
    };
  }
  return null;
};

const deriveDefaultColor = (product = {}) => {
  if (Array.isArray(product.availableColors) && product.availableColors.length > 0) {
    return normalizeColorValue(product.availableColors[0]);
  }
  if (Array.isArray(product.colors) && product.colors.length > 0) {
    return normalizeColorValue(product.colors[0]);
  }
  return null;
};

const pickVariantWithStock = (variants = []) => {
  if (!Array.isArray(variants) || variants.length === 0) return null;
  const withStock = variants.find((variant) => {
    if (!variant) return false;
    if (variant.is_active === false) return false;
    const stock = Number(variant.stock_quantity ?? variant.stock ?? 0);
    return stock > 0;
  });
  return withStock || variants[0];
};

const matchVariantByAttributes = (variants = [], size, color) => {
  if ((!size && size !== 0) && (!color && color !== 0)) return null;
  const normalizedSize = size !== null && size !== undefined ? String(size).trim() : null;
  const normalizedColor = color !== null && color !== undefined ? String(color).trim() : null;
  return variants.find((variant) => {
    if (!variant) return false;
    const variantSize = variant.size !== null && variant.size !== undefined ? String(variant.size).trim() : null;
    const variantColor = variant.color !== null && variant.color !== undefined ? String(variant.color).trim() : null;
    const sizeMatches = normalizedSize ? variantSize === normalizedSize : true;
    const colorMatches = normalizedColor ? variantColor === normalizedColor : true;
    return sizeMatches && colorMatches && variant.is_active !== false;
  }) || null;
};

export const fetchVariantsForProduct = async (productId, { force = false } = {}) => {
  const normalizedId = normalizeId(productId);
  if (!normalizedId) return [];
  if (!force && variantCache.has(normalizedId)) {
    return variantCache.get(normalizedId);
  }
  try {
    const response = await API.get(`/api/products/${normalizedId}/variants`);
    const variants = Array.isArray(response?.data?.variants)
      ? response.data.variants
      : Array.isArray(response?.variants)
        ? response.variants
        : [];
    variantCache.set(normalizedId, variants);
    return variants;
  } catch (error) {
    console.warn('[productVariants] Failed to fetch variants', error);
    return [];
  }
};

const collectVariantOptionsFromField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'object') return Object.values(field).flat();
  return [];
};

export const summarizeVariantOptions = (product = {}) => {
  const sizeSet = new Set();
  const colorMap = new Map();

  const addSize = (value) => {
    if (value === null || value === undefined) return;
    const str = String(value).trim();
    if (!str) return;
    sizeSet.add(str);
  };

  const addColor = (value) => {
    const normalized = normalizeColorObject(value);
    if (!normalized || !normalized.value) return;
    const key = normalized.value.toLowerCase();
    if (!colorMap.has(key)) {
      colorMap.set(key, {
        name: normalized.name,
        value: normalized.value,
        color: normalized.color || undefined
      });
    }
  };

  // Direct arrays from API
  (Array.isArray(product?.availableSizes) ? product.availableSizes : []).forEach(addSize);
  (Array.isArray(product?.availableColors) ? product.availableColors : []).forEach(addColor);

  // 3NF variants
  (Array.isArray(product?.variants) ? product.variants : []).forEach((variant) => {
    if (!variant) return;
    const isStructuredVariant = variant.size || variant.color || variant.stock_quantity !== undefined;
    if (isStructuredVariant) {
      if (variant.size) addSize(variant.size);
      if (variant.color) {
        addColor({
          name: variant.color,
          value: variant.color,
          color: variant.color_code || variant.colorCode || null
        });
      }
      return;
    }

    const label = (variant.name || variant.type || '').toLowerCase();
    const values = Array.isArray(variant.values)
      ? variant.values
      : variant.value
        ? [variant.value]
        : [];

    values.forEach((val) => {
      if (label.includes('size')) addSize(val);
      if (label.includes('color') || label.includes('màu')) addColor(val);
    });
  });

  // Legacy variant option structures
  const legacyOptions = [
    collectVariantOptionsFromField(product?.variant_options),
    collectVariantOptionsFromField(product?.variantOptions),
    collectVariantOptionsFromField(product?.options),
    collectVariantOptionsFromField(product?.attributes)
  ].flat();

  legacyOptions.forEach((option) => {
    if (!option) return;
    const label = (option.name || option.label || option.title || '').toLowerCase();
    const values = Array.isArray(option.values) ? option.values : Array.isArray(option.options) ? option.options : option.value ? [option.value] : [];
    values.forEach((val) => {
      if (label.includes('size')) addSize(val);
      if (label.includes('color') || label.includes('màu')) addColor(val);
    });
  });

  const sizes = Array.from(sizeSet);
  const colors = Array.from(colorMap.values());
  return { sizes, colors };
};

/**
 * Resolve best-effort variant/size/color for quick add to cart
 */
export const resolveQuickVariantSelection = async (product = {}) => {
  const productId = product?._id || product?.id;
  const basePrice = Number(
    product?.salePrice ??
    product?.price ??
    product?.basePrice ??
    product?.originalPrice ??
    0
  );
  const fallbackSize = product?.selectedSize
    ?? (Array.isArray(product?.availableSizes) ? product.availableSizes[0] : null)
    ?? (Array.isArray(product?.sizes) ? product.sizes[0] : null)
    ?? null;
  const explicitColor = normalizeColorValue(product?.selectedColor);
  const fallbackColor = explicitColor ?? deriveDefaultColor(product);

  let variants = Array.isArray(product?.variants) ? product.variants : [];
  if ((!variants || variants.length === 0) && productId) {
    variants = await fetchVariantsForProduct(productId);
  }

  let preferredVariant = product?.selectedVariant || null;

  if (!preferredVariant && product?.variant_id && variants.length) {
    const normalizedVariantId = normalizeId(product.variant_id);
    preferredVariant = variants.find((variant) => normalizeId(variant?._id || variant?.id) === normalizedVariantId) || null;
  }

  if (!preferredVariant && variants.length && (product?.selectedSize || fallbackSize || explicitColor)) {
    preferredVariant = matchVariantByAttributes(variants, product?.selectedSize ?? fallbackSize, explicitColor);
  }

  if (!preferredVariant && variants.length) {
    preferredVariant = pickVariantWithStock(variants);
  }

  const variantId = preferredVariant ? (preferredVariant._id || preferredVariant.id || preferredVariant.variant_id) : null;
  const selectedSize = preferredVariant?.size ?? fallbackSize;
  const selectedColor = normalizeColorValue(preferredVariant?.color) ?? fallbackColor;
  const priceAdjustment = preferredVariant && typeof preferredVariant.price_adjustment === 'number'
    ? Number(preferredVariant.price_adjustment)
    : 0;

  return {
    productId: productId || product?.product_id || null,
    variantId,
    selectedSize,
    selectedColor,
    price: basePrice + priceAdjustment,
    variant: preferredVariant
  };
};

const parseAvailableQuantityFromMessage = (message = '') => {
  if (typeof message !== 'string') return null;
  const match = message.match(/Còn lại:\s*(\d+)/i);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isNaN(value) ? null : value;
};

export const validateStockForSelection = async ({
  productId,
  quantity,
  variantId,
  size,
  color
} = {}) => {
  const normalizedProductId = normalizeId(productId);
  const normalizedQuantity = Number(quantity);

  if (!normalizedProductId || Number.isNaN(normalizedQuantity) || normalizedQuantity <= 0) {
    return {
      success: false,
      availableQuantity: null,
      message: 'Thiếu thông tin sản phẩm hoặc số lượng không hợp lệ.'
    };
  }

  const payloadItem = {
    product_id: normalizedProductId,
    quantity: normalizedQuantity,
    variant_id: variantId ? normalizeId(variantId) : undefined,
    variant_size: size || undefined,
    variant_color: color || undefined,
    selectedSize: size || undefined,
    selectedColor: color || undefined
  };

  try {
    await API.post('/api/orders/validate-stock', { items: [payloadItem] });
    return {
      success: true,
      availableQuantity: normalizedQuantity
    };
  } catch (error) {
    const message = error?.response?.data?.message || 'Không thể kiểm tra tồn kho. Vui lòng thử lại.';
    return {
      success: false,
      availableQuantity: parseAvailableQuantityFromMessage(message),
      message
    };
  }
};

export const _variantCache = variantCache;
