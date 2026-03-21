import React, { useState, useEffect, memo } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { getBrands } from '@/lib/brandApi';
// memo is attached above with main React import

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, isOpen, onClose, categoryOptions = [], categoryTree = [], isDesktop = false }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: false,
    color: false,
    brand: false,
    material: false
  });
  const [brandOptions, setBrandOptions] = useState([]); // 3NF: Dynamic brands from API
  const [expandedCategories, setExpandedCategories] = useState(() => new Set());

  // 3NF: Fetch brands from API on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getBrands();
        if (!mounted) return;
        const brandList = res?.data || res || [];
        // Map to filter-friendly format and filter only active brands
        const activeBrands = Array.isArray(brandList) 
          ? brandList.filter(b => b.is_active !== false).map(b => ({
              _id: b._id,
              name: b.name,
              slug: b.slug
            }))
          : [];
        setBrandOptions(activeBrands);
      } catch (e) {
        console.error('Failed to load brands for filter:', e);
        setBrandOptions([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId); else next.add(categoryId);
      return next;
    });
  };

  const expandCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (!next.has(categoryId)) next.add(categoryId);
      return next;
    });
  };

  const getAllDescendantIds = (node) => {
    if (!node) return [];
    const nodeId = node.id || node.value || node.normalizedId;
    let ids = nodeId ? [String(nodeId)] : [];
    (node.children || []).forEach(child => {
      ids = ids.concat(getAllDescendantIds(child));
    });
    return ids;
  };

  const isNodeChecked = (node) => {
    const ids = getAllDescendantIds(node);
    if (ids.length === 0) return false;
    return ids.every(id => filters?.category?.includes(id));
  };

  const isNodeIndeterminate = (node) => {
    const ids = getAllDescendantIds(node);
    if (ids.length === 0) return false;
    const selectedCount = ids.filter(id => filters?.category?.includes(id)).length;
    return selectedCount > 0 && selectedCount < ids.length;
  };

  const toggleNodeSelection = (node, checked) => {
    const ids = getAllDescendantIds(node);
    ids.forEach(id => {
      onFilterChange('category', id, checked);
    });
    if (checked) {
      const nodeId = String(node?.id || node?.value || node?.normalizedId || '');
      expandCategory(nodeId);
    }
  };

  const handleFilterChange = (filterType, value, checked) => {
    onFilterChange(filterType, value, checked);
  };

  const getFilterValueLabel = (filterType, value) => {
    if (filterType === 'category') {
      const matchedCategory = categoryOptions?.find(option => option?.value === value);
      return matchedCategory?.label || value;
    }
    return value;
  };

  const priceRanges = [
    { label: 'Dưới 500.000 VND', value: '0-500000' },
    { label: '500.000 - 1.000.000 VND', value: '500000-1000000' },
    { label: '1.000.000 - 2.000.000 VND', value: '1000000-2000000' },
    { label: '2.000.000 - 5.000.000 VND', value: '2000000-5000000' },
    { label: 'Trên 5.000.000 VND', value: '5000000-999999999' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Đen', value: 'black', color: '#000000' },
    { name: 'Trắng', value: 'white', color: '#FFFFFF' },
    { name: 'Xám', value: 'gray', color: '#6B7280' },
    { name: 'Xanh navy', value: 'navy', color: '#1E3A8A' },
    { name: 'Đỏ', value: 'red', color: '#DC2626' },
    { name: 'Hồng', value: 'pink', color: '#EC4899' }
  ];

  // Fallback brands if API fails (legacy support)
  const fallbackBrands = ['Zara', 'H&M', 'Uniqlo', 'Nike', 'Adidas', 'Local Brand'];
  const materials = ['Cotton', 'Polyester', 'Denim', 'Silk', 'Wool', 'Linen'];

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-slate-200 py-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left bg-transparent hover:opacity-70 transition-opacity"
      >
        <span className="font-serif text-sm uppercase tracking-widest text-slate-900 font-bold">
          {title}
        </span>
        <Icon 
          name={expandedSections?.[sectionKey] ? "Minus" : "Plus"} 
          size={18} 
          className="text-slate-600 font-bold"
        />
      </button>
      {expandedSections?.[sectionKey] && (
        <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        ${isDesktop ? 'static' : 'fixed lg:sticky'} top-0 left-0 
        ${isDesktop ? 'h-auto' : 'h-full lg:h-auto'} 
        ${isDesktop ? 'w-full' : 'w-80 lg:w-full'}
        bg-background border-r lg:border-r-0 border-border
        transform transition-transform duration-300 
        ${isDesktop ? 'z-auto' : 'z-50 lg:z-auto'}
        ${!isDesktop && isOpen ? 'translate-x-0' : !isDesktop ? '-translate-x-full lg:translate-x-0' : ''}
        overflow-y-auto
      `}>
        <div className="p-4 lg:pr-8 lg:pl-0 lg:pt-0 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <h3 className="text-sm font-serif font-bold uppercase tracking-widest text-slate-900">
              BỘ LỌC
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClearFilters}
                className="text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
              >
                Xóa tất cả
              </button>
              <button
                onClick={onClose}
                className="lg:hidden text-slate-400 hover:text-slate-900 ml-4"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {Object.values(filters)?.some(filterArray => filterArray?.length > 0) && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-2">Bộ lọc đang áp dụng:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters)?.map(([filterType, values]) =>
                  values?.map(value => (
                    <span
                      key={`${filterType}-${value}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                    >
                      {getFilterValueLabel(filterType, value)}
                      <button
                        onClick={() => handleFilterChange(filterType, value, false)}
                        className="hover:text-accent/80"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <FilterSection title="Danh mục" sectionKey="category">
            {/* Prefer nested categoryTree if provided */}
            {Array.isArray(categoryTree) && categoryTree.length > 0 ? (
              categoryTree.map((node) => (
                <CategoryTreeNode
                  key={node?.id || node?.value}
                  node={node}
                  depth={node?.depth || 0}
                  filters={filters}
                  toggleCategory={toggleCategory}
                  expandCategory={expandCategory}
                  expandedSet={expandedCategories}
                  isNodeChecked={isNodeChecked}
                  isNodeIndeterminate={isNodeIndeterminate}
                  toggleNodeSelection={toggleNodeSelection}
                />
              ))
            ) : (
              categoryOptions?.map(category => (
                <div
                  key={category?.value}
                  className="flex items-start"
                  style={{ marginLeft: `${(category?.depth || 0) * 12}px` }}
                >
                  <Checkbox
                    size="lg"
                    label={`${category?.label}${typeof category?.count === 'number' ? ` (${category?.count})` : ''}`}
                    checked={filters?.category?.includes(category?.value)}
                    onChange={(e) => handleFilterChange('category', category?.value, e?.target?.checked)}
                  />
                </div>
              ))
            )}
          </FilterSection>

          {/* Price Filter */}
          <FilterSection title="Khoảng giá" sectionKey="price">
            {priceRanges?.map(range => (
              <Checkbox
                key={range?.value}
                size="lg"
                label={range?.label}
                checked={filters?.price?.includes(range?.value)}
                onChange={(e) => handleFilterChange('price', range?.value, e?.target?.checked)}
              />
            ))}
          </FilterSection>

          {/* Size Filter */}
          <FilterSection title="Kích thước" sectionKey="size">
            <div className="flex flex-wrap gap-3">
              {sizes?.map(size => (
                <button
                  key={size}
                  onClick={() => handleFilterChange('size', size, !filters?.size?.includes(size))}
                  className={`
                    w-14 h-12 flex items-center justify-center text-sm font-bold uppercase rounded-md border-2 transition-all duration-200
                    ${filters?.size?.includes(size)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-800 border-slate-300 hover:border-slate-500 hover:bg-slate-100'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Color Filter */}
          <FilterSection title="Màu sắc" sectionKey="color">
            <div className="flex flex-wrap gap-4">
              {colors?.map(color => (
                <button
                  key={color?.value}
                  onClick={() => handleFilterChange('color', color?.value, !filters?.color?.includes(color?.value))}
                  className={`
                    relative w-11 h-11 rounded-full border-2 transition-all duration-200 flex-shrink-0
                    ${filters?.color?.includes(color?.value)
                      ? 'border-slate-900 ring-2 ring-offset-2 ring-slate-900 scale-110'
                      : 'border-slate-300 hover:border-slate-500 hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color?.color }}
                  title={color?.name}
                />
              ))}
            </div>
          </FilterSection>

          {/* Brand Filter - 3NF: Dynamic from Brand collection */}
          <FilterSection title="Thương hiệu" sectionKey="brand">
            {(brandOptions.length > 0 ? brandOptions : fallbackBrands.map(b => ({ _id: b, name: b }))).map(brand => (
              <Checkbox
                size="lg"
                key={brand._id || brand}
                label={brand.name || brand}
                checked={filters?.brand?.includes(brand._id || brand.name || brand)}
                onChange={(e) => handleFilterChange('brand', brand._id || brand.name || brand, e?.target?.checked)}
              />
            ))}
          </FilterSection>

          {/* Material Filter */}
          <FilterSection title="Chất liệu" sectionKey="material">
            {materials?.map(material => (
              <Checkbox
                size="lg"
                key={material}
                label={material}
                checked={filters?.material?.includes(material)}
                onChange={(e) => handleFilterChange('material', material, e?.target?.checked)}
              />
            ))}
          </FilterSection>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;

// Recursive tree node component
const CategoryTreeNode = memo(({ node, depth = 0, filters, expandedSet, toggleCategory, expandCategory, isNodeChecked, isNodeIndeterminate, toggleNodeSelection }) => {
  const nodeId = String(node?.id || node?.value || node?.normalizedId || '');
  const hasChildren = Array.isArray(node?.children) && node.children.length > 0;
  const checked = isNodeChecked(node);
  const indeterminate = isNodeIndeterminate(node);
  const expanded = expandedSet?.has(nodeId);
  return (
    <div className="mb-2" style={{ marginLeft: `${depth * 12}px` }}>
      <div className="flex items-center gap-2">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => toggleCategory(nodeId)}
            className="p-1 rounded hover:bg-muted/20"
            aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
          >
            <Icon name={expanded ? 'ChevronDown' : 'ChevronRight'} size={12} />
          </button>
        ) : (
          <div className="w-3" />
        )}
        <Checkbox
          size="lg"
          checked={checked}
          indeterminate={indeterminate}
          onChange={(e) => { toggleNodeSelection(node, e?.target?.checked); if (e?.target?.checked) expandCategory(nodeId); }}
          label={`${node?.name || node?.label || node?.displayLabel || node?.title}${typeof node?.totalCount === 'number' ? ` (${node.totalCount})` : ''}`}
        />
      </div>
      {hasChildren && expanded && (
        <div className="mt-1">
          {node.children.map(child => (
            <CategoryTreeNode
              key={String(child?.id || child?.value || child?.normalizedId || Math.random())}
              node={child}
              depth={depth + 1}
              filters={filters}
              expandedSet={expandedSet}
              toggleCategory={toggleCategory}
              isNodeChecked={isNodeChecked}
              isNodeIndeterminate={isNodeIndeterminate}
              toggleNodeSelection={toggleNodeSelection}
            />
          ))}
        </div>
      )}
    </div>
  );
});