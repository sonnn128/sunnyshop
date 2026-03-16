import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import { getAllOrders, getOrderStatistics } from 'lib/orderApi';

const STATUS_KEYS = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed', 'cancelled'];

const STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang vận chuyển',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

const STATUS_COLORS = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-sky-500',
  processing: 'bg-indigo-500',
  shipping: 'bg-blue-500',
  delivered: 'bg-emerald-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500'
};

const STATUS_BADGE_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-sky-100 text-sky-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipping: 'bg-blue-100 text-blue-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const parseAmount = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const cleaned = Number(value.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(cleaned) ? cleaned : 0;
  }
  if (value && typeof value === 'object' && 'toNumber' in value) {
    try {
      return Number(value.toNumber());
    } catch (error) {
      return 0;
    }
  }
  return 0;
};

const pickAmount = (value, fallback) => {
  if (value === undefined || value === null) return fallback;
  const parsed = parseAmount(value);
  if (parsed === 0 && !(value === 0 || value === '0' || value === '0.00')) {
    return fallback;
  }
  return parsed;
};

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'object' && value.$date) {
    const parsed = new Date(value.$date);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const deriveStatisticsFromOrders = (orders = [], pagination = {}) => {
  const counts = STATUS_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  let revenueTotal = 0;
  let revenueToday = 0;
  let revenueWeek = 0;
  let revenueMonth = 0;

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  const weekday = startOfWeek.getDay();
  const mondayOffset = (weekday + 6) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - mondayOffset);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  orders.forEach((order) => {
    const status = (order.status || '').toLowerCase();
    if (counts[status] !== undefined) {
      counts[status] += 1;
    }

    const amount = parseAmount(order.total ?? order.total_amount);
    revenueTotal += amount;

    const createdAt = toDate(order.createdAt || order.created_at || order.date);
    if (!createdAt) return;

    if (createdAt >= startOfToday) {
      revenueToday += amount;
    }
    if (createdAt >= startOfWeek) {
      revenueWeek += amount;
    }
    if (createdAt >= startOfMonth) {
      revenueMonth += amount;
    }
  });

  const totalFromCounts = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const totalOrders = pagination.totalItems || pagination.total || totalFromCounts;

  const metaCounts = pagination.statusCounts || pagination.counts || pagination.totals;
  if (metaCounts && typeof metaCounts === 'object') {
    STATUS_KEYS.forEach((key) => {
      if (typeof metaCounts[key] === 'number') {
        counts[key] = metaCounts[key];
      }
    });
  }

  return {
    totalOrders,
    counts,
    revenue: {
      total: revenueTotal,
      today: revenueToday,
      week: revenueWeek,
      month: revenueMonth
    }
  };
};

const mergeRemoteStatistics = (baseStats, remoteStats = {}) => {
  if (!remoteStats || typeof remoteStats !== 'object') {
    return baseStats;
  }

  const next = { ...baseStats };
  const remoteCounts = remoteStats.counts || remoteStats.statusCounts || remoteStats.statuses;
  if (remoteCounts && typeof remoteCounts === 'object') {
    STATUS_KEYS.forEach((key) => {
      if (typeof remoteCounts[key] === 'number') {
        next.counts[key] = remoteCounts[key];
      }
    });
  } else {
    STATUS_KEYS.forEach((key) => {
      const fieldName = `${key}Orders`;
      if (typeof remoteStats[fieldName] === 'number') {
        next.counts[key] = remoteStats[fieldName];
      }
      if (typeof remoteStats[key] === 'number') {
        next.counts[key] = remoteStats[key];
      }
    });
  }

  if (typeof remoteStats.totalOrders === 'number') {
    next.totalOrders = remoteStats.totalOrders;
  } else if (typeof remoteStats.total === 'number') {
    next.totalOrders = remoteStats.total;
  }

  const remoteRevenue = remoteStats.revenue || remoteStats.revenueStats || {};
  next.revenue = {
    total: pickAmount(remoteRevenue.total ?? remoteStats.totalRevenue, next.revenue.total),
    today: pickAmount(remoteRevenue.today ?? remoteStats.todayRevenue, next.revenue.today),
    week: pickAmount(remoteRevenue.week ?? remoteStats.weekRevenue, next.revenue.week),
    month: pickAmount(remoteRevenue.month ?? remoteStats.monthRevenue, next.revenue.month)
  };

  return next;
};

