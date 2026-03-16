import api from './api';

// Normalize backend order/item to a consistent FE shape
const normalizeOrderItem = (item = {}) => {
  const productId = item.product_id?.$oid || item.product_id || item.id;
  // Support multiple name variants from API; prefer dedicated fields (variant_size/selectedSize/etc.)
  const size = item.variant_size || item.selectedSize || item.size;
  const color = item.variant_color || item.selectedColor || item.color;
  const variant = item.variant_name
    ? item.variant_name
    : [size ? `Size: ${size}` : null, color ? `Màu: ${color}` : null]
        .filter(Boolean)
        .join(', ') || null;

  return {
    productId,
    productName: item.product_name || item.name || 'Sản phẩm',
    image: item.image_url || item.product_image_url || item.image || '',
    quantity: item.quantity || 1,
    price: item.unit_price || item.price || 0,
    variant,
    variantName: item.variant_name || variant,
    size,
    color,
    unitPrice: item.unit_price || item.price || 0,
    totalPrice: item.total_price || ((item.unit_price || item.price || 0) * (item.quantity || 1)),
  };
};

const normalizeOrder = (raw = {}) => {
  const id = (raw._id && typeof raw._id === 'object' && raw._id.$oid) || raw._id || raw.id;
  const createdAt = (raw.created_at && typeof raw.created_at === 'object' && raw.created_at.$date)
    || raw.created_at
    || raw.createdAt
    || raw.date;
  const subtotal = raw.subtotal || raw.subtotal_amount || 0;
  const shippingFee = raw.shipping_amount || raw.shippingFee || 0;
  const discount = raw.discount_amount || raw.discount || 0;
  const total = raw.total_amount || raw.total || (subtotal + shippingFee - discount);
  const updatedAt = (raw.updated_at && typeof raw.updated_at === 'object' && raw.updated_at.$date)
    || raw.updated_at
    || raw.updatedAt
    || null;

  const userRaw = raw.user || raw.user_id || null;
  const customerRaw = raw.customer || raw.customerInfo || null;
  const timelineRaw = Array.isArray(raw.timeline)
    ? raw.timeline
    : Array.isArray(raw.status_history)
      ? raw.status_history
      : Array.isArray(raw.history)
        ? raw.history
        : [];

  const normalizePerson = (person) => {
    if (!person) return null;
    if (typeof person.toObject === 'function') {
      return person.toObject();
    }
    return person;
  };

  const itemsRaw = Array.isArray(raw.items)
    ? raw.items
    : (Array.isArray(raw.orderItems) ? raw.orderItems : []);

  return {
    id,
    orderNumber: raw.order_number || id,
    createdAt,
     updatedAt,
    status: raw.status || 'pending',
    paymentMethod: raw.payment_method || raw.paymentMethod || 'cod',
    // Accept server-side `payment_status_display` (virtual) when available
    paymentStatus: raw.payment_status_display || raw.payment_status || raw.paymentStatus || 'pending',
    // Prefer snapshot fields when present (3NF migration), fallback to legacy fields
    billingAddress: raw.billing_address_snapshot || raw.billing_address || raw.billingAddress || {},
    shippingAddress: raw.shipping_address_snapshot || raw.shipping_address || raw.shippingAddress || {},
    notes: raw.notes || '',
    guestEmail: raw.guest_email || raw.guestEmail || null,
     user: normalizePerson(userRaw),
     customer: normalizePerson(customerRaw),
    subtotal,
    shippingFee,
    discount,
    total,
    shippingMethod: raw.shipping_method || raw.shippingMethod || 'standard',
    statusHistory: timelineRaw,
    timeline: timelineRaw,
    tags: raw.tags || [],
    metadata: raw.metadata || raw.meta || {},
    items: itemsRaw.map(normalizeOrderItem),
  };
};

