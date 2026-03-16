import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
const SalesChart = ({ data = [], loading = false, error = null, onRetry }) => {
  const formatCurrency = (value) => {
    const millionUnit = value / 1_000_000;
    if (!Number.isFinite(millionUnit)) return '0 VND';
    const rounded = millionUnit >= 10 ? millionUnit.toFixed(0) : millionUnit.toFixed(1);
    return `${rounded.replace(/\.0$/, '')}M VND`;
  };

  const chartData = Array.isArray(data) && data.length > 0
    ? data.map((item) => ({
        month: item.label || `Thg ${item.month}`,
        revenue: item.revenue || 0,
        orders: item.orders || 0
      }))
    : [];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[0, 1].map((key) => (
              <div key={key} className="space-y-4">
                <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                <div className="w-full h-64 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          {onRetry && (
            <button
              type="button"
              className="mt-4 text-sm font-medium text-accent hover:text-accent/80"
              onClick={onRetry}
            >
              Thử tải lại dữ liệu
            </button>
          )}
        </div>
      );
    }

    if (chartData.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu doanh thu để hiển thị.</p>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Doanh thu theo tháng</h4>
            <div className="w-full h-64" aria-label="Monthly Revenue Bar Chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="month"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Số đơn hàng theo tháng</h4>
            <div className="w-full h-64" aria-label="Monthly Orders Line Chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="month"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value) => [value, 'Đơn hàng']}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="var(--color-accent)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elegant">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Biểu đồ doanh thu</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Doanh thu</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-sm text-muted-foreground">Đơn hàng</span>
            </div>
          </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default SalesChart;