import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';

const ModernStatsCard = ({ title, value, change, changeType, icon, color = "primary" }) => {
  const getVariants = () => {
    const variants = {
      primary: { bg: "from-blue-500/10 to-indigo-500/10", accent: "text-blue-600 dark:text-blue-400", glow: "bg-blue-500", iconBg: "bg-blue-500/20" },
      success: { bg: "from-emerald-500/10 to-teal-500/10", accent: "text-emerald-600 dark:text-emerald-400", glow: "bg-emerald-500", iconBg: "bg-emerald-500/20" },
      warning: { bg: "from-amber-500/10 to-orange-500/10", accent: "text-amber-600 dark:text-amber-400", glow: "bg-amber-500", iconBg: "bg-amber-500/20" },
      error: { bg: "from-rose-500/10 to-pink-500/10", accent: "text-rose-600 dark:text-rose-400", glow: "bg-rose-500", iconBg: "bg-rose-500/20" },
      accent: { bg: "from-violet-500/10 to-purple-500/10", accent: "text-violet-600 dark:text-violet-400", glow: "bg-violet-500", iconBg: "bg-violet-500/20" }
    };
    return variants[color] || variants.primary;
  };

  const v = getVariants();

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group overflow-hidden glass-card rounded-[2.5rem] p-8 shadow-2xl border-white/40"
    >
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className={cn("absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl", v.glow)} 
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-inner border border-white/30", v.bg)}>
            <Icon name={icon} size={28} className={v.accent} strokeWidth={2.5} />
          </div>
          
          {change && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex items-center px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border backdrop-blur-md",
                changeType === 'increase' 
                  ? "bg-success/10 text-success border-success/30" 
                  : changeType === 'decrease' 
                    ? "bg-error/10 text-error border-error/30" 
                    : "bg-muted text-muted-foreground border-border/30"
              )}
            >
              <Icon 
                name={changeType === 'increase' ? 'ArrowUpRight' : changeType === 'decrease' ? 'ArrowDownRight' : 'Minus'} 
                size={12} 
                className="mr-1.5"
                strokeWidth={3}
              />
              {change}
            </motion.div>
          )}
        </div>

        <div>
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{title}</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground tracking-tight tabular-nums">{value}</span>
          </div>
        </div>

        {/* Action Reveal */}
        <div className="mt-8 pt-6 border-t border-border/20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">View Analytics</span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Icon name="ArrowRight" size={14} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Holographic Line */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-700" />
    </motion.div>
  );
};

export default ModernStatsCard;
