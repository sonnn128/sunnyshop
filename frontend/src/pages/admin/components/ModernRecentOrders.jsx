import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import { useToast } from '@/components/ui/ToastProvider';
import { getAllOrders } from '@/lib/orderApi';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ModernRecentOrders = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  };

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders({ includeDetails: true, limit: 10, sort: '-created_at' });
        const ordersData = response?.orders || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        console.error('Error fetching recent orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentOrders();
  }, [toast]);

  const getStatusStyle = (status) => {
    const styles = {
      pending: "text-amber-600 bg-amber-50",
      confirmed: "text-blue-600 bg-blue-50",
      processing: "text-indigo-600 bg-indigo-50",
      shipping: "text-purple-600 bg-purple-50",
      delivered: "text-emerald-600 bg-emerald-50",
      completed: "text-emerald-600 bg-emerald-50",
      cancelled: "text-rose-600 bg-rose-50"
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden">
      <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50">
        <div>
          <h3 className="text-xl font-serif text-slate-900 tracking-tight">Đơn hàng gần đây</h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">Nhật ký hoạt động giao dịch mới nhất</p>
        </div>
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin?tab=orders')}
          className="h-10 px-6 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2"
        >
          <span>Xem tất cả giao dịch</span>
          <Icon name="ArrowRight" size={12} strokeWidth={2} />
        </motion.button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 uppercase text-[9px] font-bold tracking-[0.2em] border-b border-slate-50 bg-slate-50/30">
              <th className="px-8 py-4">Mã đơn</th>
              <th className="px-8 py-4">Khách hàng</th>
              <th className="px-8 py-4">Số tiền</th>
              <th className="px-8 py-4">Trạng thái</th>
              <th className="px-8 py-4">Ngày</th>
              <th className="px-8 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-slate-50">
                    <td colSpan="6" className="px-8 py-6 h-16 bg-slate-50/50" />
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                      <Icon name="Inbox" size={48} strokeWidth={1} className="mb-4 text-slate-400" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Không có hoạt động gần đây</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const orderId = order?.id || order?._id;
                  const orderNumber = order?.orderNumber || `#${String(orderId).slice(-6).toUpperCase()}`;
                  const customerName = order?.shippingAddress?.fullName || order?.billingAddress?.fullName || 'Anonymous';
                  
                  return (
                    <motion.tr 
                      key={orderId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{orderNumber}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200 uppercase">
                            {customerName.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-900 leading-none">{customerName}</span>
                            <span className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">{order?.guestEmail || order?.user?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[11px] font-bold text-slate-900">{formatCurrency(order?.total)}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider",
                          getStatusStyle(order?.status)
                        )}>
                          {order?.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{formatDate(order?.createdAt)}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => navigate(`/admin/orders/${orderId}`)}
                          className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 ml-auto"
                        >
                          <span>Xem chi tiết</span>
                          <Icon name="ArrowRight" size={10} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModernRecentOrders;
