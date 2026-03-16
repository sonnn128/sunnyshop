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
import ModernStatsCard from './ModernStatsCard';
import { getAnalyticsOverview } from '../../../lib/analyticsApi';
import { cn } from '../../../lib/utils';

const RANGE_OPTIONS = [
  { value: '30d', label: '30 ngày' },
  { value: '60d', label: '60 ngày' },
  { value: '90d', label: '90 ngày' },
  { value: '180d', label: '6 tháng' },
  { value: '365d', label: '12 tháng' },
  { value: 'custom', label: 'Tùy chỉnh' }
];

const STATUS_COLORS = {
  pending: '#F59E0B',
  confirmed: '#10B981',
  processing: '#3B82F6',
  shipped: '#8B5CF6',
  delivered: '#059669',
  cancelled: '#EF4444',
  returned: '#F97316',
  refunded: '#6366F1'
};

const CHART_COLORS = ['#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#8B5CF6', '#3B82F6', '#10B981', '#EF4444'];
const PAYMENT_COLORS = ['#10B981', '#F59E0B', '#84CC16', '#EAB308', '#22C55E', '#FCD34D'];

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(Number(value || 0));
const formatPercent = (value) => `${(Number(value) || 0).toFixed(1)}%`;

const getChangeLabel = (percent = 0) => {
  const value = Number(percent) || 0;
  const symbol = value > 0 ? '+' : '';
  return `${symbol}${value.toFixed(1)}%`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-xl min-w-[180px] z-50">
        {label && <p className="font-bold text-foreground mb-3 text-xs uppercase tracking-widest opacity-60">{label}</p>}
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.payload.fill }} />
                 <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-tight">
                   {entry.name === 'revenue' ? 'Doanh thu' : entry.name === 'orders' ? 'Đơn hàng' : entry.name}
                 </span>
              </div>
              <span className="font-black text-foreground text-sm">
                {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const cos = Math.cos(-RADIAN * midAngle);
  const sin = Math.sin(-RADIAN * midAngle);
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={-4} textAnchor="middle" className="fill-foreground text-2xl font-black">
        {value}
      </text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold uppercase tracking-widest uppercase">
        Đơn hàng
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={10} />
      <text x={mx} y={my} textAnchor={textAnchor} className="fill-foreground font-bold text-xs">
        {payload.name}
      </text>
      <text x={mx} y={my} dy={16} textAnchor={textAnchor} className="fill-muted-foreground text-[10px] font-bold">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

const AnalyticsDashboard = () => {
  const [range, setRange] = useState('90d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [exporting, setExporting] = useState(false);
  const containerRef = useRef(null);

  const fetchData = async (selectedRange = range) => {
    try {
      setLoading(true);
      const params = { range: selectedRange };
      if (selectedRange === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      const response = await getAnalyticsOverview(params);
      setData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (range !== 'custom' || (startDate && endDate)) fetchData(range);
  }, [range, startDate, endDate]);

  const timelineData = useMemo(() => data?.timeline || [], [data]);
  const orderStatusData = useMemo(() => data?.orderStatus?.map(i => ({ name: i.status, value: i.count, percent: i.percent })) || [], [data]);
  const paymentMethodData = useMemo(() => data?.paymentMethods?.map(i => ({ name: i.method, value: i.count, percent: i.percent, revenue: i.revenue })) || [], [data]);
  const topProducts = useMemo(() => data?.topProducts || [], [data]);

  const summaryCards = useMemo(() => {
    const s = data?.summary || {};
    return [
      { title: 'Tổng doanh thu', value: formatCurrency(s.totalRevenue || 0), change: getChangeLabel(s.revenueChange), changeType: (s.revenueChange || 0) >= 0 ? 'increase' : 'decrease', icon: 'TrendingUp', color: 'primary' },
      { title: 'Số đơn hàng', value: (s.totalOrders || 0).toLocaleString(), change: getChangeLabel(s.ordersChange), changeType: (s.ordersChange || 0) >= 0 ? 'increase' : 'decrease', icon: 'ShoppingCart', color: 'success' },
      { title: 'Giá trị TB', value: formatCurrency(s.avgOrderValue || 0), change: getChangeLabel(s.aovChange), changeType: (s.aovChange || 0) >= 0 ? 'increase' : 'decrease', icon: 'Wallet', color: 'accent' },
      { title: 'Khách quay lại', value: formatPercent(s.returningRate || 0), change: `${s.returningCustomers || 0} khách`, changeType: 'neutral', icon: 'Users', color: 'warning' }
    ];
  }, [data]);

  const exportToPDF = async () => {
    if (!containerRef.current) return;
    try {
      setExporting(true);
      const canvas = await html2canvas(containerRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`analytics-${range}-${new Date().getTime()}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-card/40 rounded-3xl" />)}
      <div className="col-span-full h-96 bg-card/40 rounded-3xl" />
    </div>
  );

  return (
    <div ref={containerRef} className="space-y-10 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Phân tích chuyên sâu</h2>
          <p className="text-muted-foreground mt-2 font-medium">Báo cáo hiệu suất kinh doanh Sunny Fashion</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-card/40 backdrop-blur-md p-2 rounded-3xl border border-border/50">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-2xl transition-all duration-300 uppercase tracking-widest",
                range === opt.value ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
          <Button variant="outline" className="rounded-2xl h-10 border-border/50" iconName="Download" disabled={exporting} onClick={exportToPDF}>
            {exporting ? '...' : 'PDF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, idx) => <ModernStatsCard key={idx} {...card} />)}
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
        <div className="2xl:col-span-2 bg-card/60 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-10 shadow-elegant">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-foreground">Xu hướng doanh thu</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-xs font-bold">Doanh thu</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent" /><span className="text-xs font-bold">Đơn hàng</span></div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="anRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} dy={10} />
                <YAxis yAxisId="left" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1e6).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={4} fill="url(#anRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-10 shadow-elegant flex flex-col items-center">
          <h3 className="text-2xl font-black text-foreground mb-10 self-start">Tỉ lệ đơn hàng</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={orderStatusData}
                  cx="50%" cy="50%" innerRadius={80} outerRadius={110}
                  dataKey="value" onMouseEnter={(_, i) => setActiveIndex(i)}
                  stroke="none" cornerRadius={15} paddingAngle={5}
                >
                  {orderStatusData.map((e, i) => <Cell key={i} fill={STATUS_COLORS[e.name] || CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-10 shadow-elegant">
          <h3 className="text-2xl font-black text-foreground mb-10">Kênh thanh toán</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethodData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" fontSize={12} fontWeight={800} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                  {paymentMethodData.map((e, i) => <Cell key={i} fill={PAYMENT_COLORS[i % PAYMENT_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-10 shadow-elegant">
          <h3 className="text-2xl font-black text-foreground mb-8">Sản phẩm ngôi sao</h3>
          <div className="space-y-6">
            {topProducts.slice(0, 5).map((p, i) => (
              <div key={i} className="group flex items-center gap-5 p-4 rounded-3xl bg-muted/20 hover:bg-muted/40 transition-all duration-300">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border/50">
                  <Image src={p.image || 'https://placehold.co/120x120?text=Fashion'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">{p.brand || 'Sunny Collection'}</p>
                  <div className="h-1.5 w-full bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(p.totalSold / (topProducts[0]?.totalSold || 1)) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-accent text-sm">{formatCurrency(p.totalRevenue)}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">{p.totalSold} đã bán</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
