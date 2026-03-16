import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import API from '../../../lib/api';
import { cn } from '../../../lib/utils';

const ModernActivityFeed = ({ className }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/dashboard/activities?limit=8');
      if (response.data.success) {
        setActivities(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      // Fallback data for demo
      setActivities([
        { id: 1, type: 'order', title: 'Đơn hàng mới #8429', description: 'Nguyễn Văn A vừa đặt mua 2 sản phẩm', time: 'Vừa xong', icon: 'ShoppingBag', color: 'text-primary bg-primary/10' },
        { id: 2, type: 'user', title: 'Khách hàng mới', description: 'Lê Thị B vừa đăng ký tài khoản', time: '5 phút trước', icon: 'UserPlus', color: 'text-emerald-500 bg-emerald-500/10' },
        { id: 3, type: 'inventory', title: 'Kho hàng sắp hết', description: 'Giày Sneaker AF1 còn dưới 5 sản phẩm', time: '1 giờ trước', icon: 'AlertTriangle', color: 'text-amber-500 bg-amber-500/10' },
        { id: 4, type: 'review', title: 'Đánh giá mới', description: '5 sao cho Áo Polo Sunny từ Trần C', time: '3 giờ trước', icon: 'Star', color: 'text-yellow-500 bg-yellow-500/10' },
        { id: 5, type: 'payment', title: 'Thanh toán thành công', description: 'Đã nhận 1,200,000 VND từ ví VNPAY', time: 'Sau 4 giờ', icon: 'CreditCard', color: 'text-indigo-500 bg-indigo-500/10' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-elegant flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-foreground">Hoạt động mới</h3>
        <button onClick={fetchActivities} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <Icon name="RefreshCw" size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4 animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))
        ) : (
          activities.map((activity, index) => (
            <div key={activity.id} className="group flex items-start space-x-4 relative">
              {/* Timeline Line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-gradient-to-b from-border/50 to-transparent" />
              )}
              
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-300 relative z-10",
                activity.color
              )}>
                <Icon name={activity.icon} size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {activity.title}
                  </p>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight bg-muted/50 px-2 py-0.5 rounded-md">
                    {activity.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="mt-8 w-full py-3 rounded-2xl bg-muted/30 hover:bg-muted text-xs font-bold text-foreground transition-all duration-300 border border-transparent hover:border-border/50 uppercase tracking-widest">
        Xem tất cả thông báo
      </button>
    </div>
  );
};

export default ModernActivityFeed;
