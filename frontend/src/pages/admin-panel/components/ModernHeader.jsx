import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';

const ModernHeader = ({ collapsed, user, roleLabels }) => {
  const navigate = useNavigate();

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 h-20 z-40 transition-all duration-300 ease-in-out border-b border-border/50 bg-background/60 backdrop-blur-xl flex items-center justify-between px-8",
        collapsed ? "left-20" : "left-64"
      )}
    >
      {/* Search Bar - Hidden on small screens */}
      <div className="hidden md:flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Icon name="Search" size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh sản phẩm, đơn hàng..." 
            className="w-full bg-muted/50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-muted transition-all group">
          <Icon name="Bell" size={20} className="text-foreground group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-background" />
        </button>

        {/* Home Button */}
        <button 
          onClick={() => navigate('/')}
          className="p-2.5 rounded-xl hover:bg-muted transition-all group lg:flex items-center space-x-2 hidden"
        >
          <Icon name="Home" size={20} className="text-foreground group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Trang chủ</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-4 pl-6 border-l border-border/50">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground leading-none">{user?.name || "Admin User"}</p>
            <p className="text-[10px] font-medium text-primary uppercase tracking-wider mt-1.5 px-2 py-0.5 bg-primary/10 rounded-full inline-block">
              {roleLabels[user?.role] || user?.role}
            </p>
          </div>
          <div className="relative cursor-pointer group">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-black/5 ring-1 ring-border border-2 border-background group-hover:ring-primary/50 transition-all">
              <img 
                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                alt="Avatar" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success border-2 border-background rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
