import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import API from '../../../lib/api';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/dashboard/activities?limit=5');
      if (response.data.success) {
        setActivities(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Không thể tải hoạt động gần đây');
      // Fallback to some sample data if API fails
      setActivities([
        {
          id: 'fallback-1',
          type: 'order',
          title: 'Đơn hàng mới',
          description: 'Đang tải dữ liệu...',
          time: 'Vừa xong',
          icon: 'ShoppingBag',
          color: 'text-success'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elegant">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Hoạt động gần đây</h3>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <Icon name="AlertTriangle" size={32} className="mx-auto text-warning mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={fetchActivities}
              className="mt-2 text-sm text-accent hover:text-accent/80 font-medium"
            >
              Thử lại
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity?.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${activity?.color}`}>
                  <Icon name={activity?.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{activity?.title}</p>
                    <span className="text-xs text-muted-foreground">{activity?.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity?.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && !error && activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <button className="w-full text-sm text-accent hover:text-accent/80 font-medium transition-smooth">
              Xem tất cả hoạt động
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;