// Get user orders
export const getUserOrders = async (options = {}) => {
  const { page, limit, includeDetails, status } = options || {};
  const query = new URLSearchParams();
  if (includeDetails) query.append('includeDetails', 'true');
  if (page) query.append('page', page);
  if (limit) query.append('limit', limit);
  if (status) query.append('status', status);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  const tryPaths = [
    // Prefer the dedicated user endpoint (always returns orders for the current user only)
    // Keep both common variants in case the server exposes one or the other
    `/api/orders/user${suffix}`,
    `/orders/user${suffix}`,
    `/api/user/orders${suffix}`,
    `/user/orders${suffix}`,
    // Fallback to general orders endpoints (admin or user-scoped depending on server-side auth)
    `/api/orders${suffix}`,
    `/orders${suffix}`
  ];
  let lastErr = null;
  let emptyResult = [];
  for (const path of tryPaths) {
    try {
      const response = await api.get(path);
      const list = (response?.data?.orders)
        || (response?.data?.data?.orders)
        || (response?.data?.list)
        || (response?.data?.results)
        || (response?.data?.items)
        || response?.data
        || [];
      if (Array.isArray(list)) {
        const normalized = list.map(normalizeOrder);
        const pagination = response?.data?.pagination || response?.data?.meta || null;
        // If API returns pagination, return object with orders + pagination for the client to consume
        if (pagination) return { orders: normalized, pagination };
        if (normalized.length > 0) {
          return normalized;
        }
        emptyResult = normalized;
        continue;
      }
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  // Fallback: try querying by email for guest orders
  try {
    const guessEmail = () => {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user?.email) return user.email;
      } catch {}
      try { const ge = localStorage.getItem('guest_email'); if (ge) return ge; } catch {}
      try { const re = localStorage.getItem('rememberedEmail'); if (re) return re; } catch {}
      return null;
    };
    const email = guessEmail();
    if (email) {
      const emailPaths = [
        `/api/orders?includeDetails=true&email=${encodeURIComponent(email)}`,
        `/orders?includeDetails=true&email=${encodeURIComponent(email)}`
      ];
      for (const p of emailPaths) {
        try {
          const r = await api.get(p);
          const list2 = (r?.data?.orders)
            || (r?.data?.data?.orders)
            || r?.data
            || [];
          if (Array.isArray(list2)) {
            const normalized = list2.map(normalizeOrder);
            if (normalized.length > 0) {
              return normalized;
            }
            emptyResult = normalized;
          }
        } catch {}
      }
    }
  } catch {}
  if (lastErr) {
    console.error('Error fetching user orders (all fallbacks failed):', lastErr);
    throw lastErr;
  }
  return emptyResult;
};

// Create a new order
export const createOrder = async (orderData) => {
  const tryPaths = ['/api/orders', '/orders'];
  let lastErr = null;
  for (const path of tryPaths) {
    try {
      const response = await api.post(path, orderData);
      const data = response.data || {};
      const order = data.order || data.data || data;
      return normalizeOrder(order);
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  console.error('Error creating order (all fallbacks failed):', lastErr);
  throw lastErr;
};

// Get order by ID (user version)
export const getUserOrderById = async (orderId) => {
  const tryPaths = [
    `/api/orders/${orderId}?includeDetails=true`,
    `/orders/${orderId}?includeDetails=true`,
    `/api/user/orders/${orderId}?includeDetails=true`,
    `/user/orders/${orderId}?includeDetails=true`
  ];
  let lastErr = null;
  for (const path of tryPaths) {
    try {
      const response = await api.get(path);
      const order = response?.data?.order || response?.data?.data?.order || response?.data || {};
      if (order && (order._id || order.id || order.order_number)) {
        return normalizeOrder(order);
      }
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  console.error(`Error fetching user order ${orderId} (all fallbacks failed):`, lastErr);
  throw lastErr;
};

// Get all orders (admin)
export const getAllOrders = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.status) queryParams.append('status', filters.status);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.page) queryParams.append('page', filters.page);
  if (filters.limit) queryParams.append('limit', filters.limit);
  if (filters.includeDetails) queryParams.append('includeDetails', 'true');
  if (filters.email) queryParams.append('email', filters.email);
  if (filters.sort) queryParams.append('sort', filters.sort);

  const queryString = queryParams.toString();
  const tryPaths = [
    `/api/orders${queryString ? `?${queryString}` : ''}`,
    `/orders${queryString ? `?${queryString}` : ''}`,
    `/api/orders/admin${queryString ? `?${queryString}` : ''}`,
    `/orders/admin${queryString ? `?${queryString}` : ''}`,
    `/api/admin/orders${queryString ? `?${queryString}` : ''}`,
    `/admin/orders${queryString ? `?${queryString}` : ''}`,
    `/api/admin/orders/list${queryString ? `?${queryString}` : ''}`,
    `/admin/orders/list${queryString ? `?${queryString}` : ''}`
  ];

  let lastErr = null;
  for (const path of tryPaths) {
    try {
      const response = await api.get(path);
      const data = response?.data || {};
      const list = data.orders
        || data.data?.orders
        || data.results
        || data.items
        || (Array.isArray(data) ? data : []);
      const normalized = Array.isArray(list) ? list.map(normalizeOrder) : [];
      const pagination = data.pagination || data.meta || {
        currentPage: filters.page || 1,
        perPage: filters.limit || normalized.length,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || normalized.length,
      };
      return { orders: normalized, pagination };
    } catch (error) {
      lastErr = error;
      continue;
    }
  }

  console.error('Error fetching all orders (all fallbacks failed):', lastErr);
  throw lastErr;
};

export const getTopSellingProducts = async (limit = 5) => {
  const tryPaths = [
    `/api/orders/top-products?limit=${limit}`,
    `/orders/top-products?limit=${limit}`
  ];
  let lastErr = null;
  for (const path of tryPaths) {
    try {
      const response = await api.get(path);
      const data = response?.data || {};
      if (Array.isArray(data.products)) {
        return data.products;
      }
      if (Array.isArray(data.data)) {
        return data.data;
      }
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  console.error('Error fetching top selling products (all fallbacks failed):', lastErr);
  throw lastErr;
};

// Get order by ID (admin)
export const getOrderById = async (orderId) => {
  const tryPaths = [
    `/api/orders/${orderId}?includeDetails=true`,
    `/orders/${orderId}?includeDetails=true`,
    `/api/orders/admin/${orderId}?includeDetails=true`,
    `/orders/admin/${orderId}?includeDetails=true`
  ];

  let lastErr = null;
  for (const path of tryPaths) {
    try {
      const response = await api.get(path);
      const order = response?.data?.order || response?.data?.data?.order || response?.data;
      if (order && (order._id || order.id || order.order_number)) {
        return normalizeOrder(order);
      }
    } catch (error) {
      lastErr = error;
    }
  }

  console.error(`Error fetching order ${orderId}:`, lastErr);
  throw lastErr;
};

// Update order status (admin)
export const updateOrderStatus = async (orderId, status, note = '') => {
  const payload = { status, note };
  const tryPaths = [
    `/api/orders/${orderId}/status`,
    `/orders/${orderId}/status`,
    `/api/orders/admin/${orderId}/status`,
    `/orders/admin/${orderId}/status`
  ];

  let lastErr = null;
  for (const path of tryPaths) {
    try {
      const response = await api.patch(path, payload);
      return response.data;
    } catch (error) {
      lastErr = error;
    }
  }

  console.error(`Error updating order ${orderId} status:`, lastErr);
  throw lastErr;
};

// Get order statistics (admin)
export const getOrderStatistics = async (period = 'week') => {
  const tryPaths = [
    `/api/orders/statistics?period=${period}`,
    `/orders/statistics?period=${period}`,
    `/api/orders/admin/statistics?period=${period}`,
    `/orders/admin/statistics?period=${period}`
  ];

  let lastErr = null;
  for (const path of tryPaths) {
    try {
      const response = await api.get(path);
      return response.data;
    } catch (error) {
      lastErr = error;
    }
  }

  console.error('Error fetching order statistics:', lastErr);
  throw lastErr;
};

// Delete order (admin)
export const deleteOrder = async (orderId) => {
  const tryPaths = [
    `/api/orders/${orderId}`,
    `/orders/${orderId}`,
    `/api/orders/admin/${orderId}`,
    `/orders/admin/${orderId}`
  ];

  let lastErr = null;
  for (const path of tryPaths) {
    try {
      const response = await api.delete(path);
      return response.data;
    } catch (error) {
      lastErr = error;
    }
  }

  console.error(`Error deleting order ${orderId}:`, lastErr);
  throw lastErr;
};

// Export orders data (admin)
export const exportOrders = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    const tryPaths = [
      `/api/orders/export?${queryParams.toString()}`,
      `/orders/export?${queryParams.toString()}`,
      `/api/orders/admin/export?${queryParams.toString()}`,
      `/orders/admin/export?${queryParams.toString()}`
    ];

    let lastErr = null;
    for (const path of tryPaths) {
      try {
        const response = await api.get(path, { responseType: 'blob' });
        return response.data;
      } catch (error) {
        lastErr = error;
      }
    }
    
    throw lastErr || new Error('Unable to export orders from any known endpoint');
  } catch (error) {
    console.error('Error exporting orders:', error);
    throw error;
  }
};

// Default export for backward compatibility
export default {
  getUserOrders,
  getUserOrderById,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStatistics,
  deleteOrder,
  exportOrders,
  getTopSellingProducts,
};
