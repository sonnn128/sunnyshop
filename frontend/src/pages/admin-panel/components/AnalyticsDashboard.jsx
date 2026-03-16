import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Sector
} from 'recharts';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import StatsCard from './StatsCard';
import { getAnalyticsOverview } from '../../../lib/analyticsApi';

const RANGE_OPTIONS = [
  { value: '30d', label: '30 ngày' },
  { value: '60d', label: '60 ngày' },
  { value: '90d', label: '90 ngày' },
  { value: '180d', label: '6 tháng' },
  { value: '365d', label: '12 tháng' },
  { value: 'custom', label: 'Tùy chỉnh' }
];

const STATUS_COLORS = {
  pending: '#F59E0B',    // Amber
  confirmed: '#10B981',  // Emerald
  processing: '#3B82F6', // Blue
  shipped: '#8B5CF6',    // Violet
  delivered: '#059669',  // Green
  cancelled: '#EF4444',  // Red
  returned: '#F97316',   // Orange
  refunded: '#6366F1'    // Indigo
};

// General Palette
const CHART_COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#EF4444'  // Red
];

// Payment Method Palette (Green & Yellow focus)
const PAYMENT_COLORS = [
  '#10B981', // Emerald (Green)
  '#F59E0B', // Amber (Yellow)
  '#84CC16', // Lime
  '#EAB308', // Yellow-500
  '#22C55E', // Green-500
  '#FCD34D', // Amber-300
];

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));
const formatPercent = (value) => `${(Number(value) || 0).toFixed(1)}%`;

const getChangeLabel = (percent = 0) => {
  const value = Number(percent) || 0;
  if (value === 0) return 'Không đổi';
  const symbol = value > 0 ? '+' : '';
  return `${symbol}${value.toFixed(1)}% so với kỳ trước`;
};

// --- Custom Components ---

