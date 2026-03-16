import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

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
        <div className="bg-background/90 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-2xl">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-8 mb-1 last:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm font-medium text-foreground">{entry.name}:</span>
              </div>
              <span className="text-sm font-bold tabular-nums">
                {entry.name === 'Doanh thu' ? formatCurrency(entry.value) + ' VND' : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] shadow-elegant overflow-hidden transition-all duration-500 hover:shadow-2xl">
      <div className="p-8 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Hiệu suất kinh doanh</h3>
          <p className="text-sm text-muted-foreground mt-1">Phân tích doanh thu và lượng đơn hàng</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-xl">
            <div className="w-2 h-2 bg-primary rounded-full shadow-glow"></div>
            <span className="text-xs font-bold text-primary">Doanh thu</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-accent/10 rounded-xl">
            <div className="w-2 h-2 bg-accent rounded-full shadow-glow"></div>
            <span className="text-xs font-bold text-accent">Đơn hàng</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="h-80 flex items-center justify-center animate-pulse bg-muted/20 rounded-3xl" />
        ) : error ? (
          <div className="h-80 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <button onClick={onRetry} className="text-sm font-bold text-primary hover:underline">Thử lại</button>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">Không có dữ liệu hiển thị</div>
        ) : (
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  name="Doanh thu"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  name="Đơn hàng"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorOrders)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernSalesChart;
