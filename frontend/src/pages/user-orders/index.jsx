
import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../../lib/orderApi';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({ currentPage: 1, perPage: 10, totalPages: 0, totalItems: 0 });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getUserOrders({ page, limit, includeDetails: true });
        if (res && res.orders && Array.isArray(res.orders)) {
          setOrders(res.orders);
          if (res.pagination) setPagination(res.pagination);
        } else if (Array.isArray(res)) {
          setOrders(res);
          setPagination({ currentPage: 1, perPage: res.length || limit, totalPages: 1, totalItems: res.length || 0 });
        } else {
          setOrders([]);
          setPagination({ currentPage: 1, perPage: limit, totalPages: 0, totalItems: 0 });
        }
      } catch (e) {
        setOrders([]);
        setPagination({ currentPage: 1, perPage: limit, totalPages: 0, totalItems: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [page, limit]);

  const totalItems = pagination?.totalItems || 0;
  const perPage = pagination?.perPage || limit;
  const effectiveTotalPages = pagination?.totalPages || Math.max(1, Math.ceil(totalItems / (perPage || 1)));
  const clampedCurrentPage = Math.min(Math.max(1, page), effectiveTotalPages);
  const startItem = totalItems === 0 ? 0 : (clampedCurrentPage - 1) * perPage + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(startItem + perPage - 1, totalItems);
  const showPagination = effectiveTotalPages > 1;

  const goToPage = (p) => {
    const nextPage = Math.min(effectiveTotalPages, Math.max(1, p));
    setPage(nextPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageNumbers = (() => {
    if (!showPagination) return [1];
    if (effectiveTotalPages <= 5) return Array.from({ length: effectiveTotalPages }, (_, index) => index + 1);
    const pages = [1];
    const start = Math.max(2, clampedCurrentPage - 1);
    const end = Math.min(effectiveTotalPages - 1, clampedCurrentPage + 1);
    if (start > 2) pages.push('left-ellipsis');
    for (let pageIdx = start; pageIdx <= end; pageIdx += 1) pages.push(pageIdx);
    if (end < effectiveTotalPages - 1) pages.push('right-ellipsis');
    pages.push(effectiveTotalPages);
    return pages;
  })();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Lịch sử đơn hàng</h2>
        {loading ? (
          <div className="bg-card p-6 rounded border border-border">Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className="bg-card p-6 rounded border border-border">Bạn chưa có đơn hàng nào.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id || o._id} className="bg-card p-4 rounded border border-border flex justify-between items-center">
                <div>
                  <div className="font-medium">{o.orderNumber || o.id || o._id}</div>
                  <div className="text-sm text-muted-foreground">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</div>
                </div>
                <Link to={`/order-detail/${o.id || o._id}`} className="text-accent">Xem chi tiết</Link>
              </div>
            ))}
            {/* Pagination */}
            {showPagination && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">{`Trang ${clampedCurrentPage} / ${effectiveTotalPages} — ${totalItems} đơn hàng`}</div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" disabled={clampedCurrentPage === 1} onClick={() => goToPage(clampedCurrentPage - 1)}>
                    <span>Trước</span>
                  </Button>
                  {pageNumbers.map((pageNum, index) => {
                    if (typeof pageNum === 'string') return <span key={`${pageNum}-${index}`} className="px-2 text-sm text-muted-foreground">…</span>;
                    const isActive = pageNum === clampedCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        className={`px-3 py-1 rounded border transition-colors ${isActive ? 'bg-accent text-white border-accent' : 'bg-muted text-foreground border-border hover:bg-muted/70'}`}
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <Button variant="ghost" size="sm" disabled={clampedCurrentPage >= effectiveTotalPages} onClick={() => goToPage(clampedCurrentPage + 1)}>
                    <span>Sau</span>
                  </Button>
                  <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} className="border px-2 py-1 rounded">
                    {[5,10,20,50].map(n => <option key={n} value={n}>{n} / trang</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserOrders;
