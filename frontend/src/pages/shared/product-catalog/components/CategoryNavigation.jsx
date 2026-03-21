import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DEFAULT_CATEGORY = { id: 'all', name: 'Tất cả', icon: 'Grid3X3', count: 0 };
const MAX_VISIBLE = 6;

const CategoryNavigation = ({ activeCategory, onCategoryChange, categories = [], categoryTree = [] }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState(() => new Set());

  const normalizedCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    return [DEFAULT_CATEGORY];
  }, [categories]);

  const displayCategories = showAllCategories
    ? normalizedCategories
    : normalizedCategories.slice(0, MAX_VISIBLE);

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
  };

  const activePathIds = useMemo(() => {
    if (!Array.isArray(categoryTree) || categoryTree.length === 0) return [];
    if (!activeCategory || activeCategory === 'all') return [];

    const findPath = (nodes, targetId, trail = []) => {
      for (const node of nodes) {
        if (!node) continue;
        const nodeId = node.id || node.normalizedId;
        if (!nodeId) continue;
        const nextTrail = [...trail, nodeId];
        if (nodeId === targetId) {
          return nextTrail;
        }
        if (node.children?.length) {
          const childPath = findPath(node.children, targetId, nextTrail);
          if (childPath.length) return childPath;
        }
      }
      return [];
    };

    return findPath(categoryTree, activeCategory);
  }, [categoryTree, activeCategory]);

  useEffect(() => {
    if (!Array.isArray(categoryTree) || categoryTree.length === 0) return;
    setExpandedNodes((prev) => {
      if (prev.size > 0) return prev;
      const initial = new Set();
      categoryTree.forEach((node) => {
        const nodeId = node?.id || node?.normalizedId;
        if (nodeId) {
          initial.add(nodeId);
        }
      });
      return initial;
    });
  }, [categoryTree]);

  useEffect(() => {
    if (!activePathIds?.length) return;
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      activePathIds.forEach((id) => next.add(id));
      return next;
    });
  }, [activePathIds]);

  const toggleNode = (nodeId) => {
    if (!nodeId) return;
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderTree = (nodes = []) => {
    return nodes.map((node) => {
      if (!node) return null;
      const nodeId = node.id || node.normalizedId;
      if (!nodeId) return null;
      const hasChildren = Array.isArray(node.children) && node.children.length > 0;
      const isExpanded = expandedNodes.has(nodeId);
      const isActive = activeCategory === nodeId;
      const isAncestor = !isActive && activePathIds.includes(nodeId);
      const label = node.name || node.title || node.displayLabel || 'Danh mục';
      const totalCount = typeof node.totalCount === 'number'
        ? node.totalCount
        : (typeof node.count === 'number' ? node.count : 0);

      return (
        <div key={nodeId} className="space-y-1">
          <div className="flex items-center">
            {hasChildren ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleNode(nodeId);
                }}
                className="mr-2 p-1 rounded-full hover:bg-background/60 text-muted-foreground"
                aria-label={isExpanded ? 'Thu gọn danh mục' : 'Mở rộng danh mục'}
              >
                <Icon name={isExpanded ? 'ChevronDown' : 'ChevronRight'} size={14} />
              </button>
            ) : (
              <span className="w-4 mr-2" />
            )}
            <button
              type="button"
              onClick={() => handleCategoryClick(nodeId)}
              className={`flex-1 flex items-center justify-between text-sm rounded-lg px-2 py-1 transition-smooth ${
                isActive
                  ? 'bg-accent text-accent-foreground font-semibold shadow-sm'
                  : isAncestor
                    ? 'bg-muted/40 text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <span className="truncate">{label}</span>
              <span className="text-xs ml-2 opacity-80">{totalCount}</span>
            </button>
          </div>
          {hasChildren && isExpanded && (
            <div className="pl-5 border-l border-border/50 ml-4">
              {renderTree(node.children)}
            </div>
          )}
        </div>
      );
    });
  };

  const getActiveCategory = () => {
    return normalizedCategories?.find(cat => cat?.id === activeCategory) || normalizedCategories?.[0] || DEFAULT_CATEGORY;
  };

  const hasCategoryTree = Array.isArray(categoryTree) && categoryTree.length > 0;

  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="bg-muted/20 border border-border rounded-2xl p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-foreground">
                <Icon name="Layers" size={18} />
                <span className="font-semibold">Danh mục sản phẩm</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategoryClick('all')}
                className="text-xs"
              >
                Tất cả
              </Button>
            </div>
            <div className="max-h-[360px] overflow-y-auto pr-1 space-y-1">
              {hasCategoryTree ? (
                renderTree(categoryTree)
              ) : (
                <p className="text-sm text-muted-foreground">Chưa có danh mục nào</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Main Category Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
                {displayCategories?.map((category) => (
                  <Button
                    key={category?.id}
                    variant={activeCategory === category?.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleCategoryClick(category?.id)}
                    className="flex items-center space-x-2 whitespace-nowrap"
                  >
                    <Icon name={category?.icon || 'Tag'} size={16} />
                    <span>{category?.name}</span>
                    <span className="text-xs opacity-75">({category?.count})</span>
                  </Button>
                ))}
              </div>

              {normalizedCategories?.length > MAX_VISIBLE && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="flex items-center space-x-1 ml-4"
                >
                  <span className="hidden sm:inline">
                    {showAllCategories ? 'Thu gọn' : 'Xem thêm'}
                  </span>
                  <Icon name={showAllCategories ? 'ChevronUp' : 'ChevronDown'} size={16} />
                </Button>
              )}
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategoryClick('all')}
                className="text-muted-foreground hover:text-accent p-0 h-auto"
              >
                Trang chủ
              </Button>
              <Icon name="ChevronRight" size={14} />
              <span className="text-foreground font-medium">
                {getActiveCategory()?.name}
              </span>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-foreground">Lọc nhanh:</span>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Icon name="Zap" size={14} className="mr-1" />
                    Giảm giá
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Icon name="Star" size={14} className="mr-1" />
                    Đánh giá cao
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Icon name="Clock" size={14} className="mr-1" />
                    Mới nhất
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Icon name="TrendingUp" size={14} className="mr-1" />
                    Bán chạy
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Package" size={16} />
                <span>
                  {getActiveCategory()?.count || 0} sản phẩm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;