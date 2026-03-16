import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';

const ModernHeader = ({ collapsed, user, roleLabels }) => {
  const navigate = useNavigate();

  return (
    <motion.header 
      initial={false}
      animate={{ 
        left: collapsed ? 80 : 280,
      }}
      className={cn(
        "fixed top-0 right-0 h-24 z-40 flex items-center justify-between px-10 pointer-events-none",
      )}
    >
      <div className="w-full h-16 glass-card rounded-3xl flex items-center justify-between px-8 shadow-2xl pointer-events-auto border-border/30">
        {/* Left: Search Bar */}
        <div className="flex-1 max-w-xl group">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Icon name="Search" size={16} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search everything..." 
              className="w-full bg-muted/40 border-none rounded-2xl py-2 pl-12 pr-4 text-xs font-bold tracking-tight focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="text-[10px] font-black text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-lg border border-border/30">⌘K</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4 ml-6">
          <div className="flex items-center space-x-2 pr-4 border-r border-border/30">
            <HeaderAction icon="Bell" badge />
            <HeaderAction icon="Mail" />
            <HeaderAction icon="LayoutGrid" />
          </div>

          <div 
            className="flex items-center space-x-4 pl-4 cursor-pointer group"
            onClick={() => navigate('/settings')}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-foreground leading-none group-hover:text-primary transition-colors">
                {user?.name?.split(' ')[0] || "Admin"}
              </p>
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.1em] mt-1 opacity-70">
                {roleLabels[user?.role] || user?.role}
              </p>
            </div>
            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 rounded-2xl overflow-hidden shadow-xl ring-2 ring-background border-2 border-primary/20"
              >
                <img 
                  src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success border-2 border-background rounded-full shadow-glow" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const HeaderAction = ({ icon, badge }) => (
  <motion.button 
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    className="relative p-2.5 rounded-2xl hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary group"
  >
    <Icon name={icon} size={18} strokeWidth={2.5} />
    {badge && (
      <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-glow" />
    )}
  </motion.button>
);

export default ModernHeader;
