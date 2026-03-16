
import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/ToastProvider';
import { createOrder as createOrderApi } from '../../lib/orderApi';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';
import { validateCoupon } from '../../lib/api';
import { getAddresses, getDefaultAddress, formatAddress, formatShortAddress } from '../../lib/addressApi';

const Checkout = ({ embedded = false }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  
  // Helper function để format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);
  };
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  
  // 3NF: Saved addresses từ Address collection
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressMode, setAddressMode] = useState('saved'); // 'saved' or 'new'
  const [addressLoading, setAddressLoading] = useState(false);
  
  // Lấy thông tin giỏ hàng từ Redux store
  const { cartItems, total: cartTotal } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth || {});

  // 3NF: Load saved addresses khi user đăng nhập
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) return;
      
      try {
        setAddressLoading(true);
        const addresses = await getAddresses();
        setSavedAddresses(addresses || []);
        
        // Tự động chọn địa chỉ mặc định
        const defaultAddr = addresses?.find(a => a.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
          setAddressMode('saved');
          // Fill form với địa chỉ mặc định
          fillAddressForm(defaultAddr);
        } else if (addresses?.length > 0) {
          setSelectedAddressId(addresses[0]._id);
          setAddressMode('saved');
          fillAddressForm(addresses[0]);
        } else {
          // Không có địa chỉ lưu, chuyển sang mode mới
          setAddressMode('new');
        }
      } catch (e) {
        console.error('Failed to load addresses:', e);
      } finally {
        setAddressLoading(false);
      }
    };
    
    loadAddresses();
  }, [user]);

  // Fill form khi chọn địa chỉ đã lưu
  const fillAddressForm = (addr) => {
    if (!addr) return;
    setName(addr.fullName || addr.full_name || user?.name || '');
    setPhone(addr.phone || '');
    setAddress(formatAddress(addr));
  };

  // Handle select saved address
  const handleSelectAddress = (addrId) => {
    setSelectedAddressId(addrId);
    const addr = savedAddresses.find(a => a._id === addrId);
    if (addr) {
      fillAddressForm(addr);
    }
  };

  // Điền sẵn thông tin người dùng nếu đã đăng nhập và không có saved addresses
  useEffect(() => {
    if (user && savedAddresses.length === 0) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    } else if (user) {
      setEmail(user.email || '');
    }
  }, [user, savedAddresses.length]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.push({ title: 'Lỗi', message: 'Vui lòng nhập mã giảm giá', type: 'error' });
      return;
    }

    try {
      setCouponLoading(true);
      const orderAmount = cartTotal || cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const result = await validateCoupon(couponCode.trim(), orderAmount);
      setAppliedCoupon(result.coupon);
      toast.push({ title: 'Thành công', message: `Đã áp dụng mã giảm giá ${result.coupon.name}`, type: 'success' });
    } catch (error) {
      const message = error.response?.data?.message || 'Mã giảm giá không hợp lệ';
      toast.push({ title: 'Lỗi', message, type: 'error' });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.push({ title: 'Đã gỡ', message: 'Đã gỡ mã giảm giá', type: 'info' });
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountAmount || 0;
  };

  const calculateFinalTotal = () => {
    const subtotal = cartTotal || cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return Math.max(0, subtotal - calculateDiscount());
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.push({ message: 'Giỏ hàng của bạn đang trống', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      
      // Tính toán tổng tiền (nếu cartTotal không có sẵn)
      const calculatedTotal = cartTotal || cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const discountAmount = calculateDiscount();
      const finalTotal = calculatedTotal - discountAmount;
      
      // 3NF: Get selected address or create new address info
      let addressInfo;
      let shippingAddressId = null;
      
      if (addressMode === 'saved' && selectedAddressId) {
        // Use saved address - pass shipping_address_id for 3NF reference
        const selectedAddr = savedAddresses.find(a => a._id === selectedAddressId);
        shippingAddressId = selectedAddressId;
        addressInfo = {
          name: selectedAddr?.recipient_name || name,
          email,
          phone: selectedAddr?.phone || phone,
          address_line1: selectedAddr?.address_line1 || '',
          address_line2: selectedAddr?.address_line2 || '',
          ward: selectedAddr?.ward || '',
          district: selectedAddr?.district || '',
          city: selectedAddr?.city || '',
          state: selectedAddr?.state || '',
          postal_code: selectedAddr?.postal_code || '',
          country: selectedAddr?.country || 'Vietnam'
        };
      } else {
        // New address entered manually
        addressInfo = {
          name,
          email,
          phone,
          address_line1: address,
          city: '', // Bổ sung nếu có
          state: '', // Bổ sung nếu có
          postal_code: '', // Bổ sung nếu có
          country: 'Vietnam'
        };
      }
      
      // Chuẩn bị dữ liệu đơn hàng để khớp với mô hình Order của backend
      const orderData = {
        // Thông tin đơn hàng chính theo cấu trúc mô hình Order.js
        subtotal: calculatedTotal,
        total_amount: finalTotal,
        discount_amount: discountAmount,
        billing_address: addressInfo,
        shipping_address: addressInfo,
        // 3NF: shipping_address_id reference
        shipping_address_id: shippingAddressId,
        payment_method: paymentMethod,
        order_number: `ORD-${Date.now()}`,
        
        // Coupon info
        coupon_code: appliedCoupon?.code,
        coupon_discount: discountAmount,
        
        // Thông tin sản phẩm
        items: cartItems.map(item => ({
          product_id: item.productId || item.id || item._id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: (item.price || 0) * (item.quantity || 1),
          product_name: item.name,
          product_image_url: item.image || item.imageUrl || '',
          variant_id: item.variant_id || null,
          // Optional: pass explicit attributes as a convenience (server will snapshot from variant_id if present)
          variant_attributes: (item.selectedSize || item.selectedColor) ? { size: item.selectedSize || undefined, color: item.selectedColor || undefined } : undefined,
          variant_name: (item.selectedSize || item.selectedColor)
            ? `${item.selectedSize ? `Size: ${item.selectedSize}` : ''}${item.selectedColor ? `${item.selectedSize ? ', ' : ''}Màu: ${item.selectedColor}` : ''}`
            : undefined,
        })),
        
        // Thông tin cho frontend (sẽ được backend lưu trong items)
        guest_email: email,
      };
      
      console.log('Gửi đơn hàng với dữ liệu:', orderData);
      
      // Kiểm tra token xác thực trước khi gửi
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Không tìm thấy token xác thực! Đơn hàng sẽ được tạo dưới dạng khách.');
      }
      
      // Lưu guest email để FE có thể lọc đơn theo email nếu backend hỗ trợ
      if (!token && email) {
        try { localStorage.setItem('guest_email', email); } catch (e) {}
      }

      // Gửi đơn hàng lên server qua orderApi wrapper (POST /api/orders)
      const response = await createOrderApi(orderData);
      console.log('Kết quả từ server:', response);
      
      if (response) {
        // Xác định ID đơn hàng từ response (linh hoạt theo nhiều định dạng)
        const orderId = response._id 
                      || response.id 
                      || response.order?._id 
                      || response.data?._id 
                      || response.data?.order?._id;
        
        if (!orderId) {
          console.error('Không tìm thấy ID đơn hàng trong response:', response.data);
          throw new Error('Không nhận được mã đơn hàng từ server');
        }
        
        // Không lưu vào localStorage nữa để tránh hiển thị dữ liệu mẫu
        
        // Xóa giỏ hàng sau khi đặt hàng thành công
        dispatch(clearCart());
        
    // Thông báo thành công
    toast.push({ message: 'Đặt hàng thành công!', type: 'success' });
        
    // Chuyển hướng đến trang xác nhận đơn hàng và truyền kèm dữ liệu đơn hàng
    navigate(`/order-confirmation/${orderId}` , { state: { order: response }});
      } else {
        throw new Error('Không nhận được phản hồi từ server');
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      // Hiển thị chi tiết lỗi từ server nếu có
      const errorMessage = error.response?.data?.message || 
                          'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.';
      toast.push({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // When embedded inside UserDashboard we don't render the site Header or full-page wrapper
  if (embedded) {
    return (
      <div className="">
        <section className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Thanh toán</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {/* 3NF: Address selection for logged-in users */}
            {user && savedAddresses.length > 0 && (
              <div className="mb-4">
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="addressModeEmbed"
                      value="saved"
                      checked={addressMode === 'saved'}
                      onChange={() => {
                        setAddressMode('saved');
                        if (savedAddresses.length > 0) {
                          const firstAddr = savedAddresses.find(a => a.is_default) || savedAddresses[0];
                          handleSelectAddress(firstAddr._id);
                        }
                      }}
                      className="form-radio"
                    />
                    <span>Địa chỉ đã lưu</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="addressModeEmbed"
                      value="new"
                      checked={addressMode === 'new'}
                      onChange={() => {
                        setAddressMode('new');
                        setSelectedAddressId(null);
                        setName(user?.name || '');
                        setPhone(user?.phone || '');
                        setAddress('');
                      }}
                      className="form-radio"
                    />
                    <span>Nhập địa chỉ mới</span>
                  </label>
                </div>
                
                {/* Saved addresses list */}
                {addressMode === 'saved' && (
                  <div className="space-y-2">
                    {addressLoading ? (
                      <p className="text-muted-foreground">Đang tải địa chỉ...</p>
                    ) : (
                      savedAddresses.map((addr) => (
                        <label
                          key={addr._id}
                          className={`flex items-start p-3 border rounded-lg cursor-pointer ${
                            selectedAddressId === addr._id ? 'border-accent bg-accent/5' : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="savedAddressEmbed"
                            value={addr._id}
                            checked={selectedAddressId === addr._id}
                            onChange={() => handleSelectAddress(addr._id)}
                            className="form-radio mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{addr.recipient_name || addr.label || 'Địa chỉ'}</span>
                              {addr.is_default && (
                                <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">Mặc định</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatShortAddress(addr)}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* New address form */}
            {(!user || savedAddresses.length === 0 || addressMode === 'new') && (
              <div className="space-y-3">
                <input 
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  placeholder="Họ và tên" 
                  className="w-full p-3 border rounded" 
                  required 
                />
                <input 
                  type="email"
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  placeholder="Email" 
                  className="w-full p-3 border rounded" 
                  required 
                />
                <input 
                  value={phone} 
                  onChange={e=>setPhone(e.target.value)} 
                  placeholder="Số điện thoại" 
                  className="w-full p-3 border rounded" 
                  required 
                />
                <input 
                  value={address} 
                  onChange={e=>setAddress(e.target.value)} 
                  placeholder="Địa chỉ giao hàng" 
                  className="w-full p-3 border rounded" 
                  required 
                />
              </div>
            )}
            
            {/* Email for saved address mode */}
            {user && addressMode === 'saved' && (
              <input 
                type="email"
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                placeholder="Email" 
                className="w-full p-3 border rounded" 
                required 
              />
            )}
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="form-radio"
                />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition-colors"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Thanh toán</h2>
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Thông tin giao hàng</h3>
            
            {/* 3NF: Address selection for logged-in users */}
            {user && savedAddresses.length > 0 && (
              <div className="mb-4">
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="addressMode"
                      value="saved"
                      checked={addressMode === 'saved'}
                      onChange={() => {
                        setAddressMode('saved');
                        if (savedAddresses.length > 0) {
                          const firstAddr = savedAddresses.find(a => a.is_default) || savedAddresses[0];
                          handleSelectAddress(firstAddr._id);
                        }
                      }}
                      className="form-radio text-accent"
                    />
                    <span>Địa chỉ đã lưu</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="addressMode"
                      value="new"
                      checked={addressMode === 'new'}
                      onChange={() => {
                        setAddressMode('new');
                        setSelectedAddressId(null);
                        setName(user?.name || '');
                        setPhone(user?.phone || '');
                        setAddress('');
                      }}
                      className="form-radio text-accent"
                    />
                    <span>Nhập địa chỉ mới</span>
                  </label>
                </div>
                
                {/* Saved addresses list */}
                {addressMode === 'saved' && (
                  <div className="space-y-2">
                    {addressLoading ? (
                      <p className="text-muted-foreground">Đang tải địa chỉ...</p>
                    ) : (
                      savedAddresses.map((addr) => (
                        <label
                          key={addr._id}
                          className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === addr._id 
                              ? 'border-accent bg-accent/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="savedAddress"
                            value={addr._id}
                            checked={selectedAddressId === addr._id}
                            onChange={() => handleSelectAddress(addr._id)}
                            className="form-radio text-accent mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{addr.recipient_name || addr.label || 'Địa chỉ'}</span>
                              {addr.is_default && (
                                <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">Mặc định</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatShortAddress(addr)}
                            </p>
                            {addr.phone && (
                              <p className="text-sm text-muted-foreground">SĐT: {addr.phone}</p>
                            )}
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* New address form - shown when no saved addresses or choosing new */}
            {(!user || savedAddresses.length === 0 || addressMode === 'new') && (
              <div className="space-y-3">
                <input 
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  placeholder="Họ và tên" 
                  className="w-full p-3 border rounded" 
                  required 
                />
                <input 
                  type="email"
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  placeholder="Email" 
                  className="w-full p-3 border rounded" 
                  required 
                />
                <input 
                  value={phone} 
                  onChange={e=>setPhone(e.target.value)} 
                  placeholder="Số điện thoại" 
                  className="w-full p-3 border rounded" 
                  required 
                />
                <input 
                  value={address} 
                  onChange={e=>setAddress(e.target.value)} 
                  placeholder="Địa chỉ giao hàng" 
                  className="w-full p-3 border rounded" 
                  required 
                />
              </div>
            )}
            
            {/* Email field for logged-in users with saved address */}
            {user && addressMode === 'saved' && (
              <div className="mt-3">
                <input 
                  type="email"
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  placeholder="Email" 
                  className="w-full p-3 border rounded" 
                  required 
                />
              </div>
            )}
          </div>
          
          {/* Mã giảm giá */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Mã giảm giá</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="flex-1 p-3 border rounded"
                disabled={couponLoading || !!appliedCoupon}
              />
              {!appliedCoupon ? (
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-4 py-3 bg-accent text-white rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {couponLoading ? 'Đang áp dụng...' : 'Áp dụng'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Gỡ bỏ
                </button>
              )}
            </div>
            {appliedCoupon && (
              <p className="text-green-600 text-sm mt-2">
                ✓ Đã áp dụng: {appliedCoupon.name} - Giảm {formatPrice(appliedCoupon.discountAmount)}
              </p>
            )}
          </div>
          
          {/* Hiển thị tổng tiền */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Tóm tắt đơn hàng</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatPrice(cartTotal || cartItems.reduce((total, item) => total + (item.price * item.quantity), 0))}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá ({appliedCoupon.name}):</span>
                  <span>-{formatPrice(calculateDiscount())}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Tổng cộng:</span>
                <span>{formatPrice(calculateFinalTotal())}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="form-radio"
                />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="form-radio"
                />
                <span>Chuyển khoản ngân hàng</span>
              </label>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between mb-2">
              <span>Tổng tiền hàng:</span>
              <span>{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(cartTotal || 0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Tổng thanh toán:</span>
              <span>{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(cartTotal || 0)}</span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="px-6 py-2 bg-accent text-white rounded hover:bg-accent/90 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : 'Đặt hàng'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
