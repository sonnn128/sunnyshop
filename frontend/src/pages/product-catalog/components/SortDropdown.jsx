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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 border border-slate-200 hover:border-slate-900 transition-colors bg-white text-xs uppercase font-bold tracking-widest text-slate-900 min-w-[200px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <span>{currentSortOption?.label}</span>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={14} 
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-100 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Sắp xếp theo
            </h4>
          </div>
          
          <div className="py-2">
            {sortOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleSortSelect(option?.value)}
                className={`
                  w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors
                  flex items-center space-x-3 text-xs uppercase tracking-wide font-medium
                  ${currentSort === option?.value ? 'text-slate-900 bg-slate-50/50' : 'text-slate-500 hover:text-slate-900'}
                `}
              >
                <span className="flex-1">{option?.label}</span>
                {currentSort === option?.value && (
                  <Icon name="Check" size={14} className="text-slate-900" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;