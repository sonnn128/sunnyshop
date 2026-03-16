import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';
import SortDropdown from './components/SortDropdown';
import ProductGrid from './components/ProductGrid';
import { resolveQuickVariantSelection, summarizeVariantOptions } from '../../lib/productVariants';
import QuickViewModal from './components/QuickViewModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import cart from '../../lib/cart';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';
import { useWishlist } from '../../contexts/WishlistContext';
import { formatCategoriesWithHierarchy, buildCategoryTree, normalizeCategoryId } from '../../utils/categoryTree';

const ProductCatalog = () => {
  const toast = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategoryParam = searchParams?.get('category');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [itemsPerPage, setItemsPerPage] = useState(12); // default for grid
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: initialCategoryParam ? [initialCategoryParam] : [],
    price: [],
    size: [],
    color: [],
    brand: [],
    material: []
  });
  const [categories, setCategories] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);

  const normalizeImageList = (input) => {
    if (!Array.isArray(input)) return [];
    return input
      .map((img) => {
        if (!img) return null;
        if (typeof img === 'string') return img;
        return img.image_url || img.imageUrl || img.url || null;
      })
      .filter(Boolean);
  };

  const resolvePrimaryImage = (product, normalizedImages = []) => {
    if (!product) return null;
    const direct = product.primaryImage?.image_url
      || product.primaryImage?.url
      || (typeof product.primaryImage === 'string' ? product.primaryImage : null);
    if (direct) return direct;
    if (normalizedImages.length > 0) return normalizedImages[0];
    return product.image || product.coverImage || null;
  };

  // Initialize products and categories from backend
  useEffect(() => {
    let mounted = true;
    const initializeCatalog = async () => {
      setLoading(true);
      try {
        const [productResult, categoryResult] = await Promise.allSettled([
          API.get('/api/products?status=active&limit=200'),
          API.get('/api/categories')
        ]);

        if (productResult.status !== 'fulfilled') {
          throw productResult.reason || new Error('Failed to load products');
        }

        const productRes = productResult.value;
        const categoryRes = categoryResult.status === 'fulfilled' ? categoryResult.value : null;

        const items = productRes?.data?.products || productRes?.data || [];
        const rawCategories = categoryRes
          ? (categoryRes?.data?.categories || categoryRes?.data?.data || categoryRes?.data || [])
          : [];

        // Map server product shape to frontend-friendly product object
        const mapped = (items || []).map((p, idx) => {
          const { sizes = [], colors = [] } = summarizeVariantOptions(p) || {};
          const fallbackSizes = sizes.length
            ? sizes
            : Array.isArray(p?.availableSizes)
              ? p.availableSizes
              : Array.isArray(p?.sizes)
                ? p.sizes
                : [];
          const fallbackColors = colors.length
            ? colors
            : Array.isArray(p?.availableColors)
              ? p.availableColors
              : Array.isArray(p?.colors)
                ? p.colors
                : [];

          const normalizedImages = normalizeImageList(p?.images);
          const primaryImage = resolvePrimaryImage(p, normalizedImages);
          const soldCount = Number(p?.soldCount ?? p?.sold_count ?? 0) || 0;

          const primaryCategory = Array.isArray(p?.categories) ? p.categories[0] : p.categories;
          const rawCategoryId = p?.category_id
            || (typeof primaryCategory === 'object'
              ? (primaryCategory?._id || primaryCategory?.id || primaryCategory?.slug || primaryCategory?.value)
              : primaryCategory)
            || p?.category
            || null;
          const normalizedCategory = rawCategoryId ? normalizeCategoryId(rawCategoryId) : 'uncategorized';
          const normalizedCategoryName = p?.category_name
            || (typeof primaryCategory === 'object' ? (primaryCategory?.name || primaryCategory?.title) : null)
            || null;

          return {
            id: p._id || p.id || String(idx),
            name: p.name,
            description: p.description || p.short_description || '',
            images: normalizedImages,
            primaryImage,
            price: p.price || p.salePrice || p.original_price || 0,
            originalPrice: p.original_price || p.originalPrice || null,
            brand: p.brand || p.vendor || null,
            category: normalizedCategory,
            categoryName: normalizedCategoryName,
            stock: p.stock_quantity || p.stock || 0,
            soldCount,
            availableSizes: fallbackSizes,
            availableColors: fallbackColors,
            variants: p.variants || []
          };
        });

        const formattedCategories = formatCategoriesWithHierarchy(rawCategories);
        const nestedCategories = buildCategoryTree(rawCategories);
        const normalizedCategories = Array.isArray(formattedCategories)
          ? formattedCategories
              .map(cat => {
                const id = cat?.normalizedId
                  || cat?._id
                  || cat?.id
                  || cat?.slug
                  || cat?.code
                  || cat?.value;
                const fallbackName = cat?.name || cat?.title || 'Danh mục';
                return {
                  ...cat,
                  id: id ? String(id) : fallbackName,
                  name: fallbackName,
                  icon: cat?.icon || 'Tag'
                };
              })
              .filter(cat => cat?.id)
          : [];

        if (!mounted) return;

        // Create lookup maps from normalizedCategories so we can convert
        // product category names (legacy) to category IDs used by the tree
        const categoriesById = new Map();
        const categoriesByName = new Map();
        normalizedCategories.forEach((cat) => {
          const id = cat?.id;
          if (!id) return;
          categoriesById.set(String(id), cat);
          const nameKey = (cat?.name || cat?.displayLabel || cat?.indentedLabel || '')?.toString()?.toLowerCase();
          if (nameKey) categoriesByName.set(nameKey, String(id));
          const displayKey = (cat?.displayLabel || '')?.toString()?.toLowerCase();
          if (displayKey) categoriesByName.set(displayKey, String(id));
        });

        const remapped = mapped.map((prod) => {
          const catVal = prod?.category;
          // Already an ID we can find
          if (catVal && categoriesById.has(String(catVal))) return prod;
          // Try matching by name or display label
          const candidate = (catVal || prod?.categoryName || '')?.toString()?.toLowerCase();
          const idFromName = categoriesByName.get(candidate);
          if (idFromName) {
            return { ...prod, category: idFromName };
          }
          return prod;
        });

        setProducts(remapped);
        setCategories(normalizedCategories);
        setCategoryTree(nestedCategories);
      } catch (err) {
        if (!mounted) return;
        setProducts([]);
        setCategories([]);
        setCategoryTree([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeCatalog();
    return () => { mounted = false; };
  }, []);

  // Reset itemsPerPage when viewMode changes
  useEffect(() => {
    if (viewMode === 'grid' && ![8,12,16,20].includes(itemsPerPage)) setItemsPerPage(12);
    if (viewMode === 'list' && ![6,9,12,15,18].includes(itemsPerPage)) setItemsPerPage(9);
    setCurrentPage(1);
  }, [viewMode]);

  const pageOptionsGrid = [8, 12, 16, 20];
  const pageOptionsList = [6, 9, 12, 15, 18];
  const pageOptions = viewMode === 'grid' ? pageOptionsGrid : pageOptionsList;
  const totalItems = filteredProducts.length;
  const actualTotalPages = Math.ceil(totalItems / itemsPerPage);
  const totalPages = actualTotalPages || 1;
  const clampedCurrentPage = Math.min(currentPage, totalPages);
  const displayedProducts = filteredProducts.slice((clampedCurrentPage - 1) * itemsPerPage, clampedCurrentPage * itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (clampedCurrentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(startItem + itemsPerPage - 1, totalItems);
  const showPagination = actualTotalPages > 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageNumbers = (() => {
    if (!showPagination) return [1];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const pages = [1];
    const start = Math.max(2, clampedCurrentPage - 1);
    const end = Math.min(totalPages - 1, clampedCurrentPage + 1);
    if (start > 2) pages.push('left-ellipsis');
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    if (end < totalPages - 1) pages.push('right-ellipsis');
    pages.push(totalPages);
    return pages;
  })();

  const categoryCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      const key = normalizeCategoryId(product?.category) || (product?.category || 'uncategorized');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const categoryDescendantMap = useMemo(() => {
    const map = Object.create(null);

    const collect = (node) => {
      if (!node) return [];
      const nodeId = node.id || node.normalizedId;
      if (!nodeId) return [];
      const childIds = [];
      (node.children || []).forEach((child) => {
        const result = collect(child);
        if (Array.isArray(result) && result.length > 0) {
          childIds.push(...result);
        }
      });
      const allIds = [nodeId, ...childIds];
      map[nodeId] = new Set(allIds);
      return allIds;
    };

    (categoryTree || []).forEach((node) => collect(node));
    return map;
  }, [categoryTree]);

  const categoryTreeWithCounts = useMemo(() => {
    const applyCounts = (nodes = []) => {
      return nodes
        .map((node) => {
          if (!node) return null;
          const nodeId = node.id || node.normalizedId;
          const children = applyCounts(node.children || []);
          const childrenTotal = children.reduce((sum, child) => sum + (child?.totalCount || 0), 0);
          const selfCount = nodeId ? (categoryCounts[nodeId] || 0) : 0;
          return {
            ...node,
            children,
            productCount: selfCount,
            totalCount: selfCount + childrenTotal,
          };
        })
        .filter(Boolean);
    };

    return applyCounts(categoryTree);
  }, [categoryTree, categoryCounts]);

  useEffect(() => {
    try {
      const summary = [];
      const walk = (nodes = []) => {
        (nodes || []).forEach(n => {
          if (!n) return;
          summary.push({ id: n.id, name: n.name, total: n.totalCount || 0, self: n.productCount || 0 });
          if (n.children?.length) walk(n.children);
        });
      };
      walk(categoryTreeWithCounts || []);
      // eslint-disable-next-line no-console
      console.debug('[Catalog Debug] categoryTreeWithCounts summary:', summary.slice(0, 40));
    } catch (e) {
      // ignore
    }
  }, [categoryTreeWithCounts]);

  const filterCategoryOptions = useMemo(() => {
    const buildFromTree = (nodes = []) => {
      const entries = [];
      nodes.forEach((node) => {
        if (!node) return;
        const nodeId = node.id || node.normalizedId;
        if (!nodeId) return;
        entries.push({
          value: nodeId,
          label: node.indentedLabel || node.displayLabel || node.name,
          count: node.totalCount ?? node.productCount ?? 0,
          depth: node.depth ?? 0,
        });
        if (node.children?.length) {
          entries.push(...buildFromTree(node.children));
        }
      });
      return entries;
    };

    const treeOptions = buildFromTree(categoryTreeWithCounts);
    if (treeOptions.length) {
      return treeOptions;
    }

    return (categories || [])
      .filter(cat => cat?.id)
      .map(cat => ({
        value: cat.id,
        label: cat.indentedLabel || cat.displayLabel || cat.name,
        count: categoryCounts[cat.id] || 0,
        depth: cat.depth ?? 0
      }));
  }, [categoryTreeWithCounts, categories, categoryCounts]);

  useEffect(() => {
    const nextCategory = filters?.category?.[0] || '';
    const currentParam = searchParams?.get('category') || '';
    if (currentParam === nextCategory) return;
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (nextCategory) {
        next.set('category', nextCategory);
      } else {
        next.delete('category');
      }
      return next;
    });
  }, [filters.category, searchParams, setSearchParams]);

  // Filter and sort products (uses derived category helpers defined above)
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      const normalizedQuery = searchQuery?.toLowerCase();
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(normalizedQuery) ||
        product?.brand?.toLowerCase()?.includes(normalizedQuery) ||
        product?.categoryName?.toLowerCase()?.includes(normalizedQuery)
      );
    }

    const expandedCategoryFilterSet = new Set();
    if (Array.isArray(filters?.category) && filters.category.length > 0) {
      filters.category.forEach((value) => {
        if (!value) return;
        const descendantSet = categoryDescendantMap?.[value];
        if (descendantSet instanceof Set) {
          descendantSet.forEach((id) => expandedCategoryFilterSet.add(id));
        } else {
          expandedCategoryFilterSet.add(value);
        }
      });
    }

    Object.entries(filters)?.forEach(([filterType, values]) => {
      if (values?.length > 0) {
        filtered = filtered?.filter(product => {
          switch (filterType) {
            case 'category':
              return expandedCategoryFilterSet.size > 0
                ? expandedCategoryFilterSet.has(product?.category)
                : values?.includes(product?.category);
            case 'price':
              return values?.some(range => {
                const [min, max] = range?.split('-')?.map(Number);
                return product?.price >= min && product?.price <= max;
              });
            case 'size':
              return product?.availableSizes?.some(size => values?.includes(size));
            case 'color':
              return product?.availableColors?.some(color => values?.includes(color?.value));
            case 'brand':
              return values?.includes(product?.brand);
            case 'material':
              return values?.includes(product?.material);
            default:
              return true;
          }
        });
      }
    });

    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a?.price - b?.price;
        case 'price-high-low':
          return b?.price - a?.price;
        case 'newest':
          return b?.id - a?.id;
        case 'popularity':
          return (b?.soldCount || 0) - (a?.soldCount || 0);
        case 'discount':
          const aDiscount = a?.originalPrice ? ((a?.originalPrice - a?.price) / a?.originalPrice) : 0;
          const bDiscount = b?.originalPrice ? ((b?.originalPrice - b?.price) / b?.originalPrice) : 0;
          return bDiscount - aDiscount;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    // eslint-disable-next-line no-console
    console.debug('[Catalog Debug] applied filters', { filters, filteredLength: filtered.length });
    setCurrentPage(1);
  }, [products, searchQuery, filters, sortBy, categoryDescendantMap]);

  // Developer debug: print category mappings when products, categories or mapping changes
  useEffect(() => {
    try {
      const mapKeys = Object.keys(categoryDescendantMap || {});
      const productCats = Array.from(new Set(products.map(p => p?.category))).slice(0, 20);
      // eslint-disable-next-line no-console
      console.debug('[Catalog Debug] Category map keys:', mapKeys);
      // eslint-disable-next-line no-console
      console.debug('[Catalog Debug] Product categories:', productCats);
      // eslint-disable-next-line no-console
      console.debug('[Catalog Debug] Available categories:', (categories || []).slice(0, 10).map(c => ({ id: c.id, name: c.name })));
    } catch (e) {
      // ignore
    }
  }, [products, categories, categoryDescendantMap]);

  useEffect(() => {
    // Developer check for provided category id from the user's example
    try {
      const target = '692ad68f72581bf2eb2c7c2d';
      const count = products.filter(p => String(p?.category) === target).length;
      // eslint-disable-next-line no-console
      console.debug('[Catalog Debug] products with category', target, count);
    } catch (e) {
      // ignore
    }
  }, [products]);

  const goToPage = (page) => {
    const nextPage = Math.min(totalPages, Math.max(1, page));
    setCurrentPage(nextPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchParams(prev => {
      if (query) {
        prev?.set('q', query);
      } else {
        prev?.delete('q');
      }
      return prev;
    });
  };

  // Handle filter change
  const handleFilterChange = (filterType, value, checked) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked
        ? Array.from(new Set([...(prev?.[filterType] || []), value]))
        : prev?.[filterType]?.filter(item => item !== value)
    }));
    // eslint-disable-next-line no-console
    console.debug('[Catalog Debug] filter change', filterType, value, checked);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      category: [],
      price: [],
      size: [],
      color: [],
      brand: [],
      material: []
    });
    setSearchQuery('');
    setSearchParams({});
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (productId) => {
    const product = products.find(p => p?.id === productId || p?._id === productId);
    if (!product) {
      console.error('[Wishlist] Product not found:', productId);
      return;
    }

    // Use _id if available, otherwise use id
    const finalProductId = product?._id || product?.id;

    try {
      // Use wishlist context to toggle
      const wasAdded = await toggleWishlist(finalProductId, {
        name: product?.name,
        brand: product?.brand,
        image: product?.primaryImage || product?.images?.[0] || product?.image,
        price: product?.price || product?.salePrice,
        originalPrice: product?.originalPrice,
        category: product?.category
      });

      // Show toast
      if (wasAdded) {
        toast.push({
          title: 'Đã thêm vào yêu thích!',
          message: `"${product?.name}" đã được thêm vào danh sách yêu thích`,
          type: 'success'
        });
      } else {
        toast.push({
          title: 'Đã xóa',
          message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
          type: 'info'
        });
      }
    } catch (e) {
      console.error('[Wishlist Error]', e.response?.data || e.message);
      toast.push({
        title: 'Lỗi!',
        message: e.response?.data?.message || 'Không thể cập nhật danh sách yêu thích',
        type: 'error'
      });
    }
  };

  // Handle quick view
  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    try {
      const selection = await resolveQuickVariantSelection(product);
      const qty = product?.quantity || 1;
      const productId = product?._id || product?.id || selection.productId;

      await cart.addItem({
        productId,
        name: product.name,
        price: selection.price || product.price || product.salePrice,
        quantity: qty,
        image: product.primaryImage || (product.images && product.images[0]),
        selectedSize: selection.selectedSize,
        selectedColor: selection.selectedColor,
        variant_id: selection.variantId
      });
      toast.push({
        title: 'Thành công!',
        message: `Đã thêm "${product.name}" vào giỏ hàng`,
        type: 'success'
      });
    } catch (e) {
      console.error('Failed to add to cart', e);
      toast.push({
        title: 'Lỗi!',
        message: 'Không thể thêm sản phẩm vào giỏ hàng',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Search Section */}
        <div className="bg-muted/30 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Khám phá thời trang
              </h1>
              <p className="text-muted-foreground">
                Tìm kiếm và khám phá hàng nghìn sản phẩm thời trang chất lượng cao
              </p>
            </div>
            
            <SearchBar
              onSearch={handleSearch}
              onVoiceSearch={() => {}} // Add missing required prop
              suggestions={['áo sơ mi', 'váy midi', 'quần jeans', 'giày sneaker']}
              isLoading={loading}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Filter Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isOpen={false}
                onClose={() => {}}
                categoryOptions={filterCategoryOptions}
                categoryTree={categoryTreeWithCounts}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden"
                  >
                    <Icon name="Filter" size={16} className="mr-2" />
                    Bộ lọc
                  </Button>

                  <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Package" size={16} />
                    <span>{totalItems} sản phẩm</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center space-x-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => { setViewMode('grid'); setItemsPerPage(12); setCurrentPage(1); }}
                      className="w-8 h-8"
                    >
                      <Icon name="Grid3X3" size={16} />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => { setViewMode('list'); setItemsPerPage(9); setCurrentPage(1); }}
                      className="w-8 h-8"
                    >
                      <Icon name="List" size={16} />
                    </Button>
                  </div>

                  {/* Sort Dropdown */}
                  <SortDropdown
                    currentSort={sortBy}
                    onSortChange={setSortBy}
                  />

                  {/* Items per page dropdown */}
                  <select
                    className="border rounded px-2 py-1 text-sm bg-background text-foreground"
                    value={itemsPerPage}
                    onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  >
                    {pageOptions.map(opt => (
                      <option key={opt} value={opt}>{opt} / trang</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <ProductGrid
                products={displayedProducts}
                loading={loading}
                onWishlistToggle={handleWishlistToggle}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
                viewMode={viewMode}
              />

              {/* Pagination & End Message */}
              {totalItems > 0 && (
                <div className="flex flex-col items-center gap-4 mt-8">
                  <p className="text-sm text-muted-foreground">
                    Hiển thị {startItem}-{endItem} trong tổng số {totalItems} sản phẩm
                  </p>
                  {showPagination && (
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={clampedCurrentPage === 1}
                        onClick={() => goToPage(clampedCurrentPage - 1)}
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
                        const isActive = page === clampedCurrentPage;
                        return (
                          <button
                            key={page}
                            className={`px-3 py-1 rounded border transition-colors ${
                              isActive
                                ? 'bg-accent text-white border-accent'
                                : 'bg-muted text-foreground border-border hover:bg-muted/70'
                            }`}
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={clampedCurrentPage === totalPages}
                        onClick={() => goToPage(clampedCurrentPage + 1)}
                      >
                        <Icon name="ChevronRight" size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {clampedCurrentPage === totalPages && totalItems > 0 && (
                <div className="text-center text-muted-foreground mt-4 mb-8 text-sm">
                  Đã xem hết danh sách sản phẩm
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Filter Sidebar */}
        <div className="lg:hidden">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            categoryOptions={filterCategoryOptions}
          />
        </div>
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onWishlistToggle={handleWishlistToggle}
      />
    </div>
  );
};

export default ProductCatalog;