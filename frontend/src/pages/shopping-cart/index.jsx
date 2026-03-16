import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux'
import cart from '../../lib/cart'
import API, { API_ENABLED } from '../../lib/api';
import * as orderApiService from '../../lib/orderApi';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import SavedForLater from './components/SavedForLater';
import CheckoutModal from './components/CheckoutModal';
import EmptyCart from './components/EmptyCart';
import { useToast } from '../../components/ui/ToastProvider';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useNavigate } from 'react-router-dom';

const normalizeColorValue = (color) => {
  if (!color) return '';
  if (typeof color === 'string') return color;
  if (typeof color === 'object') {
    return color.value || color.name || color.label || '';
  }
  return '';
};

const normalizeSizeValue = (size) => {
  if (!size) return '';
  if (typeof size === 'string') return size;
  if (typeof size === 'object') {
    return size.value || size.name || size.label || '';
  }
  return '';
};

const findVariantMatch = (variants, size, color) => {
  if (!Array.isArray(variants) || variants.length === 0) return null;
  const normalizedSize = normalizeSizeValue(size);
  const normalizedColor = normalizeColorValue(color);

  if (normalizedSize && normalizedColor) {
    const both = variants.find(v => (v.size === normalizedSize) && (v.color === normalizedColor));
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

const resolveVariantPrice = (variants, basePrice, size, color) => {
  const numericBase = Number(basePrice) || 0;
  if (!Array.isArray(variants) || variants.length === 0) return numericBase;
  const match = findVariantMatch(variants, size, color);
  if (match && typeof match.price_adjustment === 'number') {
    return numericBase + match.price_adjustment;
  }
  return numericBase;
};

const ShoppingCart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, refreshWishlist } = useWishlist();
  const toast = useToast();
  const savedItems = useSelector(state => state.cart.savedItems)
  const [cartItems, setCartItems] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  
  // Get authentication state from AuthContext
  const { isAuthenticated, user, logout } = useAuth();
  
  // Handle login/logout
  const handleAuthAction = async () => {
    if (isAuthenticated) {
      try {
        await logout();
        toast.push({ message: 'Đã đăng xuất', type: 'success' });
      } catch (error) {
        toast.push({ message: 'Đăng xuất không thành công', type: 'error' });
      }
    } else {
      setIsCheckoutModalOpen(true);
      toast.push({ message: 'Vui lòng đăng nhập để tiếp tục', type: 'info' });
    }
  };

  // Calculate order summary
  const orderSummary = React.useMemo(() => {
    const subtotal = (cartItems || [])?.reduce((sum, item) => sum + (Number(item?.price || 0) * Number(item?.quantity || item?.qty || 1)), 0) || 0;
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const tax = Math.round(subtotal * 0.1);
    const discount = couponCode === 'WELCOME10' ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + shipping + tax - discount;

    return { subtotal, shipping, tax, discount, total };
  }, [cartItems, couponCode]);

  // Cart actions using helper
  const refreshCart = async () => {
    try {
      const c = await cart.fetchCart();
      const items = c?.items || [];
      const enriched = await enrichItems(items);
      setCartItems(enriched);
    } catch (e) {
      setCartItems([]);
    }
  }

  // enrich items by fetching product details from server when possible
  const enrichItems = async (items) => {
    if (!items || items.length === 0) return [];
    const promises = items.map(async (it) => {
      try {
        const pid = it.productId || it.id || it._id;
        if (!pid) return it;
        
        // If API is disabled, keep the item as-is (no mock fallback)
        if (!API_ENABLED) return it;

        const res = await API.get(`/api/products/${pid}`);
        const p = res?.data?.product || res?.data || null;
        if (!p) return it;
        // Normalize variants from ProductVariant or legacy arrays
        const sizeSet = new Set();
        const colorSet = new Set();
        const variants = [];
        
        if (Array.isArray(p?.variants)) {
          p.variants.forEach(v => {
            const normalizedSize = normalizeSizeValue(v.size) || (v.name === 'Size' ? v.value : '');
            const normalizedColor = normalizeColorValue(v.color) || (v.name === 'Color' ? v.value : '');
            if (normalizedSize) sizeSet.add(normalizedSize);
            if (normalizedColor) colorSet.add(normalizedColor);
            variants.push({
              _id: v._id || null,
              id: v._id || v.id || null,
              name: v.name || null,
              value: v.value || null,
              size: normalizedSize || null,
              color: normalizedColor || null,
              price_adjustment: Number(v.price_adjustment) || 0,
              stock_quantity: Number(v.stock_quantity || v.stock) || 0
            });
          });
        }
        
        // Determine the correct price based on selected size/color
        const selectedSize = normalizeSizeValue(it.selectedSize || it.size || (it.snapshot && it.snapshot.size));
        const selectedColor = normalizeColorValue(it.selectedColor || it.color || (it.snapshot && it.snapshot.color));
        
        // Base price from the product
        const basePrice = p.price || p.salePrice || 0;
        const variantPrice = resolveVariantPrice(variants, basePrice, selectedSize, selectedColor);
        const matchedVariant = findVariantMatch(variants, selectedSize, selectedColor);
        
        if (matchedVariant && matchedVariant.price_adjustment) {
          console.log('[Cart] Applied price adjustment:', { 
            basePrice, 
            adjustment: matchedVariant.price_adjustment, 
            finalPrice: variantPrice,
            variant: matchedVariant
          });
        }

        const fallbackSizes = Array.isArray(p?.sizes) ? p.sizes : [];
        const fallbackColors = Array.isArray(p?.colors)
          ? p.colors.map(c => normalizeColorValue(c)).filter(Boolean)
          : [];
        const availableSizes = sizeSet.size ? Array.from(sizeSet) : fallbackSizes;
        const availableColors = colorSet.size ? Array.from(colorSet) : Array.from(new Set(fallbackColors));
        
        return {
          // merge: product authoritative fields, keep user's snapshot selections
          id: p._id || p.id || pid,
          productId: p._id || p.id || pid,
          name: p.name || it.name,
          image: (p.images && p.images[0]) || it.image || (it.snapshot && it.snapshot.image) || null,
          price: variantPrice,
          basePrice: basePrice,
          originalPrice: p.originalPrice || it.originalPrice,
          quantity: it.quantity || it.qty || 1,
          selectedSize: selectedSize,
          selectedColor: selectedColor,
          inStock: typeof p.stock !== 'undefined' ? (p.stock > 0) : (it.inStock ?? true),
          brand: p.brand || it.brand,
          snapshot: it.snapshot || null,
          // Add available sizes and colors for dropdown (prefer variants)
          availableSizes,
          availableColors,
          // Add variants data for price calculations
          variants: variants.length > 0 ? variants : null,
          variant_id: matchedVariant?._id || matchedVariant?.id || it.variant_id || null,
          // preserve any other properties
          ...it
        };
      } catch (e) {
        // On error, keep original item without any local mock fallback
        return it;
      }
    });
    return Promise.all(promises);
  };

  useEffect(() => {
    refreshCart();
    const onCartUpdated = (e) => {
      if (e?.detail) {
        // enrich then set
        (async () => {
          const enriched = await enrichItems(e.detail.items || []);
          setCartItems(enriched);
        })();
      } else refreshCart();
    };
    window.addEventListener('cart:updated', onCartUpdated);
    window.addEventListener('storage', onCartUpdated);
    return () => {
      window.removeEventListener('cart:updated', onCartUpdated);
      window.removeEventListener('storage', onCartUpdated);
    };
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    const it = cartItems.find(i => (i.id || i.productId || i._id) === itemId);
    if (!it) return;
    const updated = { ...it, quantity: newQuantity };
    await cart.updateItem(updated);
    await refreshCart();
  };

  const handleUpdateSizeColor = async (itemId, newSize, newColor) => {
    const it = cartItems.find(i => (i.id || i.productId || i._id) === itemId);
    if (!it) return;
    
    // Remove old item
    await cart.removeItem(it);
    
    const basePrice = it.basePrice || it.price || 0;
    const variantPrice = resolveVariantPrice(it.variants, basePrice, newSize, newColor);
    const matchingVariant = findVariantMatch(it.variants, newSize, newColor);
    
    if (matchingVariant && matchingVariant.price_adjustment) {
      console.log('[Cart] Updating item with price adjustment:', { 
        basePrice, 
        adjustment: matchingVariant.price_adjustment, 
        finalPrice: variantPrice,
        variant: matchingVariant
      });
    }
    
    // Add as new item with new size/color (will merge if exists)
    await cart.addItem({
      id: it.productId || it.id,
      productId: it.productId || it.id,
      name: it.name,
      price: variantPrice,  // Use the price with adjustment if applicable
      image: it.image,
      selectedSize: newSize,
      selectedColor: newColor,
      quantity: it.quantity,
      variants: it.variants,  // Pass along variants data
      variant_id: matchingVariant?._id || matchingVariant?.id || it.variant_id || null
    });
    
    await refreshCart();
  };

  const handleRemoveItem = async (itemId) => {
    const it = cartItems.find(i => (i.id || i.productId || i._id) === itemId);
    if (!it) return;
    await cart.removeItem(it);
    await refreshCart();
  };

  const handleSaveForLater = (itemId) => dispatch(saveForLater(itemId))
  const [wishlistConfirm, setWishlistConfirm] = useState({ open: false, productId: null, name: '' });

  const handleMoveToWishlist = async (itemId) => {
    try {
      console.log('[ShoppingCart] Moving to wishlist:', itemId);
      const it = cartItems.find(i => String(i.id) === String(itemId) || 
                                    String(i.productId) === String(itemId) || 
                                    String(i._id) === String(itemId));
      if (!it) {
        console.error('[ShoppingCart] Item not found:', itemId);
        return;
      }
      const productId = it.productId || it.id || it._id;
      console.log('[ShoppingCart] Found product:', productId, it.name);

      const snapshot = {
        name: it.name,
        price: it.price,
        image: it.image,
        size: it.selectedSize,
        color: it.selectedColor
      };

      const isAlready = isInWishlist(productId);
      console.log('[ShoppingCart] Is already in wishlist?', isAlready);
      
      if (!isAlready) {
        // Add without confirm
        console.log('[ShoppingCart] Adding to wishlist:', productId);
        const added = await toggleWishlist(productId, snapshot);
        console.log('[ShoppingCart] Add result:', added);
        if (added) {
          // Remove from cart after adding to wishlist
          await cart.removeItem(it);
          await refreshCart();
          toast.push({ title: 'Đã thêm vào yêu thích', message: `"${it.name}" đã vào danh sách yêu thích`, type: 'success' });
        }
      } else {
        // Ask confirm before removing
        console.log('[ShoppingCart] Showing confirm dialog for:', productId, it.name);
        setWishlistConfirm({ 
          open: true, 
          productId: productId, 
          name: it.name 
        });
        console.log('[ShoppingCart] Wishlist confirm state set:', wishlistConfirm);
      }
    } catch (e) {
      console.error('[Cart->Wishlist] error', e);
      toast.push({ title: 'Lỗi', message: 'Không thể cập nhật danh sách yêu thích', type: 'error' });
    }
  }
  const handleMoveToCart = (itemId) => dispatch(moveToCart(itemId))
  const handleRemoveSavedItem = (itemId) => dispatch(removeSavedItem(itemId))

  const handleMoveToWishlistFromSaved = (itemId) => {
    console.log('Moved to wishlist from saved:', itemId);
    handleRemoveSavedItem(itemId);
  };

  const handleApplyCoupon = (code) => {
    setCouponCode(code);
    if (code === 'WELCOME10') {
      // Show success message
      console.log('Coupon applied successfully');
    } else {
      // Show error message
      console.log('Invalid coupon code');
    }
  };

  const handleProceedToCheckout = async () => {
    // **KIỂM TRA STOCK TRƯỚC KHI MỞ CHECKOUT MODAL**
    try {
      setIsLoading(true);
      
      // Kiểm tra giỏ hàng có sản phẩm không
      if (!cartItems || cartItems.length === 0) {
        toast.push({
          title: 'Giỏ hàng trống',
          message: 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán',
          type: 'warning'
        });
        setIsLoading(false);
        return;
      }
      
      // Gọi API kiểm tra stock cho tất cả sản phẩm trong giỏ
      const stockCheckPayload = {
        items: cartItems.map(item => ({
          product_id: item.productId || item.id,
          quantity: item.quantity || item.qty || 1
        }))
      };
      
      console.log('[STOCK CHECK] Checking stock before checkout:', stockCheckPayload);
      
      // Gọi endpoint check stock
      const response = await API.post('/api/orders/validate-stock', stockCheckPayload);
      
      if (response.data?.success) {
        // Stock đủ, mở checkout modal
        setIsCheckoutModalOpen(true);
      }
    } catch (error) {
      console.error('[STOCK CHECK] Error:', error);
      
      // Hiển thị lỗi cụ thể từ backend
      const errorMessage = error.response?.data?.message || 'Không thể kiểm tra tồn kho. Vui lòng thử lại.';
      
      toast.push({
        title: 'Không đủ hàng',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async (orderData) => {
    setIsLoading(true)
    try {
      console.log('Processing order data:', orderData)
      
      // Format order data for backend API
      const orderPayload = {
        // Required fields from Order model
        subtotal: orderSummary.subtotal,
        total_amount: orderSummary.total,
        
        // Payment info
        payment_method: orderData.paymentMethod || 'cod',
        payment_status: 'pending',
        
        // Customer info
        billing_address: {
          fullName: orderData.fullName,
          phone: orderData.phone,
          address: orderData.address,
          ward: orderData.ward,
          district: orderData.district,
          city: orderData.city,
          email: orderData.email
        },
        shipping_address: {
          fullName: orderData.fullName,
          phone: orderData.phone,
          address: orderData.address,
          ward: orderData.ward,
          district: orderData.district,
          city: orderData.city,
          email: orderData.email
        },
        
        // If guest checkout, include guest email
        guest_email: !isAuthenticated ? orderData.email : undefined,
        
        // Additional info
        notes: orderData.deliveryNotes,
        
        // Create order items
        items: cartItems.map(item => ({
          product_id: item.productId || item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          product_name: item.name,
          product_image_url: item.image,
          variant_name: item.selectedSize || item.selectedColor ? 
            `${item.selectedSize ? `Size: ${item.selectedSize}` : ''}${item.selectedColor ? `, Màu: ${item.selectedColor}` : ''}` : 
            undefined
        }))
      };
      
      // Use our orderApi service to create the order
      // Persist guest email for later filtering if user is not authenticated
      if (!isAuthenticated && orderData?.email) {
        try { localStorage.setItem('guest_email', orderData.email); } catch (e) {}
      }

      const createdOrder = await orderApiService.createOrder(orderPayload);
      console.log('Order created successfully:', createdOrder);
      
      // Clear cart after successful order
      await cart.clearCart();
      
      const orderId = createdOrder?.id || createdOrder?._id;
      toast.push({ 
        title: 'Đặt hàng thành công', 
        message: `Đơn hàng #${createdOrder?.orderNumber || orderId || 'mới'} đã được tạo thành công.`, 
        type: 'success' 
      });
      
      // Navigate to order confirmation page
      if (orderId) {
        navigate(`/order-confirmation/${orderId}`);
      }
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.push({ 
        title: 'Lỗi đặt hàng', 
        message: error.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleClearCart = () => {
    setShowClearConfirm(true);
  }

  const confirmClearCart = async () => {
    await cart.clearCart();
    refreshCart();
    toast.push({ title: 'Đã xóa', message: 'Giỏ hàng đã được làm mới.', type: 'info' });
  }

  return (
    <>
      <Helmet>
        <title>Giỏ hàng - ABC Fashion Store</title>
        <meta name="description" content="Xem và quản lý giỏ hàng của bạn tại ABC Fashion Store. Thanh toán an toàn với nhiều phương thức thanh toán." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Giỏ hàng của bạn
                </h1>
                <p className="text-muted-foreground">
                  {cartItems?.length > 0 
                    ? `${cartItems?.length} sản phẩm trong giỏ hàng`
                    : 'Chưa có sản phẩm nào trong giỏ hàng'
                  }
                </p>
              </div>
              
              {cartItems?.length > 0 && (
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  {/* Authentication button using AuthContext */}
                  <Button
                    variant={isAuthenticated ? "default" : "outline"}
                    size="sm"
                    onClick={handleAuthAction}
                  >
                    <Icon name={isAuthenticated ? "UserCheck" : "User"} size={16} />
                    <span className="ml-2">{isAuthenticated ? 'Đăng xuất' : 'Đăng nhập'}</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                    <span className="ml-2">Xóa tất cả</span>
                  </Button>
                </div>
              )}
            </div>

            {cartItems?.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems?.map((item) => (
                    <CartItem
                      key={item?.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onUpdateSizeColor={handleUpdateSizeColor}
                      onRemove={handleRemoveItem}
                      onSaveForLater={handleSaveForLater}
                      onMoveToWishlist={handleMoveToWishlist}
                    />
                  ))}

                  {/* Continue Shopping */}
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => window.history?.back()}
                    >
                      <Icon name="ArrowLeft" size={16} />
                      <span className="ml-2">Tiếp tục mua sắm</span>
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Shield" size={16} />
                      <span>Thanh toán an toàn & bảo mật</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <OrderSummary
                    subtotal={orderSummary?.subtotal}
                    shipping={orderSummary?.shipping}
                    tax={orderSummary?.tax}
                    discount={orderSummary?.discount}
                    total={orderSummary?.total}
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    onApplyCoupon={handleApplyCoupon}
                    onProceedToCheckout={handleProceedToCheckout}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Saved for Later */}
            {savedItems?.length > 0 && (
              <div className="mt-12">
                <SavedForLater
                  items={savedItems}
                  onMoveToCart={handleMoveToCart}
                  onRemove={handleRemoveSavedItem}
                  onMoveToWishlist={handleMoveToWishlistFromSaved}
                />
              </div>
            )}

            {/* Benefits Section */}
            {cartItems?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon name="Truck" size={24} className="text-success" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Miễn phí vận chuyển</h3>
                    <p className="text-sm text-muted-foreground">Cho đơn hàng từ 500.000 VND</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon name="RotateCcw" size={24} className="text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Đổi trả miễn phí</h3>
                    <p className="text-sm text-muted-foreground">Trong vòng 30 ngày</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon name="Shield" size={24} className="text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Thanh toán an toàn</h3>
                    <p className="text-sm text-muted-foreground">Bảo mật SSL 256-bit</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Checkout Modal using AuthContext */}
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          cartItems={cartItems}
          orderSummary={orderSummary}
          onPlaceOrder={handlePlaceOrder}
          isLoggedIn={isAuthenticated} 
          userData={user}
        />

        {/* Confirm Clear Cart Modal */}
        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={confirmClearCart}
          title="Xóa tất cả sản phẩm?"
          message="Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng? Hành động này không thể hoàn tác."
          confirmText="Xóa tất cả"
          cancelText="Hủy bỏ"
          type="danger"
        />

        {/* Confirm remove from wishlist */}
        <ConfirmModal
          isOpen={wishlistConfirm.open}
          onClose={() => {
            console.log('[ShoppingCart] Closing wishlist confirm modal');
            setWishlistConfirm({ open: false, productId: null, name: '' });
          }}
          onConfirm={async () => {
            console.log('[ShoppingCart] Confirming wishlist removal for:', wishlistConfirm.productId, wishlistConfirm.name);
            try {
              await toggleWishlist(wishlistConfirm.productId); // toggling will remove
              toast.push({ title: 'Đã xóa khỏi yêu thích', message: `Đã xóa "${wishlistConfirm.name}" khỏi danh sách yêu thích`, type: 'info' });
              await refreshWishlist(); // Refresh wishlist state after removal
            } catch (e) {
              console.error('[ShoppingCart] Error removing from wishlist:', e);
              toast.push({ title: 'Lỗi', message: 'Không thể gỡ khỏi yêu thích', type: 'error' });
            } finally {
              setWishlistConfirm({ open: false, productId: null, name: '' });
            }
          }}
          title="Gỡ khỏi danh sách yêu thích?"
          message={`Bạn có chắc muốn gỡ \"${wishlistConfirm.name}\" khỏi danh sách yêu thích?`}
          confirmText="Gỡ ra"
          cancelText="Hủy"
          type="warning"
        />
      </div>
    </>
  );
};

export default ShoppingCart;