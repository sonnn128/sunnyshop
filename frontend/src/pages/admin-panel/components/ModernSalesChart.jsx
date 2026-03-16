import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const ModernSalesChart = ({ data = [], loading = false, error = null, onRetry }) => {
  const formatCurrency = (value) => {
    const millionUnit = value / 1_000_000;
    if (!Number.isFinite(millionUnit)) return '0 VND';
    return `${millionUnit.toFixed(millionUnit >= 10 ? 0 : 1).replace(/\.0$/, '')}M`;
  };

  const chartData = Array.isArray(data) && data.length > 0
    ? data.map((item) => ({
        month: item.label || `T${item.month}`,
        revenue: item.revenue || 0,
        orders: item.orders || 0
      }))
    : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-5 rounded-[2rem] shadow-2xl border-white/40 min-w-[200px]">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 border-b border-primary/10 pb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6 mb-3 last:mb-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shadow-glow" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-foreground tabular-nums">
                {entry.name === 'Revenue' ? formatCurrency(entry.value) : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-[3rem] shadow-2xl overflow-hidden border-white/30"
    >
      <div className="p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div>
          <h3 className="text-2xl font-black text-foreground tracking-tight">Revenue Dynamics</h3>
          <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-[0.2em] opacity-60">Visualizing global market penetration</p>
        </div>
        <div className="flex items-center gap-6">
          <ChartLegend label="Revenue" color="hsl(var(--primary))" />
          <ChartLegend label="Transaction" color="hsl(var(--accent))" />
        </div>
      </div>

      <div className="px-10 pb-10">
        {loading ? (
          <div className="h-[450px] flex items-center justify-center animate-pulse bg-muted/10 rounded-[2.5rem]" />
        ) : error ? (
          <div className="h-[450px] flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground font-bold mb-6 italic">Protocol Interruption: {error}</p>
            <button onClick={onRetry} className="h-10 px-8 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all">Re-sync</button>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[450px] flex items-center justify-center text-xs font-black uppercase tracking-widest text-muted-foreground/30">Void Spectrum Detected</div>
        ) : (
          <div className="h-[450px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="anRevenueEl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="anOrdersEl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}
                  dy={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '8 8', opacity: 0.1 }} />
                <Area 
                  name="Revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={6}
                  fillOpacity={1} 
                  fill="url(#anRevenueEl)" 
                  animationDuration={2000}
                />
                <Area 
                  name="Transaction"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={6}
                  fillOpacity={1} 
                  fill="url(#anOrdersEl)" 
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ChartLegend = ({ label, color }) => (
  <div className="flex items-center gap-3">
    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}66` }} />
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70">{label}</span>
  </div>
);

export default ModernSalesChart;
