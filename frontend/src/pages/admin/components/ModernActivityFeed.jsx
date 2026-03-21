import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import API from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/i18n';

const ModernActivityFeed = ({ className }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, formatDate } = useI18n();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await API.get('/dashboard/activities?limit=10');
      if (response.data.success) {
        setActivities(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      // Fallback data for luxury demo
      setActivities([
        { id: 1, type: 'order', title: 'New Order #8429', description: 'Transaction processed', time: 'JUST NOW', icon: 'ShoppingBag', color: 'text-slate-900' },
        { id: 2, type: 'user', title: 'Member Registered', description: 'A new member joined', time: '5M AGO', icon: 'UserPlus', color: 'text-slate-900' },
        { id: 3, type: 'inventory', title: 'Inventory Alert', description: 'Limited stock remaining', time: '1H AGO', icon: 'AlertTriangle', color: 'text-rose-600' },
        { id: 4, type: 'review', title: 'New Feedback', description: 'Positive sentiment detected', time: '3H AGO', icon: 'Star', color: 'text-amber-600' },
        { id: 5, type: 'payment', title: 'Revenue Logged', description: 'Inbound payment received', time: '4H AGO', icon: 'CreditCard', color: 'text-slate-900' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar pr-2 py-2">
        <AnimatePresence mode='popLayout'>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-5 animate-pulse">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 bg-slate-50 rounded-none w-1/3" />
                  <div className="h-2 bg-slate-50 rounded-none w-2/3" />
                </div>
              </div>
            ))
          ) : (
            activities.map((activity, index) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-start space-x-5 relative"
              >
                <div className={cn(
                  "w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all relative z-10 bg-slate-50 border border-slate-100",
                  activity.color
                )}>
                  <Icon name={activity.icon} size={16} strokeWidth={1.5} />
                </div>
                
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="text-[11px] font-bold text-slate-900 truncate tracking-tight uppercase">
                      {activity.title}
                    </p>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-4">
                      {activity.time.includes('AGO') || activity.time === 'JUST NOW' ? activity.time : formatDate(activity.time, 'relative')}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter">
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <motion.button 
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="mt-10 w-full py-3 bg-white hover:bg-slate-50 text-[9px] font-bold text-slate-900 transition-all duration-300 border border-slate-200 uppercase tracking-[0.2em]"
      >
        {t.dashboard.activityFeed.accessLogs}
      </motion.button>
    </div>
  );
};

export default ModernActivityFeed;
