import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import Modal from '../../components/ui/Modal'; // Import Modal
import API from '../../lib/api';
import { getUserOrderById } from '../../lib/orderApi';
import { useToast } from '../../components/ui/ToastProvider'; // Use Toast
import usePaymentSocket from '../../hooks/usePaymentSocket'; // Import socket hook

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({}); // Stores { image, name, price }
  
  // SePay States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [sepayQrData, setSepayQrData] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [waitingForPayment, setWaitingForPayment] = useState(false);

  // Định nghĩa các trạng thái đơn hàng và màu sắc tương ứng
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'shipping': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'completed': 'bg-green-100 text-green-800',
  };

  // Định nghĩa các phương thức thanh toán
  const paymentMethods = {
    'cod': 'Thanh toán khi nhận hàng (COD)',
    'vnpay': 'VNPay',
    'momo': 'Ví MoMo',
    'zalopay': 'ZaloPay',
    'banking': 'Chuyển khoản ngân hàng',
    'credit': 'Thẻ tín dụng/ghi nợ',
    'sepay': 'Chuyển khoản ngân hàng (QR Code)'
  };
    
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const orderData = await getUserOrderById(orderId);
      if (orderData) {
        setOrder(orderData);
      } else {
        setError('Không tìm thấy thông tin đơn hàng.');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Không tìm thấy thông tin đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng.');
      setLoading(false);
      return;
    }
    fetchOrder();
  }, [orderId]);

  // SePay Logic - Socket
  // Pass userId only if order exists (or assume logged in user is viewing)
  // Since this is UserOrderDetail, presumably user is logged in. 
  // But let's check order.user_id if available or just listen generally if logic allows.
  // The hook usually takes userId.
  const { paymentSuccessData } = usePaymentSocket(order?.user_id || order?.userId);

  // Watch for payment success
  useEffect(() => {
    if (paymentSuccessData && waitingForPayment) {
      const paidOrderId = paymentSuccessData.orderId;
      // Ensure specific order match if needed, or if we are watching this order specifically
      // paymentSuccessData usually contains orderId.
      if (paidOrderId === (order?.id || order?._id)) {
          console.log('Payment success received for this order!', paymentSuccessData);
          setWaitingForPayment(false);
          setShowPaymentModal(false);
          toast.push({ title: 'Thanh toán thành công', message: 'Đơn hàng đã được thanh toán', type: 'success' });
          // Refresh order data
          fetchOrder();
      }
    }
  }, [paymentSuccessData, waitingForPayment, order, toast]);

  const normalizeProductId = (value) => {
    if (value == null) return null;
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }
    if (typeof value === 'object') {
      if (typeof value.$oid === 'string') return value.$oid;
      if (typeof value.$id === 'string') return value.$id;
      if (typeof value.oid === 'string') return value.oid;
      if (value.id) return normalizeProductId(value.id);
      if (value._id) return normalizeProductId(value._id);
    }
    return null;
  };

  const getItemProductId = (item = {}) => {
    const candidates = [
      item.productId,
      item.product_id,
      item.product?.productId,
      item.product?.product_id,
      item.product?.id,
      item.product?._id,
      item.product?._id?.$oid,
      item.snapshot?.productId,
      item.snapshot?.product_id,
      item.snapshot?.product?.id,
      item.snapshot?.product?._id,
    ];

    for (const candidate of candidates) {
      const normalized = normalizeProductId(candidate);
      if (normalized) return normalized;
    }

    if (typeof item.product === 'string') return item.product;
    return null;
  };

  const selectProductImage = (product = {}) => {
    if (!product) return null;
    if (Array.isArray(product.images) && product.images.length) {
      const first = product.images[0];
      if (typeof first === 'string') return first;
      return first?.image_url || first?.url || first?.imageUrl || first?.src || null;
    }
    if (product.primaryImage) {
      return product.primaryImage?.image_url || product.primaryImage?.url || product.primaryImage;
    }
    const mediaEntry = Array.isArray(product.media) ? product.media[0] : null;
    return (
      product.image
      || product.coverImage
      || product.thumbnail
      || product.featuredImage
      || mediaEntry?.url
      || mediaEntry?.image_url
      || null
    );
  };

  useEffect(() => {
    if (!order?.items || order.items.length === 0) return;

    const missingIds = order.items.reduce((acc, item) => {
      const productId = getItemProductId(item);
      if (!productId) return acc;
      
      if (productDetails[productId]) return acc;
      if (!acc.includes(productId)) acc.push(productId);
      return acc;
    }, []);

    if (missingIds.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const responses = await Promise.allSettled(
          missingIds.map((id) => API.get(`/api/products/${encodeURIComponent(id)}`))
        );
        if (cancelled) return;
        setProductDetails((prev) => {
          const next = { ...prev };
          responses.forEach((res, index) => {
            if (res.status !== 'fulfilled') return;
            const productData = res.value?.data?.product || res.value?.data || res.value;
            const image = selectProductImage(productData);
            next[missingIds[index]] = {
              image: image,
              price: productData.price,
              name: productData.name
            };
          });
          return next;
        });
      } catch (err) {
        console.error('Không thể tải thông tin sản phẩm từ product_id', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [order, productDetails]);

  const resolveItemImage = (item = {}) => {
    const productId = getItemProductId(item);
    // Prioritize fresh detail from DB if available
    if (productId && productDetails[productId]?.image) {
      return productDetails[productId].image;
    }
    
    // Fallback to snapshot/inline image
    const inlineImage = item.image
      || item.productImage
      || item.snapshot?.image
      || item.product?.image
      || item.product?.primaryImage;
    if (inlineImage) return inlineImage;
    
    return null;
  };

  const resolveItemName = (item = {}) => {
    const productId = getItemProductId(item);
    if (productId && productDetails[productId]?.name) {
      return productDetails[productId].name;
    }
    return item.productName || item.name || 'Sản phẩm';
  };

  const resolveItemPrice = (item = {}) => {
    // Return unit price if valid (> 0)
    const p = item.price || item.unitPrice || 0;
    if (p > 0) return p;

    // Fallback to fetched price
    const productId = getItemProductId(item);
    if (productId && productDetails[productId]) {
       return productDetails[productId].price || 0;
    }
    return 0;
  };

  // Hàm định dạng ngày giờ
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (price) => {
    const val = Number(price);
    if (isNaN(val)) return '0 đ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(val);
  };

  // Hàm xử lý thanh toán ngay
  const handlePayNow = async () => {
    // Nếu là sepay hoặc banking (mapped to sepay logic if desired)
    // Here allow 'sepay' and 'banking' to try SePay QR if configured.
    if (paymentMethod === 'sepay' || paymentMethod === 'banking') {
        try {
            setLoadingQr(true);
            const sepayRes = await API.post('/api/payment/sepay/init', {
                orderId: displayOrderId
            });

            if (sepayRes.data && sepayRes.data.success) {
                setSepayQrData(sepayRes.data.data);
                setWaitingForPayment(true);
                setShowPaymentModal(true);
            } else {
                 toast.push({ title: 'Lỗi', message: 'Không thể tạo mã QR thanh toán', type: 'error' });
            }
        } catch (e) {
            console.error('SePay Init Error:', e);
            toast.push({ title: 'Lỗi', message: e.message || 'Có lỗi xảy ra', type: 'error' });
        } finally {
            setLoadingQr(false);
        }
    } else {
        toast.push({ title: 'Thông báo', message: 'Chức năng thanh toán online cho phương thức này đang được cập nhật.', type: 'info' });
    }
  };

  // Hàm lấy trạng thái đơn hàng với màu sắc
  const getStatusBadge = (status) => {
    const defaultClass = 'bg-gray-100 text-gray-800';
    const colorClass = statusColors[status] || defaultClass;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status === 'pending' && 'Chờ xác nhận'}
        {status === 'confirmed' && 'Đã xác nhận'}
        {status === 'shipping' && 'Đang vận chuyển'}
        {status === 'delivered' && 'Đã giao hàng'}
        {status === 'cancelled' && 'Đã hủy'}
        {status === 'completed' && 'Hoàn thành'}
        {!['pending', 'confirmed', 'shipping', 'delivered', 'cancelled', 'completed'].includes(status) && status}
      </span>
    );
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 max-w-5xl mx-auto px-4 pb-12">
          <div className="bg-card rounded-lg p-8 shadow border border-border flex flex-col items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Đang tải thông tin đơn hàng...</p>
          </div>
        </main>
      </div>
    );
  }

  // Hiển thị trạng thái lỗi
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 max-w-5xl mx-auto px-4 pb-12">
          <div className="bg-card rounded-lg p-8 shadow border border-border flex flex-col items-center justify-center h-64">
            <Icon name="alert-circle" className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-4">
              <Button onClick={() => navigate('/user-orders')} variant="outline">
                Xem tất cả đơn hàng
              </Button>
              <Button onClick={() => navigate('/')}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Nếu không có dữ liệu đơn hàng
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 max-w-5xl mx-auto px-4 pb-12">
          <div className="bg-card rounded-lg p-8 shadow border border-border flex flex-col items-center justify-center h-64">
            <Icon name="box" className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không có thông tin đơn hàng</h2>
            <p className="text-muted-foreground mb-6">Không tìm thấy thông tin về đơn hàng này.</p>
            <div className="flex gap-4">
              <Button onClick={() => navigate('/user-orders')} variant="outline">
                Xem tất cả đơn hàng
              </Button>
              <Button onClick={() => navigate('/')}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ID của đơn hàng (từ MongoDB hoặc từ localStorage)
  const displayOrderId = order.id || order._id;
  // Ngày tạo đơn hàng
  const createdDate = order.createdAt || order.date;
  // Trạng thái đơn hàng
  const orderStatus = order.status || 'pending';
  // Phương thức thanh toán
  const paymentMethod = order.paymentMethod || order.payment_method || 'cod';
  // Trạng thái thanh toán
  const paymentStatus = order.paymentStatus || order.payment_status || 'pending';
  // Danh sách sản phẩm
  const items = order.items || [];
  // Thông tin người nhận
  const shipping = order.shippingAddress || order.shipping_address || {};
  const fullName = shipping.name || shipping.fullName || '';
  const phone = shipping.phone || '';
  const address = shipping.address_line1 || shipping.address || '';
  const district = shipping.district || '';
  const city = shipping.city || '';
  // Tổng tiền
  const subtotal = order.subtotal ?? items.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  const shippingFee = order.shippingFee ?? order.shipping_amount ?? 0;
  const discount = order.discount ?? order.discount_amount ?? 0;
  const total = order.total ?? order.total_amount ?? (subtotal + shippingFee - discount);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 max-w-5xl mx-auto px-4 pb-12">
        {/* Phần tiêu đề và trạng thái */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{displayOrderId}</h1>
              {getStatusBadge(orderStatus)}
            </div>
            <p className="text-muted-foreground">Đặt ngày {formatDate(createdDate)}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-3">
            {/* Nút in đơn hàng */}
            <Button variant="outline" className="flex items-center gap-2" onClick={() => window.print()}>
              <Icon name="printer" className="w-4 h-4" /> In đơn hàng
            </Button>
            
            {/* Nút hủy đơn hàng - chỉ hiển thị khi đơn hàng đang chờ xác nhận */}
            {orderStatus === 'pending' && (
              <Button variant="destructive" className="flex items-center gap-2">
                <Icon name="x-circle" className="w-4 h-4" /> Hủy đơn hàng
              </Button>
            )}
          </div>
        </div>
        
        {/* Container chính */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Phần thông tin chính - chiếm 2/3 màn hình lớn */}
          <div className="lg:col-span-2 space-y-6">
            {/* Danh sách sản phẩm */}
            <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-semibold text-lg">Sản phẩm đã mua</h2>
              </div>
              <div className="divide-y divide-border">
                {items.length > 0 ? items.map((item, index) => {
                  const resolvedImage = resolveItemImage(item);
                  const resolvedName = resolveItemName(item);
                  const resolvedPrice = resolveItemPrice(item);
                  const totalPrice = resolvedPrice * (item.quantity || 1);

                  return (
                    <div key={item.productId || item.id || index} className="p-4 md:p-6 flex items-center">
                      {/* Hình ảnh sản phẩm */}
                      <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden mr-4">
                        {resolvedImage ? (
                          <img src={resolvedImage} alt={resolvedName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10">
                            <Icon name="image" className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Thông tin sản phẩm */}
                      <div className="flex-1">
                        <h3 className="font-medium">{resolvedName}</h3>
                        {item.variant && <p className="text-sm text-muted-foreground">Phân loại: {item.variant}</p>}
                        <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                      </div>
                      
                      {/* Giá sản phẩm */}
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(resolvedPrice)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(totalPrice)}
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="p-6 text-center text-muted-foreground">Không có sản phẩm nào.</p>
                )}
              </div>
            </div>
            
            {/* Thông tin vận chuyển */}
            <div className="bg-card rounded-lg shadow border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="font-semibold text-lg">Thông tin vận chuyển</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:gap-12">
                  {/* Địa chỉ nhận hàng */}
                  <div className="flex-1 mb-6 md:mb-0">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Icon name="map-pin" className="w-4 h-4" /> Địa chỉ nhận hàng
                    </h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p className="font-medium text-foreground">{fullName}</p>
                      <p>{phone}</p>
                      <p>{address}</p>
                      <p>{district}, {city}</p>
                    </div>
                  </div>
                  
                  {/* Phương thức vận chuyển */}
                  <div className="flex-1">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Icon name="truck" className="w-4 h-4" /> Phương thức vận chuyển
                    </h3>
                    <p className="text-muted-foreground">Giao hàng tiêu chuẩn</p>
                    
                    {/* Timeline vận chuyển */}
                    <div className="mt-4 space-y-3">
                      {['confirmed', 'shipping', 'delivered', 'completed'].includes(orderStatus) && (
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <Icon name="check" className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">Đã xác nhận</p>
                            <p className="text-xs text-muted-foreground">
                              Đơn hàng đã được xác nhận
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {['shipping', 'delivered', 'completed'].includes(orderStatus) && (
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <Icon name="check" className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">Đang vận chuyển</p>
                            <p className="text-xs text-muted-foreground">
                              Đơn hàng đang được giao đến bạn
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {['delivered', 'completed'].includes(orderStatus) && (
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <Icon name="check" className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">Đã giao hàng</p>
                            <p className="text-xs text-muted-foreground">
                              Đơn hàng đã được giao thành công
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {orderStatus === 'completed' && (
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <Icon name="check" className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">Hoàn thành</p>
                            <p className="text-xs text-muted-foreground">
                              Đơn hàng đã hoàn thành
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {orderStatus === 'cancelled' && (
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
                            <Icon name="x" className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">Đã hủy</p>
                            <p className="text-xs text-muted-foreground">
                              Đơn hàng đã bị hủy
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Phần bên phải - tóm tắt và thanh toán */}
          <div className="space-y-6">
            {/* Tóm tắt đơn hàng */}
            <div className="bg-card rounded-lg shadow border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="font-semibold text-lg">Tóm tắt đơn hàng</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giảm giá</span>
                    <span className="text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-4 flex justify-between font-medium">
                  <span>Tổng cộng</span>
                  <span className="text-lg text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            {/* Thông tin thanh toán */}
            <div className="bg-card rounded-lg shadow border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="font-semibold text-lg">Thông tin thanh toán</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phương thức</span>
                  <span>{paymentMethods[paymentMethod] || paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <span className={paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                    {paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
                
                {/* Hiển thị nút thanh toán nếu đơn hàng chưa thanh toán và không phải COD */}
                {paymentStatus !== 'paid' && paymentMethod !== 'cod' && orderStatus !== 'cancelled' && (
                  <Button 
                     className="w-full mt-4" 
                     onClick={handlePayNow}
                     loading={loadingQr}
                     disabled={loadingQr}
                  >
                    Thanh toán ngay
                  </Button>
                )}
              </div>
            </div>
            
            {/* Hỗ trợ */}
            <div className="bg-card rounded-lg shadow border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="font-semibold text-lg">Hỗ trợ</h2>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-4">
                  Nếu bạn có thắc mắc về đơn hàng này, vui lòng liên hệ với chúng tôi.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Icon name="message-circle" className="w-4 h-4" /> Nhắn tin với chúng tôi
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Icon name="phone" className="w-4 h-4" /> 1800 1234
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      <Modal 
        open={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        title="Quét mã QR để thanh toán"
      >
        {sepayQrData ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  Vui lòng sử dụng ứng dụng ngân hàng để quét mã QR bên dưới.<br/>
                  Hệ thống sẽ tự động xác nhận sau khi bạn chuyển khoản thành công.
                </p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-lg border border-border mb-6">
                <img 
                  src={sepayQrData.qrUrl} 
                  alt="QR Code thanh toán" 
                  className="w-64 h-64 object-contain"
                />
            </div>
            
            <div className="w-full bg-accent/5 p-4 rounded-lg mb-6 text-sm">
                <div className="flex justify-between mb-2 pb-2 border-b border-accent/10">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span className="font-semibold">{sepayQrData.bankCode}</span>
                </div>
                <div className="flex justify-between mb-2 pb-2 border-b border-accent/10">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <span className="font-semibold">{sepayQrData.accountNumber}</span>
                </div>
                <div className="flex justify-between mb-2 pb-2 border-b border-accent/10">
                  <span className="text-muted-foreground">Chủ tài khoản:</span>
                  <span className="font-semibold">{sepayQrData.accountName}</span>
                </div>
                <div className="flex justify-between mb-2 pb-2 border-b border-accent/10">
                   <span className="text-muted-foreground">Số tiền:</span>
                   <span className="font-semibold text-secondary">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nội dung CK:</span>
                  <span className="font-bold text-accent">{sepayQrData.description}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-3 rounded-lg w-full mb-6 justify-center">
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full flex-shrink-0"></div>
                <span className="text-sm font-medium">Đang chờ thanh toán...</span>
            </div>
          </div>
        ) : (
             <div className="text-center py-8">
                 <p>Đang tải thông tin thanh toán...</p>
             </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderDetail;