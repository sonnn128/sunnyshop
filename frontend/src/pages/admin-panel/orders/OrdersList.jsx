import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import { useToast } from 'components/ui/ToastProvider';
import Select from 'components/ui/Select';
import Input from 'components/ui/Input';
import { getAllOrders, exportOrders, updateOrderStatus } from 'lib/orderApi';

const getDateRangeBounds = (range) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  const setStartOfDay = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const setEndOfDay = (date) => {
    date.setHours(23, 59, 59, 999);
    return date;
  };

  switch (range) {
    case 'today':
      return {
        startDate: setStartOfDay(new Date(now)),
        endDate: setEndOfDay(new Date(now)),
      };
    case 'yesterday': {
      const startDate = setStartOfDay(new Date(now));
      startDate.setDate(startDate.getDate() - 1);
      const endDate = setEndOfDay(new Date(startDate));
      return { startDate, endDate };
    }
    case 'thisWeek': {
      const currentDay = now.getDay();
      const mondayOffset = (currentDay + 6) % 7; // Monday as start of week
      const startDate = setStartOfDay(new Date(now));
      startDate.setDate(startDate.getDate() - mondayOffset);
      return {
        startDate,
        endDate: setEndOfDay(new Date(now)),
      };
    }
    case 'thisMonth': {
      const startDate = setStartOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      const endDate = setEndOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
      return { startDate, endDate };
    }
    case 'last30days': {
      const startDate = setStartOfDay(new Date(now));
      startDate.setDate(startDate.getDate() - 30);
      return {
        startDate,
        endDate: setEndOfDay(new Date(now)),
      };
    }
    default:
      return { startDate: null, endDate: null };
  }
};

const OrdersList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    search: '',
    dateRange: 'all',
    page: 1
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 5
  });
  
  // Status options for filtering
  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang vận chuyển' },
    { value: 'delivered', label: 'Đã giao hàng' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];
  
  // Date range options for filtering
  const dateRangeOptions = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'yesterday', label: 'Hôm qua' },
    { value: 'thisWeek', label: 'Tuần này' },
    { value: 'thisMonth', label: 'Tháng này' },
    { value: 'last30days', label: '30 ngày qua' },
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

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Prepare filters for API call
      const apiFilters = {
        status: filter.status,
        search: filter.search,
        page: filter.page || 1,
        limit: pagination.perPage
      };
      
      // Add date range filters
      if (filter.dateRange !== 'all') {
        const { startDate, endDate } = getDateRangeBounds(filter.dateRange);
        if (startDate) apiFilters.startDate = startDate.toISOString();
        if (endDate) apiFilters.endDate = endDate.toISOString();
      }
      
  const response = await getAllOrders({ ...apiFilters, includeDetails: true, sort: '-created_at' });

      if (response && response.orders) {
        setOrders(response.orders);
        setPagination({
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalItems: response.pagination.totalItems,
          perPage: response.pagination.perPage
        });
      } else {
        setOrders([]);
        setPagination(prev => ({ ...prev, currentPage: 1, totalPages: 1, totalItems: 0 }));
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.push({ message: 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.', type: 'error' });
      setOrders([]);
      setPagination(prev => ({ ...prev, currentPage: 1, totalPages: 1, totalItems: 0 }));
    } finally {
      setLoading(false);
    }
  };

  // Removed mock generator

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilter(prev => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? value : 1 // Reset page when filters change
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: name === 'page' ? value : 1
    }));
  };
  
  // Navigate to order detail
  const handleViewOrder = (orderId) => {
    navigate(`/admin-panel/orders/${orderId}`);
  };
  
  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      // Try to update via API
      const response = await updateOrderStatus(orderId, newStatus);
      
      if (response && response.success) {
        toast.push({ message: `Đã cập nhật trạng thái đơn hàng #${orderId} thành ${statusLabels[newStatus]}`, type: 'success' });
        // Refresh order list
        fetchOrders();
      } else {
        // Fallback to local update if API fails
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            return { ...order, status: newStatus };
          }
          return order;
        });
        
        setOrders(updatedOrders);
        toast.push({ message: `Đã cập nhật trạng thái đơn hàng #${orderId} thành ${statusLabels[newStatus]}`, type: 'success' });
        setLoading(false);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.push({ message: 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.', type: 'error' });
      setLoading(false);
    }
  };
  
  // Format date
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
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle export orders
  const handleExport = async () => {
    try {
      const response = await exportOrders({
        status: filter.status,
        startDate: filter.dateRange !== 'all' ? new Date().toISOString() : undefined,
        endDate: filter.dateRange !== 'all' ? new Date().toISOString() : undefined
      });
      
      if (response) {
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        toast.push({ message: 'Xuất dữ liệu đơn hàng thành công!', type: 'success' });
      } else {
        throw new Error('Export failed');
      }
    } catch (err) {
      console.error('Error exporting orders:', err);
      toast.push({ message: 'Không thể xuất dữ liệu đơn hàng. Vui lòng thử lại sau.', type: 'error' });
    }
  };

  // Fetch orders on mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [filter.status, filter.dateRange, filter.page]);
  
  // Handle search with debounce
  useEffect(() => {
    const delay = filter.search ? 500 : 0;
    const timer = setTimeout(() => {
      fetchOrders();
    }, delay);
    return () => clearTimeout(timer);
  }, [filter.search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 lg:mb-0">Quản lý Đơn hàng</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={() => navigate('/admin-panel/orders/dashboard')}
          >
            Về Dashboard
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={handleExport}
          >
            Xuất dữ liệu
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-medium">Bộ lọc</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input 
              label="Tìm kiếm" 
              placeholder="Tìm theo ID, tên KH, email..." 
              value={filter.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              iconName="Search"
            />
          </div>
          <div>
            <Select 
              label="Trạng thái" 
              options={statusOptions} 
              value={filter.status} 
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>
          <div>
            <Select 
              label="Thời gian" 
              options={dateRangeOptions} 
              value={filter.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />
          </div>
        </div>
      </div>
      
      {/* Orders table */}
      <div className="bg-card border border-border rounded-lg shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Đơn hàng</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tổng tiền</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ngày đặt</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    <div className="flex justify-center items-center py-8">
                      <Icon name="Loader" className="animate-spin mr-2" />
                      <span>Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    <div className="py-8">
                      <div className="flex justify-center mb-2">
                        <Icon name="PackageX" size={24} className="text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">Không có đơn hàng nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const orderId = order.id || order._id;
                  const orderNumber = order.orderNumber || order.order_number || (orderId ? `#${String(orderId).slice(-6).toUpperCase()}` : 'Đơn hàng');
                  const itemsCount = Array.isArray(order.items) ? order.items.length : (order.itemsCount || order.items || 0);
                  const customerName = order.customer?.name
                    || order.user?.name
                    || order.shippingAddress?.fullName
                    || order.billingAddress?.fullName
                    || 'Khách hàng';
                  const customerEmail = order.customer?.email
                    || order.user?.email
                    || order.shippingAddress?.email
                    || order.billingAddress?.email
                    || order.guestEmail
                    || '';
                  const totalAmount = typeof order.total === 'number'
                    ? order.total
                    : (order.total_amount || order.totalAmount || 0);
                  const createdAt = order.createdAt || order.created_at || order.date;

                  return (
                    <tr key={orderId || orderNumber} className="border-b border-border hover:bg-muted/30 transition-smooth">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-foreground">{orderNumber}</div>
                        <div className="text-sm text-muted-foreground">{itemsCount} sản phẩm</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-foreground">{customerName}</div>
                        <div className="text-sm text-muted-foreground">{customerEmail}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground">
                        {formatCurrency(totalAmount)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || statusColors.pending}`}>
                        {statusLabels[order.status] || order.status || 'pending'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground">
                        {createdAt ? formatDate(createdAt) : ''}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          iconName="Eye" 
                          onClick={() => handleViewOrder(orderId)}
                        >
                          Chi tiết
                        </Button>
                        <Select
                          className="w-32"
                          placeholder="Cập nhật"
                          value={order.status}
                          options={statusOptions.filter(opt => opt.value !== '')}
                          onChange={(value) => handleUpdateStatus(orderId, value)}
                        />
                      </div>
                    </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị <span className="font-medium">{orders.length}</span> / <span className="font-medium">{pagination.totalItems}</span> đơn hàng
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
              >
                <Icon name="ChevronLeft" size={16} />
              </Button>
              <span className="text-sm">
                Trang <span className="font-medium">{pagination.currentPage}</span> / <span className="font-medium">{pagination.totalPages}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
              >
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;