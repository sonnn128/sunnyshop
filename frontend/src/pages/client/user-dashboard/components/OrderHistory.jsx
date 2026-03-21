import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { getUserOrders, updateOrderStatus } from '../../../lib/orderApi';
import API from '../../../lib/api'; // Import API

const OrderHistory = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Pagination state for the widget
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [pagination, setPagination] = useState({ currentPage: 1, perPage: 3, totalPages: 0, totalItems: 0 });
  // Removed demo data generation; only real API data will be shown
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState(null);
  const [productDetails, setProductDetails] = useState({}); // State for fetched product details (image, price, name)

  // Helper functions for image fetching
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
        item.id // In OrderHistory items might just have 'id'
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
    
  // Fetch logic for images/details
  useEffect(() => {
    if (!orders || orders.length === 0) return;

    let allItems = [];
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            allItems = [...allItems, ...order.items];
        }
    });

    if (allItems.length === 0) return;

    const missingIds = allItems.reduce((acc, item) => {
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
            console.error('OrderHistory: Cannot fetch product details', err);
        }
    })();

    return () => {
        cancelled = true;
    };
  }, [orders, productDetails]);

  const resolveItemImage = (item = {}) => {
        const productId = getItemProductId(item);
        if (productId && productDetails[productId]?.image) {
            return productDetails[productId].image;
        }
        return item.image || "/assets/images/no_image.png";
  };

  const resolveItemName = (item = {}) => {
      const productId = getItemProductId(item);
      if (productId && productDetails[productId]?.name) {
          return productDetails[productId].name;
      }
      return item.name || 'Sản phẩm';
  };

  const resolveItemPrice = (item = {}) => {
      // If item has valid price, use it. But if 0, try fallback.
      if (item.unitPrice > 0 || item.price > 0) return item.unitPrice || item.price;
      
      const productId = getItemProductId(item);
      if (productId && productDetails[productId]?.price) {
          return productDetails[productId].price;
      }
      return 0;
  };

  const resolveItemTotal = (item = {}) => {
      const price = resolveItemPrice(item);
      const qty = item.quantity || 1;
      return price * qty;
  };

  // Debug helper for normalized items
  const logOrderItemInfo = useCallback((item, message = 'Order item info') => {
    try {
      console.log(`${message}:`, {
        productId: item.productId,
        productName: item.productName,
        image: item.image,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        variant: item.variant
      });
    } catch (e) {}
  }, []);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const statusParam = (selectedFilter === 'all' || selectedFilter === 'processing') ? undefined : selectedFilter;
      const res = await getUserOrders({ page, limit, status: statusParam, includeDetails: true });

      // eslint-disable-next-line no-console
      console.debug('[OrderHistory] getUserOrders response:', res);

      let list = [];
      let rawPagination = null;
      if (!res) {
        list = [];
      } else if (Array.isArray(res)) {
        list = res;
      } else if (res.orders && Array.isArray(res.orders)) {
        list = res.orders;
        rawPagination = res.pagination || res.meta || res.paging || null;
      } else if (res.data && Array.isArray(res.data)) {
        list = res.data;
        rawPagination = res.pagination || res.meta || res.paging || null;
      } else {
        const maybeOrders = Object.values(res).find(v => Array.isArray(v));
        list = Array.isArray(maybeOrders) ? maybeOrders : [];
        rawPagination = res.pagination || res.meta || res.paging || null;
      }

      const normalizePagination = (p) => {
        if (!p) return { currentPage: page, perPage: limit, totalPages: 0, totalItems: 0 };
        const currentPage = p.currentPage || p.page || p.page_number || p.pageNum || page || 1;
        const perPage = p.perPage || p.per_page || p.limit || p.per_page || limit;
        const totalItems = p.totalItems || p.total_items || p.total || p.count || 0;
        const totalPages = p.totalPages || p.total_pages || (perPage ? Math.ceil(totalItems / perPage) : 0);
        return { currentPage, perPage, totalPages, totalItems };
      };

      const normalizedPagination = normalizePagination(rawPagination);
      setPagination(normalizedPagination);
      if (normalizedPagination && normalizedPagination.currentPage && normalizedPagination.currentPage !== page) {
        setPage(normalizedPagination.currentPage);
      }

      // eslint-disable-next-line no-console
      console.debug('[OrderHistory] orders list count:', Array.isArray(list) ? list.length : 0);
      const mapped = (Array.isArray(list) ? list : []).map(o => {
        let uiStatus = 'processing';
        switch (o.status) {
          case 'pending':
          case 'confirmed':
          case 'processing':
            uiStatus = 'processing';
            break;
          case 'shipping':
            uiStatus = 'shipping';
            break;
          case 'delivered':
          case 'completed':
            uiStatus = 'delivered';
            break;
          case 'cancelled':
            uiStatus = 'cancelled';
            break;
          default:
            uiStatus = 'processing';
        }
        return {
          id: o.id || o._id, // Prefer id or _id
          order_number: o.orderNumber,
          rawStatus: o.status,
          date: o.createdAt,
          status: uiStatus,
          total: o.total,
          subtotal: o.subtotal,
          tax: 0,
          shipping: o.shippingFee || 0,
          discount: o.discount || 0,
          payment_method: o.paymentMethod,
          payment_status: o.paymentStatus,
          customer: o.shippingAddress || o.billingAddress || {},
          notes: o.notes || '',
          items: (o.items || []).map(item => {
            logOrderItemInfo(item, 'Normalized order item');
            let size = item.size || item.selectedSize || item.variant_size || null;
            let color = item.color || item.selectedColor || item.variant_color || null;
            if (!size && item.variantName) {
              const sizeMatch = /Size:\s*([^,]+)/.exec(item.variantName);
              size = sizeMatch ? sizeMatch[1]?.trim() : null;
            }
            if (!color && item.variantName) {
              const colorMatch = /Màu:\s*([^,]+)/.exec(item.variantName);
              color = colorMatch ? colorMatch[1]?.trim() : null;
            }
            return {
              id: item.productId || item.id, // Prefer productId, fallback to local item id
              name: item.productName,
              image: item.image, // Just pass raw, resolveItemImage will handle fallback
              size,
              color,
              quantity: item.quantity,
              price: item.unitPrice || item.price || 0,
              unitPrice: item.unitPrice || item.price || 0,
              totalPrice: item.totalPrice || ((item.unitPrice || item.price || 0) * (item.quantity || 1)),
              variantName: item.variant || null,
              productId: item.productId // Ensure this exists
            };
          }),
          trackingNumber: o.tracking_number || `VN${Math.floor(Math.random() * 1000000000)}`
        };
      });
      mapped.sort((a,b) => new Date(b.date) - new Date(a.date));
      // eslint-disable-next-line no-console
      console.debug('[OrderHistory] mappedOrders count:', mapped.length);
      setOrders(mapped);
      if (Array.isArray(mapped) && mapped.length === 0 && normalizedPagination && normalizedPagination.totalItems > 0 && normalizedPagination.currentPage > 1) {
        // eslint-disable-next-line no-console
        console.debug('[OrderHistory] mapped empty for page, resetting to page 1');
        setPage(1);
        return;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFilter, page, limit, logOrderItemInfo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const statusConfig = {
    processing: { label: 'Đang xử lý', color: 'bg-warning/10 text-warning', icon: 'Clock' },
    shipping: { label: 'Đang giao', color: 'bg-accent/10 text-accent', icon: 'Truck' },
    delivered: { label: 'Đã giao', color: 'bg-success/10 text-success', icon: 'CheckCircle' },
    cancelled: { label: 'Đã hủy', color: 'bg-error/10 text-error', icon: 'XCircle' }
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders?.filter(order => order?.status === selectedFilter);

  // Debug: show filtered count for UI diagnostics
  // eslint-disable-next-line no-console
  console.debug('[OrderHistory] filteredOrders count:', Array.isArray(filteredOrders) ? filteredOrders.length : 0, 'selectedFilter:', selectedFilter);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Pagination helpers mirroring product catalog style
  const totalItems = pagination?.totalItems || 0;
  const perPage = pagination?.perPage || limit;
  const effectiveTotalPages = pagination?.totalPages || Math.max(1, Math.ceil(totalItems / (perPage || 1)));
  const clampedCurrentPage = Math.min(Math.max(1, page), effectiveTotalPages);
  const startItem = totalItems === 0 ? 0 : (clampedCurrentPage - 1) * perPage + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(startItem + perPage - 1, totalItems);
  const showPagination = effectiveTotalPages > 1;

  const goToPage = (p) => {
    const nextPage = Math.min(effectiveTotalPages, Math.max(1, p));
    setPage(nextPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageNumbers = (() => {
    if (!showPagination) return [1];
    if (effectiveTotalPages <= 5) {
      return Array.from({ length: effectiveTotalPages }, (_, index) => index + 1);
    }
    const pages = [1];
    const start = Math.max(2, clampedCurrentPage - 1);
    const end = Math.min(effectiveTotalPages - 1, clampedCurrentPage + 1);
    if (start > 2) pages.push('left-ellipsis');
    for (let pageIdx = start; pageIdx <= end; pageIdx += 1) {
      pages.push(pageIdx);
    }
    if (end < effectiveTotalPages - 1) pages.push('right-ellipsis');
    pages.push(effectiveTotalPages);
    return pages;
  })();
  
  // Show confirmation dialog for order cancellation
  const showCancelConfirmation = (order) => {
    setSelectedOrder(order);
    setShowConfirm(true);
  };
  
  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      const note = selectedOrder.order_number
        ? `Khách hủy đơn hàng #${selectedOrder.order_number} từ trang lịch sử mua hàng`
        : 'Khách hủy đơn hàng từ trang lịch sử mua hàng';
      await updateOrderStatus(selectedOrder.id, 'cancelled', note);
      await fetchOrders();

      setNotification({
        type: 'success',
        message: 'Đơn hàng đã được hủy thành công'
      });
    } catch (error) {
      console.error('Error cancelling order via API:', error);
      // Do not fallback to localStorage or mock data
      setNotification({
        type: 'error',
        message: 'Không thể hủy đơn hàng. Vui lòng thử lại sau.'
      });
    } finally {
      // Hide the confirmation dialog
      setShowConfirm(false);
      setSelectedOrder(null);
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };
  
  // Close the confirmation dialog
  const closeConfirmDialog = () => {
    setShowConfirm(false);
    setSelectedOrder(null);
  };
  
  // Handle repurchase (add to cart)
  const handleRepurchase = (order) => {
    // Get current cart
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add items from order to cart
    const itemsToAdd = order.items.map(item => ({
      id: item.id,
      productId: item.productId,
      name: resolveItemName(item),
      image: resolveItemImage(item),
      price: resolveItemPrice(item),
      selectedSize: item.size,
      selectedColor: item.color,
      quantity: item.quantity
    }));
    
    // Combine current cart with new items
    // Note: In a real app, you might want to check for duplicates
    const updatedCart = [...currentCart, ...itemsToAdd];
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Show notification
    setNotification({
      type: 'success',
      message: `Đã thêm ${itemsToAdd.length} sản phẩm vào giỏ hàng`
    });
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
      // Redirect to cart page
      navigate('/cart');
    }, 1500);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 sm:mb-0">Lịch sử đơn hàng</h2>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={selectedFilter === option?.value ? "default" : "outline"}
              size="sm"
              onClick={() => { setSelectedFilter(option?.value); setPage(1); }}
            >
              {option?.label}
            </Button>
          ))}
        </div>
        {/* Pagination (widget) */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-end mt-4">
            <div className="flex items-center space-x-2">
              <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} className="border px-2 py-1 rounded">
                {[3,5,10].map(n => <option key={n} value={n}>{n} / trang</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin">
            <Icon name="Loader" size={36} className="text-accent" />
          </div>
        </div>
      ) : filteredOrders?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {selectedFilter === 'all' 
              ? 'Bạn chưa có đơn hàng nào' 
              : 'Không có đơn hàng nào thuộc loại này'}
          </p>
          {selectedFilter !== 'all' ? (
            <button 
              onClick={() => setSelectedFilter('all')}
              className="text-accent hover:underline mt-2"
            >
              Xem tất cả đơn hàng
            </button>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="ShoppingBag"
                iconPosition="left"
                onClick={() => window.location.href = '/'}
              >
                Mua sắm ngay
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders?.map((order) => (
            <div key={order?.id} className="border border-border rounded-lg p-4 hover:shadow-elegant transition-smooth">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {order?.order_number ? `Đơn hàng #${order?.order_number}` : `Đơn hàng #${order?.id}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">Ngày đặt: {formatDate(order?.date)}</p>
                    <p className="text-sm text-muted-foreground">
                      <span>Thanh toán: {order?.payment_method === 'cod' ? 'Tiền mặt khi nhận hàng' : order?.payment_method?.toUpperCase()}</span>
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                        order?.payment_status === 'completed' ? 'bg-success/10 text-success' : 
                        order?.payment_status === 'failed' ? 'bg-error/10 text-error' : 
                        'bg-warning/10 text-warning'
                      }`}>
                        {order?.payment_status === 'completed' ? 'Đã thanh toán' : 
                         order?.payment_status === 'failed' ? 'Thất bại' : 
                         'Chờ thanh toán'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1 ${statusConfig?.[order?.status]?.color}`}>
                    <Icon name={statusConfig?.[order?.status]?.icon} size={12} className="mr-1" />
                    {statusConfig?.[order?.status]?.label}
                  </span>
                  <span className="font-semibold text-foreground">{formatPrice(order?.total)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order?.items?.slice(0, 3).map((item) => {
                  logOrderItemInfo(item, `Rendering order item from ${order.id}`);
                  const displayedImage = resolveItemImage(item); // Use resolved image
                  const displayedName = resolveItemName(item);
                  const displayedPrice = resolveItemPrice(item);
                  const displayedTotal = resolveItemTotal(item);
                  
                  return (
                  <div key={`${item?.id}`} className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                      <img
                        src={displayedImage}
                        alt={displayedName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/assets/images/no_image.png";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {displayedName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item?.variantName && <span>{item?.variantName} • </span>}
                        {!item?.variantName && item?.size && <span>Size: {item?.size} • </span>}
                        {!item?.variantName && item?.color && <span>Màu: {item?.color} • </span>}
                        <span>SL: {item?.quantity}</span>
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-medium text-accent">{formatPrice(displayedPrice)}</p>
                        <p className="text-sm font-medium text-muted-foreground">{formatPrice(displayedTotal)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              {order?.items?.length > 3 && (
                <div className="text-sm text-muted-foreground italic text-center pt-1">
                  + {order.items.length - 3} sản phẩm khác
                </div>
              )}
              
              {/* Order Summary */}
              <div className="mt-3 text-sm border-t border-dashed border-border pt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{formatPrice(order?.subtotal || 0)}</span>
                </div>
                {order?.shipping > 0 && (
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Phí vận chuyển:</span>
                    <span>{formatPrice(order?.shipping || 0)}</span>
                  </div>
                )}
                {/* Tax is currently not provided by API, hide when zero */}
                {order?.tax > 0 && (
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Thuế:</span>
                    <span>{formatPrice(order?.tax || 0)}</span>
                  </div>
                )}
                {order?.discount > 0 && (
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Giảm giá:</span>
                    <span className="text-success">-{formatPrice(order?.discount || 0)}</span>
                  </div>
                )}
              </div>

              {/* Shipping Address (Shown only when expanded) */}
              {order?.notes && (
                <div className="mt-2 text-sm border-t border-dashed border-border pt-2">
                  <p className="font-medium text-foreground mb-1">Ghi chú:</p>
                  <p className="text-muted-foreground italic">{order.notes}</p>
                </div>
              )}

              {/* Order Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                <Link to={`/order-detail/${order.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                    className="flex-1 sm:flex-none w-full sm:w-auto"
                  >
                    Xem chi tiết
                  </Button>
                </Link>
                
                {order?.status === 'delivered' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="RotateCcw"
                      iconPosition="left"
                      className="flex-1 sm:flex-none"
                      onClick={() => handleRepurchase(order)}
                    >
                      Mua lại
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Star"
                      iconPosition="left"
                      className="flex-1 sm:flex-none"
                    >
                      Đánh giá
                    </Button>
                  </>
                )}
                
                {order?.status === 'cancelled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RotateCcw"
                    iconPosition="left"
                    className="flex-1 sm:flex-none"
                    onClick={() => handleRepurchase(order)}
                  >
                    Mua lại
                  </Button>
                )}
                
                {order?.status === 'shipping' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="MapPin"
                    iconPosition="left"
                    className="flex-1 sm:flex-none"
                  >
                    Theo dõi đơn #{order.trackingNumber}
                  </Button>
                )}
                
                {order?.status === 'processing' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="MapPin"
                      iconPosition="left"
                      className="flex-1 sm:flex-none"
                    >
                      Theo dõi đơn #{order.trackingNumber}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="X"
                      iconPosition="left"
                      className="flex-1 sm:flex-none text-error border-error hover:bg-error/10"
                      onClick={() => showCancelConfirmation(order)}
                    >
                      Hủy đơn
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination & End Message */}
      {totalItems > 0 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <p className="text-sm text-muted-foreground">Hiển thị {startItem}-{endItem} trong tổng số {totalItems} đơn hàng</p>
          {showPagination && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={clampedCurrentPage === 1}
                onClick={() => goToPage(clampedCurrentPage - 1)}
              >
                <Icon name="ChevronLeft" size={16} />
              </Button>
              {pageNumbers.map((pageNum, index) => {
                if (typeof pageNum === 'string') {
                  return (
                    <span key={`${pageNum}-${index}`} className="px-2 text-sm text-muted-foreground">…</span>
                  );
                }
                const isActive = pageNum === clampedCurrentPage;
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 rounded border transition-colors ${
                      isActive
                        ? 'bg-accent text-white border-accent'
                        : 'bg-muted text-foreground border-border hover:bg-muted/70'
                    }`}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                disabled={clampedCurrentPage === effectiveTotalPages}
                onClick={() => goToPage(clampedCurrentPage + 1)}
              >
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          )}
          {clampedCurrentPage === effectiveTotalPages && totalItems > 0 && (
            <div className="text-center text-muted-foreground mt-4 mb-8 text-sm">Đã xem hết danh sách đơn hàng</div>
          )}
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirm && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 shadow-elegant">
            <h3 className="text-lg font-semibold mb-2">Xác nhận hủy đơn hàng</h3>
            <p className="text-muted-foreground mb-4">
              Bạn có chắc chắn muốn hủy đơn hàng #{selectedOrder.order_number || selectedOrder.id}? 
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={closeConfirmDialog}
              >
                Không, giữ lại
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleCancelOrder}
              >
                Có, hủy đơn hàng
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-elegant z-50 flex items-center gap-2 animate-in slide-in-from-bottom-4 fade-in ${
          notification.type === 'success' ? 'bg-success/10 text-success border border-success' : 
          notification.type === 'error' ? 'bg-error/10 text-error border border-error' : 
          'bg-accent/10 text-accent border border-accent'
        }`}>
          <Icon 
            name={notification.type === 'success' ? 'CheckCircle' : notification.type === 'error' ? 'AlertCircle' : 'Info'} 
            size={18} 
          />
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;