import React from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';

const ModernQuickActions = ({ className }) => {
  const navigate = useNavigate();
  
  const actions = [
    {
      id: 1,
      title: "Thêm sản phẩm",
      description: "Tạo mặt hàng mới",
      icon: "Plus",
      color: "from-blue-500 to-indigo-600",
      onClick: () => navigate('/admin-panel/products/new')
    },
    {
      id: 2,
      title: "Danh mục",
      description: "Quản lý phân loại",
      icon: "Folder",
      color: "from-emerald-500 to-teal-600",
      onClick: () => navigate('/admin-panel?tab=categories')
    },
    {
      id: 3,
      title: "Đơn hàng",
      description: "Xử lý giao dịch",
      icon: "Package",
      color: "from-amber-500 to-orange-600",
      onClick: () => navigate('/admin-panel?tab=orders')
    },
    {
      id: 4,
      title: "Khách hàng",
      description: "Quản lý người dùng",
      icon: "Users",
      color: "from-violet-500 to-purple-600",
      onClick: () => navigate('/admin-panel?tab=users')
    }
  ];

  return (
    <div className={cn("bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-elegant", className)}>
      <h3 className="text-xl font-bold text-foreground mb-6">Thao tác nhanh</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-muted/30 hover:bg-muted transition-all duration-300 border border-transparent hover:border-border/50 overflow-hidden"
          >
            {/* Background Hover Effect */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br",
              action.color
            )} />
            
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br text-white",
              action.color
            )}>
              <Icon name={action.icon} size={24} />
            </div>
            <p className="text-sm font-bold text-foreground truncate w-full text-center">{action.title}</p>
            <p className="text-[10px] text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModernQuickActions;
