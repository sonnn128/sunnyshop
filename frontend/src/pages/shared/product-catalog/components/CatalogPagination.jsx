import React from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const CatalogPagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  startItem, 
  endItem,
  onPageChange 
}) => {
  const pageNumbers = (() => {
    const showPagination = totalPages > 1;
    if (!showPagination) return [1];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const pages = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) pages.push('left-ellipsis');
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    if (end < totalPages - 1) pages.push('right-ellipsis');
    pages.push(totalPages);
    return pages;
  })();

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <p className="text-sm text-muted-foreground">
        Hiển thị {startItem}-{endItem} trong tổng số {totalItems} sản phẩm
      </p>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          
          {pageNumbers.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <span key={`${page}-${index}`} className="px-2 text-sm text-muted-foreground">
                  …
                </span>
              );
            }
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                className={`px-3 py-1 rounded border transition-colors ${
                  isActive
                    ? 'bg-accent text-white border-accent'
                    : 'bg-muted text-foreground border-border hover:bg-muted/70'
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            );
          })}
          
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      )}

      {currentPage === totalPages && totalItems > 0 && (
        <div className="text-center text-muted-foreground mt-4 mb-8 text-sm">
          Đã xem hết danh sách sản phẩm
        </div>
      )}
    </div>
  );
};

export default CatalogPagination;
