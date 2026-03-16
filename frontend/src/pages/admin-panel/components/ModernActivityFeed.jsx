import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import API from '../../../lib/api';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ModernActivityFeed = ({ className }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/dashboard/activities?limit=10');
      if (response.data.success) {
        setActivities(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      // Fallback data for luxury demo
      setActivities([
        { id: 1, type: 'order', title: 'New Acquisition #8429', description: 'Priority order processed from Tokyo Hub', time: 'JUST NOW', icon: 'ShoppingBag', color: 'text-primary' },
        { id: 2, type: 'user', title: 'Elite Member Joined', description: 'Victoria B. assigned to Platinum tier', time: '5M AGO', icon: 'UserPlus', color: 'text-emerald-500' },
        { id: 3, type: 'inventory', title: 'Low Asset Warning', description: 'Sneaker AF1 limited stock remaining (2 left)', time: '1H AGO', icon: 'AlertTriangle', color: 'text-rose-500' },
        { id: 4, type: 'review', title: 'Sentiment Upgrade', description: 'Positive feedback loop detected in Polo Sunny line', time: '3H AGO', icon: 'Star', color: 'text-amber-500' },
        { id: 5, type: 'payment', title: 'Revenue Stream Confirmed', description: 'Inbound $1,200 via VNPAY Protocol', time: '4H AGO', icon: 'CreditCard', color: 'text-indigo-500' }
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
                <div className="w-12 h-12 rounded-2xl bg-muted/40" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-muted/40 rounded-full w-1/3" />
                  <div className="h-3 bg-muted/40 rounded-full w-2/3" />
                </div>
              </div>
            ))
          ) : (
            activities.map((activity, index) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-start space-x-5 relative"
              >
                {/* Timeline Glow Line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-[23px] top-12 bottom-[-32px] w-[2px] bg-gradient-to-b from-primary/30 via-primary/5 to-transparent" />
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-[1.25rem] flex items-center justify-center flex-shrink-0 shadow-2xl transition-all group-hover:scale-110 duration-500 relative z-10 border border-white/20 glass-card",
                  activity.color
                )}>
                  <Icon name={activity.icon} size={20} strokeWidth={2.5} />
                </div>
                
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors tracking-tight">
                      {activity.title}
                    </p>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] ml-4 bg-muted/30 px-2 py-0.5 rounded-lg border border-border/20 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-10 w-full py-4 rounded-2xl bg-primary/10 hover:bg-primary/20 text-[10px] font-black text-primary transition-all duration-300 border border-primary/20 uppercase tracking-[0.2em] shadow-xl shadow-primary/5"
      >
        Access Audit Logs
      </motion.button>
    </div>
  );
};

export default ModernActivityFeed;
