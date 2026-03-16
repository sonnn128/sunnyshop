import React, { useEffect, useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { useToast } from '../../../components/ui/ToastProvider';
import { getTopSellingProducts } from '../../../lib/orderApi';

const TopProducts = () => {
  const toast = useToast();
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const products = await getTopSellingProducts(5);
        if (isSubscribed) {
          setTopProducts(Array.isArray(products) ? products : []);
        }
      } catch (error) {
        console.error('Error fetching top selling products:', error);
        if (isSubscribed) {
          setTopProducts([]);
          toast.push({
            title: 'Lỗi',
            message: 'Không thể tải danh sách sản phẩm bán chạy',
            type: 'error'
          });
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchTopProducts();

    return () => {
      isSubscribed = false;
    };
  }, [toast]);

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value || 0);
    } catch (error) {
      return `${value || 0}₫`;
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const placeholderImage = 'https://placehold.co/120x120?text=No+Image';

  return (
    <div className="bg-card border border-border rounded-lg shadow-elegant">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Sản phẩm bán chạy</h3>
          <button className="text-sm text-accent hover:text-accent/80 font-medium transition-smooth">
            Xem tất cả
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border border-border/40 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="w-12 h-12 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))
          ) : topProducts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Chưa có dữ liệu bán hàng
            </div>
          ) : (
            topProducts.map((product, index) => (
              <div key={product?.productId || index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-smooth">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-bold">
                  {index + 1}
                </div>

                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted/50">
                  <Image
                    src={product?.image || placeholderImage}
                    alt={product?.name || 'Sản phẩm'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-medium text-foreground truncate">{product?.name || 'Sản phẩm'}</h4>
                      <div className="text-xs text-muted-foreground truncate">
                        Lần bán gần nhất: {formatDate(product?.lastOrderedAt) || '—'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatCurrency(product?.totalRevenue)}</p>
                      <div className="flex items-center justify-end space-x-2 text-muted-foreground text-xs">
                        <span className="flex items-center gap-1">
                          <Icon name="ShoppingBag" size={12} />
                          {product?.totalSold || 0} bán
                        </span>
                        {typeof product?.stock_quantity === 'number' && (
                          <span className="flex items-center gap-1">
                            <Icon name="Package" size={12} />
                            Tồn: {product?.stock_quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;