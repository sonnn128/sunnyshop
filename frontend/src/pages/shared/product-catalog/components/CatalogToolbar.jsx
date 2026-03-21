import React from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import SortDropdown from './SortDropdown';

const CatalogToolbar = ({ 
  viewMode, 
  onViewModeChange, 
  sortBy, 
  onSortChange, 
  itemsPerPage, 
  onItemsPerPageChange,
  totalItems,
  onFilterToggle
}) => {
  const pageOptionsGrid = [8, 12, 16, 20];
  const pageOptionsList = [6, 9, 12, 15, 18];
  const pageOptions = viewMode === 'grid' ? pageOptionsGrid : pageOptionsList;

  return (
    <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Filter button + Product count */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterToggle}
              className="lg:hidden"
            >
              <Icon name="Filter" size={16} className="mr-2" />
              Lọc
            </Button>

            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Package" size={16} />
              <span>{totalItems} sản phẩm</span>
            </div>
          </div>

          {/* Right: View mode, sort, items per page */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="w-8 h-8"
              >
                <Icon name="Grid3X3" size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="w-8 h-8"
              >
                <Icon name="List" size={16} />
              </Button>
            </div>

            {/* Sort Dropdown */}
            <SortDropdown
              currentSort={sortBy}
              onSortChange={onSortChange}
            />

            {/* Items per page dropdown */}
            <select
              className="appearance-none border border-slate-200 rounded px-3 py-2 text-sm bg-white text-slate-900 cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              value={itemsPerPage}
              onChange={e => onItemsPerPageChange(Number(e.target.value))}
            >
              {pageOptions.map(opt => (
                <option key={opt} value={opt}>{opt} / trang</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogToolbar;
