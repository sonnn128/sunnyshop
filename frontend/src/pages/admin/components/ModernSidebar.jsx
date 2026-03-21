import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/AppIcon';
import { cn } from '@/lib/utils';

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
        "fixed left-0 top-0 h-screen z-50 border-r border-slate-200 bg-white shadow-sm overflow-hidden",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="pt-10 pb-12 px-8 flex items-center mb-4 border-b border-slate-50 cursor-pointer" onClick={() => navigate('/')}>
          <AnimatePresence>
            {collapsed ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-serif text-xl font-bold text-slate-900 uppercase"
              >S</motion.span>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-lg font-serif tracking-widest text-slate-900 uppercase">Sunny<span className="font-light">Fashion</span></h1>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Quản lý</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center p-3.5 rounded-none transition-all duration-300 group relative",
                  isActive 
                    ? "text-slate-900 bg-slate-100 font-extrabold" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 hover:font-bold"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center transition-all duration-300",
                  collapsed ? "w-full" : "mr-4"
                )}>
                  <Icon 
                    name={tab.icon} 
                    size={20} 
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                    )} 
                  />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-bold text-[11px] uppercase tracking-widest whitespace-nowrap"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Active Indicator Line */}
                {isActive && !collapsed && (
                  <motion.div 
                    layoutId="sidebar-active-line"
                    className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-slate-900"
                  />
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl translate-x-3 group-hover:translate-x-0">
                    {tab.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Collapse Toggle */}
        <div className="p-4 border-t border-slate-50">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all group"
          >
            <Icon name={collapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
            {!collapsed && <span className="ml-3 text-[10px] font-bold uppercase tracking-widest">Thu gọn</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default ModernSidebar;
