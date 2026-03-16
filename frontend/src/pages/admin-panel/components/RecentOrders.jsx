import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';
import { getAllOrders } from '../../../lib/orderApi';

const RecentOrders = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent orders
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
  const response = await getAllOrders({ includeDetails: true, limit: 5, sort: '-created_at' });
        const ordersData = response?.orders || [];
        if (Array.isArray(ordersData)) {
          const sortedOrders = [...ordersData].sort((a, b) => {
            const aDate = new Date(a?.createdAt || a?.created_at || 0);
            const bDate = new Date(b?.createdAt || b?.created_at || 0);
            return bDate - aDate;
          });
          setOrders(sortedOrders.slice(0, 5));
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching recent orders:', err);
        toast.push({ message: 'Không thể tải dữ liệu đơn hàng', type: 'error' });
        setError('Không thể tải dữ liệu đơn hàng');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentOrders();
  }, [toast]);

  // Removed mock generator

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

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: "clock" },
      confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800", icon: "check-circle" },
      processing: { label: "Đang xử lý", color: "bg-primary/10 text-primary", icon: "package" },
      shipping: { label: "Đang giao hàng", color: "bg-purple-100 text-purple-800", icon: "truck" },
      delivered: { label: "Đã giao hàng", color: "bg-green-100 text-green-800", icon: "package-check" },
      completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800", icon: "check-circle" },
      cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: "x-circle" }
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elegant">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Đơn hàng gần đây</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin-panel?tab=orders')}
            className="flex items-center gap-2"
          >
            <span>Xem tất cả</span>
            <Icon name="external-link" className="w-4 h-4" />
          </Button>
        </div>
      </div>
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
                <td colSpan="6" className="p-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-muted-foreground">
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusConfig = getStatusConfig(order?.status);
                const orderNumber = order?.orderNumber || (order?.id ? `#${String(order.id).slice(-6).toUpperCase()}` : 'N/A');
                const customerName = order?.shippingAddress?.fullName || order?.billingAddress?.fullName || 'Khách hàng';
                const customerEmail = order?.shippingAddress?.email || order?.billingAddress?.email || order?.guestEmail || '';
                const itemsCount = Array.isArray(order?.items) ? order.items.length : 0;
                const orderId = order?.id || order?._id;
                
                return (
                  <tr key={orderId} className="border-b border-border hover:bg-muted/30 transition-smooth">
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
                        {formatCurrency(order?.total)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig?.color}`}>
                        <Icon name={statusConfig?.icon} size={12} className="mr-1" />
                        {statusConfig?.label}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(order?.createdAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => navigate(`/admin-panel/orders/${orderId}`)}
                        >
                          <Icon name="eye" className="w-3 h-3" />
                          Xem
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex items-center gap-1" 
                          onClick={() => navigate(`/admin-panel/orders/${orderId}?action=edit`)}
                        >
                          <Icon name="edit" className="w-3 h-3" />
                          Sửa
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;