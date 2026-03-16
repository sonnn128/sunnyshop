import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { useToast } from '../../../components/ui/ToastProvider';
import { getAllOrders } from '../../../lib/orderApi';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ModernRecentOrders = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      confirmed: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      processing: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      shipping: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      delivered: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      completed: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      cancelled: "text-rose-500 bg-rose-500/10 border-rose-500/20"
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="glass-card rounded-[3rem] shadow-2xl overflow-hidden border-white/30">
      <div className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/20">
        <div>
          <h3 className="text-2xl font-black text-foreground tracking-tight">Recent Acquisitions</h3>
          <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-[0.2em] opacity-60">Live feed of global transaction protocols</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/admin-panel?tab=orders')}
          className="h-12 px-8 rounded-2xl bg-primary/10 hover:bg-primary text-primary hover:text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 border border-primary/20"
        >
          <span>Omni-View Database</span>
          <Icon name="ArrowRight" size={14} strokeWidth={3} />
        </motion.button>
      </div>

      <div className="overflow-x-auto p-6">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-muted-foreground uppercase text-[9px] font-black tracking-[0.25em] opacity-50 px-6">
              <th className="px-8 pb-4">Protocol ID</th>
              <th className="px-8 pb-4">Agent Entity</th>
              <th className="px-8 pb-4">Vector Sum</th>
              <th className="px-8 pb-4">Status</th>
              <th className="px-8 pb-4">Timestamp</th>
              <th className="px-8 pb-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="px-6">
            <AnimatePresence>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-8 h-20 bg-muted/20 rounded-[1.5rem]" />
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                      <Icon name="Inbox" size={64} strokeWidth={1} className="mb-6" />
                      <p className="text-sm font-black uppercase tracking-[0.3em]">No Active Protocols</p>
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.4)' }}
                      className="group transition-all duration-300 rounded-[2rem] cursor-pointer"
                    >
                      <td className="px-8 py-6 first:rounded-l-[2rem] bg-white/40 border-y border-l border-white/20">
                        <span className="font-black text-xs text-foreground group-hover:text-primary transition-colors tracking-tighter">{orderNumber}</span>
                      </td>
                      <td className="px-8 py-6 bg-white/40 border-y border-white/20">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-black text-xs text-primary border border-white/50">
                            {customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-sm text-foreground tracking-tight">{customerName}</p>
                            <p className="text-[10px] font-bold text-muted-foreground mt-0.5 opacity-60 tracking-tight truncate max-w-[140px] lowercase">{order?.guestEmail || 'entity@network.sys'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 bg-white/40 border-y border-white/20">
                        <span className="font-black text-sm tabular-nums text-foreground tracking-tight">{formatCurrency(order?.total)}</span>
                      </td>
                      <td className="px-8 py-6 bg-white/40 border-y border-white/20">
                        <div className={cn(
                          "inline-flex items-center px-4 py-1.5 rounded-[1.25rem] border text-[9px] font-black uppercase tracking-widest shadow-xl shadow-black/5",
                          getStatusStyle(order?.status)
                        )}>
                          <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current animate-pulse shadow-glow" />
                          {order?.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 bg-white/40 border-y border-white/20">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{formatDate(order?.createdAt)}</span>
                      </td>
                      <td className="px-8 py-6 last:rounded-r-[2rem] bg-white/40 border-y border-r border-white/20 text-center">
                        <motion.button 
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/admin-panel/orders/${orderId}`)}
                          className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center shadow-xl group-hover:shadow-primary/20 transition-all border border-white/10"
                        >
                          <Icon name="Terminal" size={16} strokeWidth={3} />
                        </motion.button>
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
