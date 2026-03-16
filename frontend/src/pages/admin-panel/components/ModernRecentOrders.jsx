import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';
import { getAllOrders } from '../../../lib/orderApi';
import { cn } from '../../../lib/utils';

const ModernRecentOrders = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders({ includeDetails: true, limit: 5, sort: '-created_at' });
        const ordersData = response?.orders || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        console.error('Error fetching recent orders:', err);
        toast.push({ message: 'Không thể tải dữ liệu đơn hàng', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchRecentOrders();
  }, [toast]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      processing: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      shipping: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      cancelled: "bg-rose-500/10 text-rose-600 border-rose-500/20"
    };
    return styles[status] || styles.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Chờ xác nhận", confirmed: "Đã xác nhận", processing: "Đang xử lý",
      shipping: "Đang giao", delivered: "Đã giao", completed: "Hoàn thành", cancelled: "Đã hủy"
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] shadow-elegant overflow-hidden transition-all duration-500 hover:shadow-2xl">
      <div className="p-8 flex items-center justify-between border-b border-border/50">
        <div>
          <h3 className="text-xl font-bold text-foreground">Đơn hàng mới nhất</h3>
          <p className="text-sm text-muted-foreground mt-1">Theo dõi các giao dịch gần đây của cửa hàng</p>
        </div>
        <button 
          onClick={() => navigate('/admin-panel?tab=orders')}
          className="px-5 py-2.5 rounded-2xl bg-muted/50 hover:bg-primary hover:text-primary-foreground text-sm font-semibold transition-all duration-300 flex items-center space-x-2 border border-border/50"
        >
          <span>Toàn bộ đơn hàng</span>
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>

      <div className="overflow-x-auto px-4 pb-4">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Tổng tiền</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Ngày đặt</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="7" className="px-6 py-6 border-b border-border/20 last:border-0 h-16 bg-muted/20 rounded-2xl mb-3" />
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <Icon name="Inbox" size={48} className="mb-4" />
                    <p className="text-lg font-medium">Chưa có đơn hàng nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const orderId = order?.id || order?._id;
                const orderNumber = order?.orderNumber || `#${String(orderId).slice(-6).toUpperCase()}`;
                const customerName = order?.shippingAddress?.fullName || order?.billingAddress?.fullName || 'Khách hàng';
                const itemsCount = Array.isArray(order?.items) ? order.items.length : 0;

                return (
                  <tr key={orderId} className="group hover:bg-muted/40 transition-all duration-300 rounded-2xl cursor-default border-y border-transparent">
                    <td className="px-6 py-5 first:rounded-l-2xl">
                      <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{orderNumber}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-xs text-primary shadow-sm">
                          {customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm leading-none">{customerName}</p>
                          <p className="text-[11px] text-muted-foreground mt-1 truncate max-w-[150px]">{order?.guestEmail || 'customer@example.com'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium px-2 py-1 bg-muted/50 rounded-lg">{itemsCount} món</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-sm tabular-nums text-foreground">{formatCurrency(order?.total)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className={cn(
                        "inline-flex items-center px-3 py-1.5 rounded-xl border text-[11px] font-bold shadow-sm",
                        getStatusStyle(order?.status)
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full mr-2 animate-pulse", getStatusStyle(order?.status).split(' ')[1])} />
                        {getStatusLabel(order?.status)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-muted-foreground font-medium">{formatDate(order?.createdAt)}</span>
                    </td>
                    <td className="px-6 py-5 last:rounded-r-2xl text-center">
                      <button 
                        onClick={() => navigate(`/admin-panel/orders/${orderId}`)}
                        className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        title="Xem chi tiết"
                      >
                        <Icon name="Eye" size={18} />
                      </button>
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

export default ModernRecentOrders;