const fetchAllOrderPages = async (filters = {}, options = {}) => {
  const pageSize = typeof options?.pageSize === 'number' && options.pageSize > 0
    ? options.pageSize
    : filters.limit || 100;

  const maxPages = Number.isFinite(options?.maxPages)
    ? options.maxPages
    : Number.POSITIVE_INFINITY;

  const aggregated = [];
  const baseFilters = { ...filters };
  const includeDetailsFirstPage = Boolean(baseFilters.includeDetails);
  delete baseFilters.includeDetails;
  baseFilters.limit = pageSize;

  let page = 1;
  let totalPages = 1;
  let paginationMeta = {};
  let totalItems = null;

  while (page <= maxPages) {
    const pageFilters = { ...baseFilters, page };
    if (page === 1 && includeDetailsFirstPage) {
      pageFilters.includeDetails = true;
    }

    let response;
    try {
      response = await getAllOrders(pageFilters);
    } catch (error) {
      console.warn(`Failed to fetch orders for dashboard (page ${page})`, error);
      break;
    }

    if (!response) {
      break;
    }

    const currentOrders = Array.isArray(response.orders) ? response.orders : [];
    aggregated.push(...currentOrders);

    const currentPagination = response.pagination || {};
    paginationMeta = currentPagination;

    const pageTotalPages = currentPagination.totalPages;
    if (typeof pageTotalPages === 'number' && pageTotalPages > totalPages) {
      totalPages = pageTotalPages;
    }

    const metaTotalItems = currentPagination.totalItems ?? currentPagination.total ?? currentPagination.count ?? null;
    if (metaTotalItems != null) {
      totalItems = metaTotalItems;
    }

    const reachedTotalItems = totalItems != null && aggregated.length >= totalItems;
    const reachedTotalPages = typeof pageTotalPages === 'number' ? page >= pageTotalPages : page >= totalPages;

    if (reachedTotalItems || reachedTotalPages) {
      break;
    }

    if (!pageTotalPages && totalItems == null && page >= 1) {
      // Backend does not expose pagination metadata; avoid endless fetching
      break;
    }

    if (page >= maxPages) {
      break;
    }

    page += 1;
  }

  if (totalItems != null && aggregated.length > totalItems) {
    aggregated.length = totalItems;
  }

  return {
    orders: aggregated,
    pagination: {
      ...paginationMeta,
      totalItems: totalItems ?? paginationMeta.totalItems,
    },
  };
};

