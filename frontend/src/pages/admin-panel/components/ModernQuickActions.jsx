import React from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';

const ModernQuickActions = ({ className }) => {
  const navigate = useNavigate();
  
  const actions = [
    { id: 1, title: "Asset Creator", description: "Initialize new entity", icon: "Plus", color: "blue", onClick: () => navigate('/admin-panel/products/new') },
    { id: 2, title: "Schema Sync", description: "Manage categories", icon: "Folder", color: "emerald", onClick: () => navigate('/admin-panel?tab=categories') },
    { id: 3, title: "Stream Logic", description: "Process transactions", icon: "Package", color: "amber", onClick: () => navigate('/admin-panel?tab=orders') },
    { id: 4, title: "Entity Hub", description: "Global user management", icon: "Users", color: "violet", onClick: () => navigate('/admin-panel?tab=users') }
  ];

  return (
    <div className={cn("glass-card rounded-[2.5rem] p-8 border-border/20 shadow-2xl", className)}>
      <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-8">Quick Protocols</h3>
      <div className="grid grid-cols-2 gap-6">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="group relative flex flex-col items-center justify-center p-8 rounded-[2rem] glass-card border-white/30 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-2xl group-hover:rotate-12 transition-all duration-500 border border-white/20",
              action.color === 'blue' ? "bg-blue-500 text-white shadow-blue-500/20" :
              action.color === 'emerald' ? "bg-emerald-500 text-white shadow-emerald-500/20" :
              action.color === 'amber' ? "bg-amber-500 text-white shadow-amber-500/20" :
              "bg-violet-500 text-white shadow-violet-500/20"
            )}>
              <Icon name={action.icon} size={28} strokeWidth={2.5} />
            </div>
            <p className="text-[11px] font-black text-foreground uppercase tracking-widest text-center">{action.title}</p>
            <p className="text-[9px] font-bold text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-tighter">{action.description}</p>

            {/* Micro-sparkle effects on hover */}
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon name="Zap" size={10} className="text-primary animate-pulse" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ModernQuickActions;
