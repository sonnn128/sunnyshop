import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../lib/utils';

const ModernSidebar = ({ tabs, activeTab, onTabChange, collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: collapsed ? 80 : 280,
        x: 0 
      }}
      className={cn(
        "fixed left-0 top-0 h-screen z-50 border-r border-border/50 glass-card shadow-2xl overflow-hidden",
      )}
    >
      <div className="flex flex-col h-full bg-background/30">
        {/* Logo Section */}
        <div className="pt-10 pb-12 px-6 flex items-center mb-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-primary/20 cursor-pointer flex-shrink-0"
            onClick={() => navigate('/')}
          >
            <Icon name="Sparkles" size={26} color="white" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="ml-4 overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-xl font-black tracking-tight text-foreground">SUNNY</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Admin Pro</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-3 overflow-y-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center p-3.5 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/25" 
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                )}
              >
                {/* Active Glow Effect */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}

                <div className={cn(
                  "flex items-center justify-center transition-all duration-300",
                  collapsed ? "w-full" : "mr-4"
                )}>
                  <Icon 
                    name={tab.icon} 
                    size={22} 
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "text-primary-foreground scale-110" : "text-muted-foreground group-hover:scale-110"
                    )} 
                  />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-bold text-sm tracking-tight"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-6 px-4 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-2xl translate-x-3 group-hover:translate-x-0">
                    {tab.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-border/30">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center p-3.5 rounded-2xl bg-muted/30 text-muted-foreground hover:text-foreground transition-all group"
          >
            <div className={cn(
              "flex items-center justify-center transition-all duration-300",
              collapsed ? "w-full" : "mr-4"
            )}>
              <Icon 
                name={collapsed ? "LayoutGrid" : "ChevronLeft"} 
                size={18} 
              />
            </div>
            {!collapsed && <span className="text-xs font-black uppercase tracking-widest">Collapse</span>}
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default ModernSidebar;