const OrdersDashboard = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippingOrders: 0,
    deliveredOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    revenue: {
      total: 0,
      today: 0,
      week: 0,
      month: 0
    }
  });
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  
  const statusCardConfig = [
    { key: 'pendingOrders', status: 'pending', label: STATUS_LABELS.pending, icon: 'FileText', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { key: 'confirmedOrders', status: 'confirmed', label: STATUS_LABELS.confirmed, icon: 'BadgeCheck', bgColor: 'bg-sky-100', textColor: 'text-sky-800' },
    { key: 'processingOrders', status: 'processing', label: STATUS_LABELS.processing, icon: 'RefreshCw', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
    { key: 'deliveredOrders', status: 'delivered', label: STATUS_LABELS.delivered, icon: 'PackageCheck', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
    { key: 'completedOrders', status: 'completed', label: STATUS_LABELS.completed, icon: 'CheckCircle', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { key: 'cancelledOrders', status: 'cancelled', label: STATUS_LABELS.cancelled, icon: 'AlertCircle', bgColor: 'bg-red-100', textColor: 'text-red-800' }
  ];

  // Fetch order statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const statisticsPromise = getOrderStatistics(period).catch((error) => {
          console.warn('getOrderStatistics failed, fallback to derived stats', error);
          return null;
        });

        const ordersResult = await fetchAllOrderPages(
          { includeDetails: true, sort: '-created_at' },
          { pageSize: 150 }
        );

        const statsResponse = await statisticsPromise;

        const orders = ordersResult?.orders || [];
        const pagination = ordersResult?.pagination || {};
        let derived = deriveStatisticsFromOrders(orders, pagination);

        const remotePayload = statsResponse?.data || statsResponse?.statistics || statsResponse;
        derived = mergeRemoteStatistics(derived, remotePayload);

        const derivedTotal = derived.totalOrders || Object.values(derived.counts || {}).reduce((sum, value) => sum + (value || 0), 0);

        setStatistics({
          totalOrders: derivedTotal,
          pendingOrders: derived.counts.pending || 0,
          confirmedOrders: derived.counts.confirmed || 0,
          processingOrders: derived.counts.processing || 0,
          shippingOrders: derived.counts.shipping || 0,
          deliveredOrders: derived.counts.delivered || 0,
          completedOrders: derived.counts.completed || 0,
          cancelledOrders: derived.counts.cancelled || 0,
          revenue: {
            total: derived.revenue.total || 0,
            today: derived.revenue.today || 0,
            week: derived.revenue.week || 0,
            month: derived.revenue.month || 0
          }
        });

  setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error preparing order dashboard statistics:', error);
        setStatistics({
          totalOrders: 0,
          pendingOrders: 0,
          confirmedOrders: 0,
          processingOrders: 0,
          shippingOrders: 0,
          deliveredOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          revenue: { total: 0, today: 0, week: 0, month: 0 }
        });
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, [period]);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statusTotals = {
    pending: statistics.pendingOrders || 0,
    confirmed: statistics.confirmedOrders || 0,
    processing: statistics.processingOrders || 0,
    shipping: statistics.shippingOrders || 0,
    delivered: statistics.deliveredOrders || 0,
    completed: statistics.completedOrders || 0,
    cancelled: statistics.cancelledOrders || 0
  };

  const countedTotal = Object.values(statusTotals).reduce((sum, value) => sum + value, 0);
  const totalForPercent = statistics.totalOrders || countedTotal || 0;

  const getPercentage = (value) => {
    if (!totalForPercent) return 0;
    return Math.round((value / totalForPercent) * 100);
  };

  const renderStatusBadge = (status) => {
    const normalized = (status || '').toLowerCase();
    const style = STATUS_BADGE_STYLES[normalized] || 'bg-muted text-foreground';
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
        {STATUS_LABELS[normalized] || status || 'Không xác định'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
          <span>Đang tải thống kê đơn hàng...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 lg:mb-0">Quản lý Đơn hàng</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/admin-panel?tab=orders')}
            className="flex items-center gap-2"
          >
            <Icon name="List" className="w-4 h-4" />
            Danh sách đơn hàng
          </Button>
          <Button
            onClick={() => navigate('/admin-panel/orders/export')}
            className="flex items-center gap-2"
          >
            <Icon name="Download" className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>
      
      {/* Status summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusCardConfig.map((item) => {
          const count = statistics[item.key] ?? 0;
          return (
            <div key={item.key} className="bg-white rounded-lg shadow border border-border overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <h3 className="text-2xl font-bold">{count}</h3>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.bgColor}`}>
                  <Icon name={item.icon} className={`w-6 h-6 ${item.textColor}`} />
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm font-medium" 
                  onClick={() => navigate(`/admin-panel?tab=orders&status=${item.status}`)}
                >
                  Xem chi tiết
                  <Icon name="ArrowRight" className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            </div>
          );
        })}
      </div>
      
      {/* Revenue overview */}
      <div className="bg-white rounded-lg shadow border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Tổng quan doanh thu</h3>
            <div className="flex items-center space-x-2">
              <button 
                className={`px-3 py-1 text-sm rounded-md ${period === 'week' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                onClick={() => setPeriod('week')}
              >
                Tuần
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${period === 'month' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                onClick={() => setPeriod('month')}
              >
                Tháng
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${period === 'year' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                onClick={() => setPeriod('year')}
              >
                Năm
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Hôm nay</p>
              <h3 className="text-xl font-semibold text-primary">{formatCurrency(statistics.revenue.today)}</h3>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tuần này</p>
              <h3 className="text-xl font-semibold">{formatCurrency(statistics.revenue.week)}</h3>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tháng này</p>
              <h3 className="text-xl font-semibold">{formatCurrency(statistics.revenue.month)}</h3>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              <h3 className="text-xl font-semibold">{formatCurrency(statistics.revenue.total)}</h3>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="font-medium mb-4">Doanh thu theo thời gian</h4>
            <div className="w-full h-64 bg-muted/20 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-lg shadow border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Đơn hàng gần nhất</h3>
            <p className="text-sm text-muted-foreground">Theo dõi nhanh các đơn hàng mới tạo hoặc vừa cập nhật</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin-panel?tab=orders')}
          >
            Xem tất cả
          </Button>
        </div>
        <div className="p-6 overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">Chưa có đơn hàng nào gần đây.</div>
          ) : (
            <table className="w-full min-w-[640px]">
              <thead className="text-left text-sm text-muted-foreground">
                <tr>
                  <th className="pb-3 font-medium">Đơn hàng</th>
                  <th className="pb-3 font-medium">Khách hàng</th>
                  <th className="pb-3 font-medium">Tổng tiền</th>
                  <th className="pb-3 font-medium">Trạng thái</th>
                  <th className="pb-3 font-medium">Ngày tạo</th>
                  <th className="pb-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => {
                  const orderId = order.id || order._id;
                  const orderNumber = order.orderNumber || orderId;
                  const customerName = order.customer?.name
                    || order.shippingAddress?.fullName
                    || order.shippingAddress?.name
                    || order.billingAddress?.fullName
                    || 'Khách hàng';
                  const totalAmount = parseAmount(order.total ?? order.total_amount);
                  const createdAt = order.createdAt || order.created_at || order.date;
                  const createdDate = toDate(createdAt);
                  return (
                    <tr key={orderId} className="text-sm">
                      <td className="py-3 font-medium text-foreground">#{orderNumber}</td>
                      <td className="py-3 text-muted-foreground">{customerName}</td>
                      <td className="py-3 font-medium">{formatCurrency(totalAmount)}</td>
                      <td className="py-3">{renderStatusBadge(order.status)}</td>
                      <td className="py-3 text-muted-foreground">{createdDate ? createdDate.toLocaleString('vi-VN') : ''}</td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={() => navigate(`/admin-panel/orders/${orderId}`)}
                        >
                          Xem
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold">Thao tác nhanh</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col space-y-3">
              <Button 
                variant="outline" 
                className="justify-start flex items-center gap-2" 
                onClick={() => navigate('/admin-panel?tab=orders')}
              >
                <Icon name="Search" className="w-4 h-4" />
                Tìm kiếm đơn hàng
              </Button>
              <Button 
                variant="outline" 
                className="justify-start flex items-center gap-2" 
                onClick={() => navigate('/admin-panel?tab=orders&status=pending')}
              >
                <Icon name="Filter" className="w-4 h-4" />
                Lọc đơn hàng chờ xác nhận
              </Button>
              <Button 
                variant="outline" 
                className="justify-start flex items-center gap-2" 
                onClick={() => navigate('/admin-panel?tab=orders&status=processing')}
              >
                <Icon name="RefreshCw" className="w-4 h-4" />
                Theo dõi đơn đang xử lý
              </Button>
              <Button 
                variant="outline" 
                className="justify-start flex items-center gap-2" 
                onClick={() => navigate('/admin-panel?tab=orders&status=shipping')}
              >
                <Icon name="Truck" className="w-4 h-4" />
                Quản lý đơn hàng đang giao
              </Button>
              <Button 
                variant="outline" 
                className="justify-start flex items-center gap-2" 
                onClick={() => navigate('/admin-panel/orders/export')}
              >
                <Icon name="Download" className="w-4 h-4" />
                Xuất báo cáo đơn hàng
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold">Tổng quan đơn hàng</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tổng số đơn hàng</span>
                <span className="font-medium">{statistics.totalOrders}</span>
              </div>
              
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="flex h-full">
                  {STATUS_KEYS.map((key) => {
                    const value = statusTotals[key];
                    if (!value) return null;
                    const width = getPercentage(value);
                    const safeWidth = width <= 0 ? 0 : width;
                    return (
                      <div
                        key={key}
                        className={`${STATUS_COLORS[key]} transition-all duration-300`}
                        style={{ width: `${safeWidth}%` }}
                      />
                    );
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {STATUS_KEYS.map((key) => {
                  const value = statusTotals[key];
                  if (!value && !totalForPercent) return null;
                  const percentage = getPercentage(value);
                  return (
                    <div key={key} className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${STATUS_COLORS[key]}`} />
                      <span className="text-sm text-muted-foreground">
                        {STATUS_LABELS[key]} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDashboard;