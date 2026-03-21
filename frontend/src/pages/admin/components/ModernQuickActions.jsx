import React from 'react';
import Icon from '@/components/AppIcon';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const ModernQuickActions = ({ className }) => {
  const navigate = useNavigate();
  
  const actions = [
    { id: 1, title: 'Thêm mới', description: 'Tạo sản phẩm', icon: "Plus", color: "slate", onClick: () => navigate('/admin/products/new') },
    { id: 2, title: 'Bộ sưu tập', description: 'Quản lý danh mục', icon: "Folder", color: "slate", onClick: () => navigate('/admin?tab=categories') },
    { id: 3, title: 'Vận chuyển', description: 'Luồng đơn hàng', icon: "Package", color: "slate", onClick: () => navigate('/admin?tab=orders') },
    { id: 4, title: 'Danh bạ', description: 'Cơ sở thành viên', icon: "Users", color: "slate", onClick: () => navigate('/admin?tab=users') }
  ];

  return (
    <div className={cn("bg-white p-8 border border-slate-200", className)}>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 mb-8 pb-4 border-b border-slate-50">Trung tâm điều hành</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            onClick={action.onClick}
            className="group relative flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-300 transition-all duration-300"
          >
            <div className="w-10 h-10 flex items-center justify-center mb-4 text-slate-900 bg-white border border-slate-100 group-hover:border-slate-900 transition-colors">
              <Icon name={action.icon} size={20} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest text-center">{action.title}</p>
            <p className="text-[8px] font-medium text-slate-400 mt-1 uppercase tracking-tighter group-hover:text-slate-600 transition-colors">{action.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ModernQuickActions;
