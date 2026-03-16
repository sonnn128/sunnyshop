import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../lib/utils';

const ModernSidebar = ({ tabs, activeTab, onTabChange, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out border-r border-border/50 bg-card/80 backdrop-blur-xl shadow-xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Icon name="Sparkles" size={24} color="white" />
              </div>
              <span className="font-accent font-bold text-xl tracking-tight text-foreground">Sunny Admin</span>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mx-auto cursor-pointer" onClick={() => navigate('/')}>
              <Icon name="Sparkles" size={20} color="white" />
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center",
                  collapsed ? "w-full" : "mr-4"
                )}>
                  <Icon 
                    name={tab.icon} 
                    size={22} 
                    className={cn(
                      "transition-transform group-hover:scale-110",
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    )} 
                  />
                </div>
                {!collapsed && (
                  <span className="font-medium text-sm tracking-wide">{tab.label}</span>
                )}
                
                {/* Active Indicator Hook */}
                {isActive && !collapsed && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-foreground/50 shadow-glow" />
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {tab.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border/50">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center p-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all group"
          >
            <div className={cn(
              "flex items-center justify-center",
              collapsed ? "w-full" : "mr-4"
            )}>
              <Icon 
                name={collapsed ? "ChevronRight" : "ChevronLeft"} 
                size={20} 
                className="group-hover:scale-110 transition-transform" 
              />
            </div>
            {!collapsed && <span className="text-sm font-medium">Thu gọn menu</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ModernSidebar;
