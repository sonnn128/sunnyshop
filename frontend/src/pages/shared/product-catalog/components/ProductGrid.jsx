import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProductGrid = ({ 
  products, 
  loading, 
  hasMore, 
  onLoadMore, 
  onWishlistToggle, 
  onQuickView, 
  onAddToCart,
  viewMode = 'grid' 
}) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await onLoadMore();
    setLoadingMore(false);
  };

  // Auto-load more when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement?.scrollTop >=
        document.documentElement?.offsetHeight - 1000 &&
        hasMore &&
        !loading &&
        !loadingMore
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadingMore]);

  if (loading && products?.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)]?.map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[3/4] bg-muted rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products?.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn. 
          Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => window.location?.reload()}>
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Làm mới trang
          </Button>
          <Button variant="default" onClick={() => window.history?.back()}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <div className={`
        grid gap-6
        ${viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }
      `}>
        {products?.map((product) => (
          <ProductCard
            key={product?.id}
            product={product}
            onWishlistToggle={onWishlistToggle}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span>Đang tải thêm sản phẩm...</span>
          </div>
        </div>
      )}
      {/* Load More Button */}
      {hasMore && !loadingMore && (
        <div className="flex justify-center py-8">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <Icon name="Plus" size={16} className="mr-2" />
                Xem thêm sản phẩm
              </>
            )}
          </Button>
        </div>
      )}
      {/* End of Results */}
      {!hasMore && products?.length > 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
          <p className="text-muted-foreground">
            Bạn đã xem hết {products?.length} sản phẩm
          </p>
        </div>
      )}
      {/* Back to Top Button */}
      {products?.length > 12 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            variant="default"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <Icon name="ArrowUp" size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;