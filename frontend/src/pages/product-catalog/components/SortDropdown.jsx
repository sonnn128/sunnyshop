import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortDropdown = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'relevance', label: 'Liên quan nhất', icon: 'Target' },
    { value: 'newest', label: 'Mới nhất', icon: 'Clock' },
    { value: 'price-low-high', label: 'Giá: Thấp đến cao', icon: 'ArrowUp' },
    { value: 'price-high-low', label: 'Giá: Cao đến thấp', icon: 'ArrowDown' },
    { value: 'popularity', label: 'Bán chạy nhất', icon: 'TrendingUp' },
    { value: 'discount', label: 'Giảm giá nhiều nhất', icon: 'Percent' }
  ];

  const currentSortOption = sortOptions?.find(option => option?.value === currentSort) || sortOptions?.[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 min-w-[200px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <Icon name={currentSortOption?.icon} size={16} />
          <span className="hidden sm:inline">{currentSortOption?.label}</span>
          <span className="sm:hidden">Sắp xếp</span>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground"
        />
      </Button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-popover border border-border rounded-lg shadow-elegant z-50 py-1">
          <div className="px-3 py-2 border-b border-border">
            <h4 className="text-sm font-medium text-foreground">Sắp xếp theo</h4>
          </div>
          
          {sortOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => handleSortSelect(option?.value)}
              className={`
                w-full text-left px-3 py-2 hover:bg-muted transition-smooth
                flex items-center space-x-3
                ${currentSort === option?.value ? 'bg-accent/10 text-accent' : 'text-foreground'}
              `}
            >
              <Icon 
                name={option?.icon} 
                size={16} 
                className={currentSort === option?.value ? 'text-accent' : 'text-muted-foreground'}
              />
              <span className="flex-1">{option?.label}</span>
              {currentSort === option?.value && (
                <Icon name="Check" size={16} className="text-accent" />
              )}
            </button>
          ))}

          <div className="px-3 py-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Tip: Sử dụng bộ lọc để tìm sản phẩm chính xác hơn
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;