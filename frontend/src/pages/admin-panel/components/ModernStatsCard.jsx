import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../lib/utils';

const ModernStatsCard = ({ title, value, change, changeType, icon, color = "primary" }) => {
  const getColors = () => {
    const variants = {
      primary: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 bg-blue-500",
      success: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 bg-emerald-500",
      warning: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 bg-amber-500",
      error: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 bg-rose-500",
      accent: "from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400 bg-violet-500"
    };
    return variants[color] || variants.primary;
  };

  const colors = getColors();

  return (
    <div className="relative group overflow-hidden bg-card/60 backdrop-blur-md border border-border/50 rounded-3xl p-6 shadow-elegant hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      {/* Background Glow */}
      <div className={cn(
        "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity",
        colors.split(' ').pop()
      )} />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-inner",
            colors.split(' ').slice(0, 2).join(' ')
          )}>
            <Icon name={icon} size={24} className={colors.split(' ')[2]} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground tracking-tight">{title}</p>
            <h3 className="text-2xl font-bold text-foreground mt-1 tabular-nums">{value}</h3>
          </div>
        </div>

        {change && (
          <div className={cn(
            "flex items-center px-2 py-1 rounded-full text-[11px] font-bold border",
            changeType === 'increase' 
              ? "bg-success/10 text-success border-success/20" 
              : changeType === 'decrease' 
                ? "bg-error/10 text-error border-error/20" 
                : "bg-muted text-muted-foreground border-border"
          )}>
            <Icon 
              name={changeType === 'increase' ? 'TrendingUp' : changeType === 'decrease' ? 'TrendingDown' : 'Minus'} 
              size={12} 
              className="mr-1"
            />
            {change}
          </div>
        )}
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default ModernStatsCard;
