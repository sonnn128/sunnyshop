import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import { useToast } from 'components/ui/ToastProvider';
import Select from 'components/ui/Select';
import Input from 'components/ui/Input';
import { Checkbox } from 'components/ui/Checkbox';
import API from 'lib/api';
import { getOrderById, updateOrderStatus } from 'lib/orderApi';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [productImages, setProductImages] = useState({});

  // Define status options
  const statusOptions = [
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang vận chuyển' },
    { value: 'delivered', label: 'Đã giao hàng' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];
  
  // Color mapping for status badges
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'processing': 'bg-indigo-100 text-indigo-800',
    'shipping': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
  };
  
  // Status labels
  const statusLabels = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
  'processing': 'Đang xử lý',
    'shipping': 'Đang vận chuyển',
    'delivered': 'Đã giao hàng',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
  };
  
  // Payment method labels
  const paymentMethods = {
    'cod': 'Thanh toán khi nhận hàng (COD)',
    'vnpay': 'VNPay',
    'momo': 'Ví MoMo',
    'zalopay': 'ZaloPay',
    'banking': 'Chuyển khoản ngân hàng',
    'credit': 'Thẻ tín dụng/ghi nợ'
  };

  // Check for print request in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('print') === 'true') {
      setShowPrintPreview(true);
      
      // Auto print after a short delay to let the preview render
      const timer = setTimeout(() => {
        window.print();
        // Reset URL after printing
        navigate(`/admin-panel/orders/${orderId}`, { replace: true });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [location.search, orderId, navigate]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOrderById(orderId);
        const orderData = response?.order || response;

        if (orderData && (orderData.id || orderData.orderNumber)) {
          setOrder(orderData);
          setNewStatus(orderData.status || 'pending');
        } else {
          setOrder(null);
          setError(`Không tìm thấy thông tin đơn hàng #${orderId}`);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setOrder(null);
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

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
      const hasInlineImage = Boolean(
        item.image
        || item.productImage
        || item.snapshot?.image
        || item.product?.image
        || item.product?.primaryImage
      );
      if (hasInlineImage || productImages[productId]) return acc;
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
        setProductImages((prev) => {
          const next = { ...prev };
          responses.forEach((res, index) => {
            if (res.status !== 'fulfilled') return;
            const productData = res.value?.data?.product || res.value?.data || res.value;
            const image = selectProductImage(productData);
            if (image) next[missingIds[index]] = image;
          });
          return next;
        });
      } catch (err) {
        console.error('Không thể tải hình sản phẩm cho trang quản trị', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [order, productImages]);

  const resolveItemImage = (item = {}) => {
    const inlineImage = item.image
      || item.productImage
      || item.snapshot?.image
      || item.product?.image
      || item.product?.primaryImage;
    if (inlineImage) return inlineImage;
    const productId = getItemProductId(item);
    if (!productId) return null;
    return productImages[productId] || null;
  };

  // Removed mock order generator

  // Handle update status
  const handleUpdateStatus = async () => {
    if (newStatus === order.status) {
      toast.push({ message: 'Vui lòng chọn trạng thái khác với trạng thái hiện tại', type: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      let success = false;
      
      // Try API update first
      try {
        const response = await updateOrderStatus(orderId, newStatus, statusNote);
        
        if (response && response.success) {
          success = true;
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        // Continue with fallback update
      }
      
      // Update local state
      setOrder(prev => ({
        ...prev,
        status: newStatus,
        timeline: [
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: statusNote
          },
          ...(prev.timeline || [])
        ]
      }));
      
      toast.push({ message: `Đã cập nhật trạng thái đơn hàng thành ${statusLabels[newStatus]}`, type: 'success' });
      setShowUpdateForm(false);
      setStatusNote('');
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.push({ message: 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (value) => {
    if (!value) return '';
    const raw = typeof value === 'object' && value.$date ? value.$date : value;
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (typeof amount === 'string') {
      // Try to parse the string as a number
      const parsedAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
      if (!isNaN(parsedAmount)) {
        amount = parsedAmount;
      }
    }
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  // Handle print order
  const handlePrint = () => {
    navigate(`/admin-panel/orders/${orderId}?print=true`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
          <span>Đang tải thông tin đơn hàng...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg p-8 shadow border border-border flex flex-col items-center justify-center h-64">
          <Icon name="alert-circle" className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/admin-panel?tab=orders')}>
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg p-8 shadow border border-border flex flex-col items-center justify-center h-64">
          <Icon name="box" className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-muted-foreground mb-6">Không tìm thấy thông tin đơn hàng #{orderId}</p>
          <Button onClick={() => navigate('/admin-panel?tab=orders')}>
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress || {};
  const billingAddress = order.billingAddress || {};
  const userInfo = order.user || {};
  const customerInfo = order.customer || {};
  const displayOrderNumber = order.orderNumber || order.id;
  const lastUpdatedAt = order.updatedAt || order.updated_at;

  const contactName = shippingAddress.fullName
    || shippingAddress.name
    || customerInfo.name
    || userInfo.name
    || billingAddress.fullName
    || 'Khách hàng';

  const contactEmail = shippingAddress.email
    || customerInfo.email
    || userInfo.email
    || order.guestEmail
    || billingAddress.email
    || '';

  const contactPhone = shippingAddress.phone
    || customerInfo.phone
    || userInfo.phone
    || billingAddress.phone
    || '';

  const shippingAddressLines = [
    shippingAddress.address_line1 || shippingAddress.address || shippingAddress.line1,
    shippingAddress.ward || shippingAddress.commune,
    shippingAddress.district || shippingAddress.districtName,
    shippingAddress.city || shippingAddress.province || shippingAddress.cityName,
  ].filter(Boolean);

  const billingAddressLines = [
    billingAddress.address_line1 || billingAddress.address || billingAddress.line1,
    billingAddress.ward || billingAddress.commune,
    billingAddress.district || billingAddress.districtName,
    billingAddress.city || billingAddress.province || billingAddress.cityName,
  ].filter(Boolean);

  const subtotalAmount = typeof order.subtotal === 'number'
    ? order.subtotal
    : order.items?.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0) || 0;

  const shippingFeeAmount = order.shippingFee ?? order.shipping_amount ?? order.shipping ?? 0;
  const discountAmount = order.discount ?? order.discount_amount ?? 0;
  const totalAmount = order.total ?? order.total_amount ?? (subtotalAmount + shippingFeeAmount - discountAmount);

  const shippingMethodLabel = order.shippingMethod === 'express'
    ? 'Giao hàng nhanh'
    : order.shippingMethod === 'pickup'
      ? 'Nhận tại cửa hàng'
      : 'Giao hàng tiêu chuẩn';

  return (
    <div className={`container mx-auto p-6 ${showPrintPreview ? 'print-container' : ''}`}>
      {/* Print header - only visible when printing */}
      {showPrintPreview && (
        <div className="print-header hidden print:block">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ABC</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center">CHI TIẾT ĐƠN HÀNG #{displayOrderNumber}</h1>
          <p className="text-center text-muted-foreground">Ngày: {formatDate(new Date().toISOString())}</p>
        </div>
      )}
      
      {/* Back button and actions - hidden when printing */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 print:hidden">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin-panel?tab=orders')}
            className="flex items-center gap-2"
          >
            <Icon name="arrow-left" className="w-4 h-4" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-semibold">Chi tiết đơn hàng #{displayOrderNumber}</h1>
          <StatusBadge status={order.status} />
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Icon name="printer" className="w-4 h-4" />
            In đơn hàng
          </Button>
          
          {!showUpdateForm && (
            <Button 
              onClick={() => setShowUpdateForm(true)}
              className="flex items-center gap-2"
            >
              <Icon name="edit" className="w-4 h-4" />
              Cập nhật trạng thái
            </Button>
          )}
        </div>
      </div>
      
      {/* Status update form */}
      {showUpdateForm && (
        <div className="bg-white rounded-lg shadow border border-border p-6 mb-6 print:hidden">
          <h2 className="text-lg font-semibold mb-4">Cập nhật trạng thái đơn hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Trạng thái mới"
              options={statusOptions}
              value={newStatus}
              onChange={(value) => setNewStatus(value)}
              placeholder="Chọn trạng thái mới"
              required
            />
            
            <Input
              label="Ghi chú (không bắt buộc)"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Nhập ghi chú về việc thay đổi trạng thái"
            />
          </div>
          
          <div className="mt-4">
            <Checkbox
              label="Gửi thông báo đến khách hàng"
              checked={sendNotification}
              onChange={() => setSendNotification(!sendNotification)}
            />
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowUpdateForm(false)}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              disabled={loading || newStatus === order.status}
              loading={loading}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Order details and items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order details */}
          <div className="bg-white rounded-lg shadow border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold text-lg">Thông tin đơn hàng</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mã đơn hàng</p>
                  <p className="font-medium">{displayOrderNumber}</p>
                </div>
                {(displayOrderNumber !== order.id) && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mã hệ thống</p>
                    <p>{order.id}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ngày đặt hàng</p>
                  <p>{formatDate(order.createdAt || order.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Trạng thái</p>
                  <StatusBadge status={order.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phương thức thanh toán</p>
                  <p>{paymentMethods[order.paymentMethod] || order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Trạng thái thanh toán</p>
                  <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                    {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
                {order.shippingMethod && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phương thức giao hàng</p>
                    <p>{shippingMethodLabel}</p>
                  </div>
                )}
                {lastUpdatedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cập nhật gần nhất</p>
                    <p>{formatDate(lastUpdatedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Timeline section */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="bg-white rounded-lg shadow border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-semibold text-lg">Lịch sử đơn hàng</h2>
              </div>
              <div className="p-6">
                <ol className="relative border-l border-gray-200 ml-3">
                  {order.timeline.map((event, index) => {
                    const eventTime = event.timestamp || event.time || event.date || event.createdAt || event.updatedAt;
                    return (
                      <li key={index} className="mb-6 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full -left-3 ring-8 ring-white">
                          {event.status === 'cancelled' ? (
                            <Icon name="x-circle" className="w-4 h-4 text-red-500" />
                          ) : (
                            <Icon name="check-circle" className="w-4 h-4 text-green-500" />
                          )}
                        </span>
                        <h3 className="font-medium">
                          {statusLabels[event.status] || event.status}
                        </h3>
                        <time className="block text-sm text-muted-foreground">
                          {eventTime ? formatDate(eventTime) : '—'}
                        </time>
                        {event.note && <p className="text-gray-700 mt-1">{event.note}</p>}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          )}
          
          {/* Order items */}
          <div className="bg-white rounded-lg shadow border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold text-lg">Sản phẩm</h2>
            </div>
            <div className="divide-y divide-border">
              {order.items && order.items.length > 0 ? order.items.map((item, index) => (
                <div key={index} className="p-4 md:p-6 flex items-center">
                  <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden mr-4">
                    {(() => {
                      const resolvedImage = resolveItemImage(item);
                      if (resolvedImage) {
                        return (
                          <img
                            src={resolvedImage}
                            alt={item.name || item.productName || 'Sản phẩm'}
                            className="w-full h-full object-cover"
                          />
                        );
                      }
                      return (
                        <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10">
                          <Icon name="image" className="w-6 h-6 text-muted-foreground" />
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name || item.productName}</h3>
                    {item.variant && <p className="text-sm text-muted-foreground">Phân loại: {item.variant}</p>}
                    <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price ?? item.unitPrice ?? 0)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(((item.price ?? item.unitPrice ?? 0) * (item.quantity || 1)))}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="p-6 text-center text-muted-foreground">Không có sản phẩm nào.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Customer info and summary */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="bg-white rounded-lg shadow border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold text-lg">Thông tin khách hàng</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Họ và tên</p>
                  <p className="font-medium">{contactName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p>{contactEmail || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Số điện thoại</p>
                  <p>{contactPhone || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Địa chỉ giao hàng</p>
                  {shippingAddressLines.length > 0 ? (
                    shippingAddressLines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))
                  ) : (
                    <p>—</p>
                  )}
                </div>
                {billingAddressLines.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Địa chỉ thanh toán</p>
                    {billingAddressLines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                )}
                {userInfo && (userInfo._id || userInfo.id) && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mã khách hàng</p>
                    <p>{userInfo._id?.$oid || userInfo._id || userInfo.id}</p>
                  </div>
                )}
                {customerInfo && customerInfo.code && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mã khách hàng nội bộ</p>
                    <p>{customerInfo.code}</p>
                  </div>
                )}
                {order.shippingMethod && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phương thức giao hàng</p>
                    <p>{shippingMethodLabel}</p>
                  </div>
                )}
                {order.metadata?.source && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nguồn đơn hàng</p>
                    <p>{order.metadata.source}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Open customer details or navigate to customer profile
                    toast.push({ message: 'Tính năng xem chi tiết khách hàng đang được phát triển', type: 'info' });
                  }}
                >
                  Xem thông tin khách hàng
                </Button>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="bg-white rounded-lg shadow border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold text-lg">Tổng quan đơn hàng</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatCurrency(subtotalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span>{formatCurrency(shippingFeeAmount)}</span>
              </div>
              {(discountAmount > 0) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span className="text-green-600">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-border pt-4 flex justify-between font-medium">
                <span>Tổng cộng</span>
                <span className="text-lg text-primary">{formatCurrency(totalAmount)}</span>
              </div>
              {order.notes && (
                <div className="border-t border-border pt-4">
                  <span className="block text-sm text-muted-foreground mb-1">Ghi chú từ khách hàng</span>
                  <p>{order.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Admin actions */}
          <div className="bg-white rounded-lg shadow border border-border overflow-hidden print:hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold text-lg">Hành động</h2>
            </div>
            <div className="p-6 space-y-3">
              {order.status === 'pending' && (
                <Button 
                  className="w-full"
                  onClick={() => {
                    setNewStatus('confirmed');
                    setShowUpdateForm(true);
                  }}
                >
                  Xác nhận đơn hàng
                </Button>
              )}
              
              {order.status === 'confirmed' && (
                <Button 
                  className="w-full"
                  onClick={() => {
                    setNewStatus('shipping');
                    setShowUpdateForm(true);
                  }}
                >
                  Đánh dấu đang giao hàng
                </Button>
              )}
              
              {order.status === 'shipping' && (
                <Button 
                  className="w-full"
                  onClick={() => {
                    setNewStatus('delivered');
                    setShowUpdateForm(true);
                  }}
                >
                  Đánh dấu đã giao hàng
                </Button>
              )}
              
              {order.status === 'delivered' && (
                <Button 
                  className="w-full"
                  onClick={() => {
                    setNewStatus('completed');
                    setShowUpdateForm(true);
                  }}
                >
                  Đánh dấu hoàn thành
                </Button>
              )}
              
              {['pending', 'confirmed', 'shipping'].includes(order.status) && (
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    setNewStatus('cancelled');
                    setShowUpdateForm(true);
                  }}
                >
                  Hủy đơn hàng
                </Button>
              )}
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handlePrint}
              >
                In đơn hàng
              </Button>
              
              {order.paymentStatus !== 'paid' && order.paymentMethod !== 'cod' && (
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast.push({ message: 'Tính năng thanh toán thủ công đang được phát triển', type: 'info' });
                  }}
                >
                  Đánh dấu đã thanh toán
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;