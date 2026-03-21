import React from 'react';
import Icon from '@/components/AppIcon';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n';

const ModernStatsCard = ({ title, value, change, changeType, icon }) => {
  const { t } = useI18n();
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="relative group bg-white p-8 border border-slate-200 shadow-sm"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100">
            <Icon name={icon} size={24} className="text-slate-900" strokeWidth={1.5} />
          </div>
          
          {change && (
            <div className={cn(
              "flex items-center text-[10px] font-bold uppercase tracking-widest",
              changeType === 'increase' ? "text-emerald-600" : "text-rose-600"
            )}>
              <Icon 
                name={changeType === 'increase' ? 'ArrowUpRight' : changeType === 'decrease' ? 'ArrowDownRight' : 'Minus'} 
                size={12} 
                className="mr-1"
                strokeWidth={2}
              />
              {change}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">{title}</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif text-slate-900 tracking-tight">{value}</span>
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between group-hover:border-slate-200 transition-colors">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{t.dashboard.salesChart.analyticalDetails}</span>
          <Icon name="ArrowRight" size={12} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};

export default ModernStatsCard;