// Improved CustomTooltip with better contrast
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-3 rounded-lg shadow-xl min-w-[150px] z-50">
        {label && <p className="font-semibold text-foreground mb-2 text-sm border-b border-border pb-1">{label}</p>}
        <div className="space-y-1.5 pt-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 text-sm justify-between">
              <div className="flex items-center gap-2">
                 <span 
                   className="w-2.5 h-2.5 rounded-full"
                   style={{ backgroundColor: entry.color || entry.payload.fill }}
                 />
                 <span className="text-muted-foreground capitalize text-xs">
                   {entry.name === 'revenue' ? 'Doanh thu' : 
                    entry.name === 'orders' ? 'Đơn hàng' : 
                    entry.name === 'avgOrderValue' ? 'Giá trị TB' : 
                    entry.name}
                 </span>
              </div>
              <span className="font-semibold text-foreground ml-2">
                {entry.name === 'revenue' || entry.name === 'avgOrderValue' || entry.name === 'Doanh thu' || entry.name.includes('revenue')
                  ? formatCurrency(entry.value) 
                  : ((entry.dataKey === 'percent' || entry.unit === '%') 
                       ? `${(Number(entry.value)).toFixed(1)}%` 
                       : entry.value.toLocaleString())}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Active Shape for Donut Chart
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 8) * cos;
  const sy = cy + (outerRadius + 8) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 12;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={-4} textAnchor="middle" className="fill-foreground text-2xl font-bold">
        {value}
      </text>
      <text x={cx} y={cy} dy={16} textAnchor="middle" className="fill-muted-foreground text-xs font-medium uppercase tracking-wider">
        Đơn hàng
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 12}
        fill={fill}
        opacity={0.3}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={textAnchor} className="fill-foreground font-semibold text-sm">
        {payload.name}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={16} textAnchor={textAnchor} className="fill-muted-foreground text-xs">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const AnalyticsDashboard = () => {
  const [range, setRange] = useState('90d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Exporting state & ref for PDF generation
  const [exporting, setExporting] = useState(false);
  const containerRef = useRef(null);

  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  const fetchData = async (selectedRange = range) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { range: selectedRange };
      if (selectedRange === 'custom') {
        if (!startDate || !endDate) {
           setLoading(false);
           return; 
        }
        params.startDate = startDate;
        params.endDate = endDate;
      }
      
      const response = await getAnalyticsOverview(params);
      setData(response);
    } catch (err) {
      console.error('Failed to load analytics overview:', err);
      setError('Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (range !== 'custom') {
      fetchData(range);
    } else if (startDate && endDate) {
      fetchData(range);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, startDate, endDate]);

  const timelineData = useMemo(() => {
    if (!Array.isArray(data?.timeline)) return [];
    return data.timeline.map((item) => ({
      ...item,
    }));
  }, [data]);

  // Export PDF Logic
  const buildPDFName = (name) => {
    const now = new Date();
    const ts = now.toISOString().replace(/[:.]/g, '-');
    return `${name}-range-${range}-${ts}.pdf`;
  };

  const exportToPDF = async () => {
    if (!containerRef.current) return;
    try {
      setExporting(true);
      const element = containerRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let position = 0;
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        while (heightLeft > 0) {
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
          position -= pdfHeight;
          if (heightLeft > 0) pdf.addPage();
        }
      }
      pdf.save(buildPDFName('analytics'));
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setExporting(false);
    }
  };

  const orderStatusData = useMemo(() => (
    Array.isArray(data?.orderStatus)
      ? data.orderStatus.map((item) => ({
          name: item.status,
          value: item.count,
          percent: item.percent
        }))
      : []
  ), [data]);

  const paymentMethodData = useMemo(() => (
    Array.isArray(data?.paymentMethods)
      ? data.paymentMethods.map((item) => ({
          name: item.method,
          value: item.count,
          percent: item.percent,
          revenue: item.revenue
        }))
      : []
  ), [data]);

  const topProducts = useMemo(() => (
    Array.isArray(data?.topProducts) ? data.topProducts : []
  ), [data]);

  const summaryCards = useMemo(() => {
    const summary = data?.summary || {};
    return [
      {
        title: 'Tổng doanh thu',
        value: formatCurrency(summary.totalRevenue || 0),
        change: getChangeLabel(summary.revenueChange),
        changeType: (summary.revenueChange || 0) >= 0 ? 'increase' : 'decrease',
        icon: 'TrendingUp'
      },
      {
        title: 'Tổng đơn hàng',
        value: (summary.totalOrders || 0).toLocaleString('vi-VN'),
        change: getChangeLabel(summary.ordersChange),
        changeType: (summary.ordersChange || 0) >= 0 ? 'increase' : 'decrease',
        icon: 'ShoppingCart'
      },
      {
        title: 'Giá trị đơn trung bình',
        value: formatCurrency(summary.avgOrderValue || 0),
        change: getChangeLabel(summary.aovChange),
        changeType: (summary.aovChange || 0) >= 0 ? 'increase' : 'decrease',
        icon: 'Wallet'
      },
      {
        title: 'Tỉ lệ khách quay lại',
        value: formatPercent(summary.returningRate || 0),
        change: `${summary.returningCustomers || 0} khách quay lại`,
        changeType: 'neutral',
        icon: 'Users'
      }
    ];
  }, [data]);

  const renderLoadingState = () => (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-96 bg-muted rounded-xl" />
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Phân tích kinh doanh</h2>
          <p className="text-muted-foreground mt-1">Tổng quan hiệu suất và xu hướng tăng trưởng.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          {range === 'custom' && (
             <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300 bg-background border rounded-lg p-1 shadow-sm">
                <input 
                  type="date" 
                  className="h-9 px-2 rounded-md bg-transparent text-sm focus:outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate || undefined}
                />
                <span className="text-muted-foreground">-</span>
                <input 
                  type="date" 
                  className="h-9 px-2 rounded-md bg-transparent text-sm focus:outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
                />
             </div>
          )}

          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setRange(option.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  range === option.value 
                    ? 'bg-background text-foreground shadow-sm ring-1 ring-border' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchData(range)}
              className="rounded-lg w-9 h-9"
            >
              <Icon name="RefreshCw" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              disabled={exporting}
              onClick={() => exportToPDF()}
              className="rounded-lg h-9"
            >
              {exporting ? '...' : 'PDF'}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="AlertCircle" size={18} />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchData(range)} className="border-destructive/20 hover:bg-destructive/10">Thử lại</Button>
        </div>
      )}

      {loading ? (
        renderLoadingState()
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {summaryCards.map((card, index) => (
              <StatsCard key={index} {...card} />
            ))}
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
            {/* Revenue Area Chart */}
            <div className="2xl:col-span-2 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Biểu đồ doanh thu</h3>
                  <p className="text-sm text-muted-foreground">So sánh doanh thu và số lượng đơn hàng theo thời gian</p>
                </div>
              </div>
              <div className="p-6">
                {timelineData.length === 0 ? (
                  <div className="h-96 flex flex-col items-center justify-center text-muted-foreground">
                    <Icon name="BarChart2" size={48} className="mb-4 opacity-20" />
                    <p>Chưa có dữ liệu trong giai đoạn này</p>
                  </div>
                ) : (
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          stroke="var(--color-muted-foreground)" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="var(--color-muted-foreground)" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                          dx={-10}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="var(--color-muted-foreground)" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={false}
                          dx={10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-muted)/20' }} />
                        <Legend iconType="circle" />
                        <Area 
                          yAxisId="left"
                          type="linear" 
                          dataKey="revenue" 
                          name="Doanh thu" 
                          stroke="var(--color-primary)" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-foreground)' }}
                        />
                         <Area 
                          yAxisId="right"
                          type="linear" 
                          dataKey="orders" 
                          name="Đơn hàng" 
                          stroke="var(--color-accent)" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorOrders)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Order Status Donut Chart */}
            <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Trạng thái đơn hàng</h3>
                <p className="text-sm text-muted-foreground">Phân bổ theo giai đoạn xử lý</p>
              </div>
              <div className="p-6 flex items-center justify-center">
                {orderStatusData.length === 0 ? (
                  <div className="h-80 flex flex-col items-center justify-center text-muted-foreground">
                    <p>Chưa có dữ liệu</p>
                  </div>
                ) : (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          dataKey="value"
                          onMouseEnter={onPieEnter}
                          paddingAngle={2}
                          cornerRadius={6}
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={STATUS_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]} 
                              stroke="var(--color-card)"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        {/* No tooltip needed as ActiveShape has info */}
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Payment Methods - Changed to BarChart for clear comparison */}
            <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
               <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Phương thức thanh toán</h3>
                <p className="text-sm text-muted-foreground">So sánh hiệu quả các kênh thanh toán</p>
              </div>
              <div className="p-6">
                {paymentMethodData.length === 0 ? (
                  <div className="text-center text-muted-foreground py-16">Chưa có dữ liệu</div>
                ) : (
                  <div className="h-72 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={paymentMethodData} layout="vertical" margin={{ left: 20 }}>
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                           <XAxis type="number" stroke="var(--color-muted-foreground)" hide />
                           <YAxis 
                              type="category" 
                              dataKey="name" 
                              stroke="var(--color-foreground)" 
                              fontSize={13} 
                              fontWeight={500}
                              width={120}
                              tickLine={false}
                              axisLine={false}
                           />
                           {/* FIX: Cursor made transparent to remove black box */}
                           <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                           <Bar dataKey="value" name="Số lượng" radius={[0, 6, 6, 0]} barSize={24}>
                              {paymentMethodData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Sản phẩm bán chạy</h3>
                <p className="text-sm text-muted-foreground">Top 5 sản phẩm đạt doanh số cao nhất</p>
              </div>
              <div className="p-6">
                 {topProducts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-16">Chưa có dữ liệu</div>
                 ) : (
                    <div className="space-y-5">
                       {topProducts.slice(0, 5).map((product, idx) => (
                          <div key={idx} className="group flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                             <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-border shadow-sm">
                                <Image
                                   src={product.image || 'https://placehold.co/120x120?text=No+Image'}
                                   alt={product.name}
                                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-0 left-0 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                                  #{idx + 1}
                                </div>
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">{product.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                   <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${Math.min((product.totalSold / (topProducts[0]?.totalSold || 1)) * 100, 100)}%` }}
                                      />
                                   </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{product.totalSold} đã bán</span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                   <p className="text-xs text-muted-foreground truncate">
                                      {product.brand ? `${product.brand}` : 'No Brand'}
                                   </p> 
                                   <p className="text-xs font-medium text-foreground">
                                     {formatCurrency(product.currentPrice || product.totalRevenue / (product.totalSold || 1))}/sp
                                   </p>
                                </div>
                             </div>
                             <div className="text-right pl-2">
                                <p className="text-sm font-bold text-accent">{formatCurrency(product.totalRevenue)}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">Doanh thu</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
