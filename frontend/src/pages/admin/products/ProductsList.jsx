import React, { useEffect, useState } from 'react';
import API from '@/lib/api';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ProductForm from './ProductForm';
import { Package, Search, Grid3x3, List, Trash2, CheckSquare, Square } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const normalizeProduct = (product = {}) => {
  const normalizedId = product?._id ?? product?.id;
  return {
    ...product,
    _id: normalizedId,
    id: normalizedId,
    sku: product?.sku || '',
    images: Array.isArray(product?.images) ? product.images : []
  };
};

const ProductsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // For single delete
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false); // For bulk delete
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const toast = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products', { params: { limit: 200 } });
      const responseData = res?.data?.data ?? res?.data;
      const rawProducts = Array.isArray(responseData?.content)
        ? responseData.content
        : Array.isArray(responseData?.products)
          ? responseData.products
          : Array.isArray(res?.data?.products)
            ? res.data.products
            : Array.isArray(responseData)
              ? responseData
              : [];

      setItems(rawProducts.map(normalizeProduct));
      setCurrentPage(1);
      setSelectedIds([]);
    } catch (e) {
      toast.push({ title: 'Lỗi', message: 'Không tải được danh sách sản phẩm', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('create') === '1') {
      setIsCreateModalOpen(true);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]); // Clear selection on search/filter change
  }, [searchTerm]);

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/products/${deleteId}`);
      setItems(prev => prev.filter(p => p._id !== deleteId));
      setSelectedIds(prev => prev.filter(id => id !== deleteId));
      toast.push({ title: 'Đã xóa', message: 'Sản phẩm đã được xóa', type: 'success' });
    } catch (e) {
      toast.push({ title: 'Lỗi', message: 'Không thể xóa sản phẩm', type: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  // Bulk Selection Logic
  const handleSelectOne = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllPage = (pageItems) => {
    const pageIds = pageItems.map(p => p._id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      // Deselect all on this page
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      // Select all on this page
      const newSelected = new Set([...selectedIds, ...pageIds]);
      setSelectedIds(Array.from(newSelected));
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await API.delete('/products/batch', { data: { ids: selectedIds } });
      setItems(prev => prev.filter(p => !selectedIds.includes(p._id)));
      toast.push({ title: 'Đã xóa', message: `Đã xóa ${selectedIds.length} sản phẩm`, type: 'success' });
      setSelectedIds([]);
    } catch (e) {
      toast.push({ title: 'Lỗi', message: 'Không thể xóa các sản phẩm đã chọn', type: 'error' });
    } finally {
      setShowBulkDeleteConfirm(false);
    }
  };

  // Get primary image
  const getPrimaryImage = (product) => {
    if (!product.images || product.images.length === 0) return null;
    const first = product.images[0];
    if (typeof first === 'string') {
      const primaryString = product.images.find((img) => typeof img === 'string');
      return primaryString || null;
    }
    const primary = product.images.find(img => img.is_primary);
    const resolved = primary || first;
    return resolved?.image_url || resolved?.imageUrl || resolved?.url || null;
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price || 0);
  };

  // Filter products
  const filteredProducts = items.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredProducts.length;
  const actualTotalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const totalPages = actualTotalPages || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(startItem + ITEMS_PER_PAGE - 1, totalItems);
  const showPagination = actualTotalPages > 1;

  const pageNumbers = (() => {
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

  const goToPage = (page) => {
    const nextPage = Math.min(totalPages, Math.max(1, page));
    setCurrentPage(nextPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isPageSelected = paginatedProducts.length > 0 && paginatedProducts.every(p => selectedIds.includes(p._id));

  const handleCreateSuccess = async () => {
    setIsCreateModalOpen(false);
    await fetchProducts();
  };

  const handleEditSuccess = async () => {
    setEditProductId(null);
    await fetchProducts();
  };

  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-elegant">
      {/* Header */}
      <div className="mb-6 text-left">
        <div>
          <h2 className="text-2xl font-semibold flex items-center justify-start gap-2 text-left">
            <Package className="text-primary" />
            Quản lý sản phẩm
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tổng cộng {items.length} sản phẩm
            {searchTerm && (
              <span className="ml-2">
                • {totalItems} kết quả phù hợp
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search + Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 w-full md:max-w-2xl">
          {totalItems > 0 && (
            <div className="flex items-center mr-2">
              <button
                onClick={() => handleSelectAllPage(paginatedProducts)}
                className={`p-2 rounded-md hover:bg-muted ${isPageSelected ? 'text-primary' : 'text-muted-foreground'}`}
                title={isPageSelected ? "Bỏ chọn tất cả trang này" : "Chọn tất cả trang này"}
              >
                {isPageSelected ? <CheckSquare size={20} /> : <Square size={20} />}
              </button>
              <span className="text-sm text-muted-foreground hidden md:block">
                {isPageSelected ? 'Bỏ chọn' : 'Chọn tất cả'}
              </span>
            </div>
          )}

          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="flex items-center gap-2 animate-in fade-in zoom-in duration-200"
            >
              <Trash2 size={16} />
              Xóa {selectedIds.length} đã chọn
            </Button>
          )}
          <Button onClick={() => setIsCreateModalOpen(true)}>+ Thêm sản phẩm</Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 border rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-primary text-white border-primary' 
                : 'hover:bg-muted'
            }`}
            title="Xem dạng lưới"
          >
            <Grid3x3 size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 border rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-primary text-white border-primary' 
                : 'hover:bg-muted'
            }`}
            title="Xem dạng danh sách"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">Đang tải...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {totalItems === 0 && (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Thử tìm kiếm với từ khóa khác' 
                  : 'Bắt đầu bằng cách thêm sản phẩm đầu tiên'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  + Thêm sản phẩm
                </Button>
              )}
            </div>
          )}

          {/* Products Grid View */}
          {totalItems > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {paginatedProducts.map(p => {
                const primaryImage = getPrimaryImage(p);
                const hasDiscount = p.original_price && p.original_price > p.price;
                const discountPercent = hasDiscount 
                  ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                  : 0;
                const isSelected = selectedIds.includes(p._id);

                return (
                  <div 
                    key={p._id} 
                    className={`bg-background border rounded-lg overflow-hidden transition-all relative group ${isSelected ? 'ring-2 ring-primary border-primary' : 'hover:shadow-lg'}`}
                  >
                    {/* Checkbox Overlay */}
                    <div className="absolute top-2 left-2 z-10">
                        <button 
                            onClick={(e) => { e.preventDefault(); handleSelectOne(p._id); }}
                            className={`p-1 rounded-md bg-background/80 backdrop-blur-sm border shadow-sm transition-colors ${isSelected ? 'text-primary border-primary' : 'text-muted-foreground border-border hover:bg-muted'}`}
                        >
                            {isSelected ? <CheckSquare size={18} fill="currentColor" className="text-primary-foreground" /> : <Square size={18} />}
                        </button>
                    </div>

                    {/* Product Image */}
                    <div className="relative h-32 bg-muted">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={32} className="text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {hasDiscount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{discountPercent}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      {/* Name */}
                      <h3 className="font-semibold text-xs mb-1 line-clamp-1">
                        {p.name}
                      </h3>

                      {/* SKU */}
                      <p className="text-[10px] text-muted-foreground mb-1">
                        SKU: {p.sku}
                      </p>

                      {/* Price */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-primary">
                            {formatPrice(p.price)}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] text-muted-foreground line-through">
                              {formatPrice(p.original_price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock & Sales */}
                      <div className="grid grid-cols-2 gap-2 mb-2 text-[10px]">
                        <div className="bg-muted px-2 py-1 rounded">
                          <span className="text-muted-foreground">Tồn:</span>
                          <span className={`ml-1 font-semibold ${
                            p.stock_quantity <= 0 ? 'text-red-600' :
                            p.stock_quantity <= (p.min_stock_level || 5) ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {p.stock_quantity || 0}
                          </span>
                        </div>
                        <div className="bg-muted px-2 py-1 rounded">
                          <span className="text-muted-foreground">Bán:</span>
                          <span className="ml-1 font-semibold text-blue-600">
                            {p.sold_count || 0}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 flex-col">
                        <Button variant="secondary" size="xs" className="w-full text-xs" onClick={() => setDetailProduct(p)}>
                          Chi tiết
                        </Button>
                        <Button variant="outline" size="xs" className="w-full text-xs" onClick={() => setEditProductId(p._id)}>
                          Sửa
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="xs" 
                          onClick={() => handleDelete(p._id)}
                          className="w-full text-xs"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Products List View */}
          {totalItems > 0 && viewMode === 'list' && (
            <div className="space-y-3">
              <div className="hidden md:grid grid-cols-[32px_72px_1.6fr_1fr_0.8fr_0.8fr_0.8fr_1fr] gap-3 px-4 text-xs text-muted-foreground">
                <div />
                <div>Ảnh</div>
                <div>Tên / SKU</div>
                <div>Trạng thái</div>
                <div className="text-right">Giá</div>
                <div className="text-right">Tồn</div>
                <div className="text-right">Bán</div>
                <div className="text-right">Hành động</div>
              </div>
              {paginatedProducts.map(p => {
                const primaryImage = getPrimaryImage(p);
                const isSelected = selectedIds.includes(p._id);

                return (
                  <div 
                    key={p._id} 
                    className={`bg-background border rounded-lg p-4 transition-all relative group ${isSelected ? 'ring-1 ring-primary border-primary bg-primary/5' : 'hover:shadow-md'}`}
                  >
                    <div className="grid grid-cols-[32px_72px_1.6fr_1fr_0.8fr_0.8fr_0.8fr_1fr] gap-3 items-center">
                      <button 
                         onClick={(e) => { e.preventDefault(); handleSelectOne(p._id); }}
                         className={`p-1 rounded transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                      >
                         {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>

                      <div className="relative w-16 h-16 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm line-clamp-1">{p.name}</h3>
                          {p.is_featured && (
                            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200">
                              TOP
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                      </div>

                      <div>
                        <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded border ${
                          p.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                          p.status === 'out_of_stock' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {p.status === 'active' ? 'Active' : p.status === 'out_of_stock' ? 'Hết hàng' : 'Inactive'}
                        </span>
                      </div>

                      <div className="text-right text-sm font-semibold text-primary">
                        {formatPrice(p.price)}
                      </div>
                      <div className="text-right text-sm">
                        <span className={`${p.stock_quantity > 0 ? 'text-foreground' : 'text-red-600 font-bold'}`}>
                          {p.stock_quantity}
                        </span>
                      </div>
                      <div className="text-right text-sm">{p.sold_count || 0}</div>

                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setDetailProduct(p)}>
                          Chi tiết
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditProductId(p._id)}>
                          Sửa
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(p._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
              <p className="text-sm text-muted-foreground">
                Hiển thị {startItem}-{endItem} trong tổng số {totalItems} sản phẩm
              </p>
              {showPagination && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
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
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded-md text-sm border transition-colors ${
                          isActive
                            ? 'bg-primary text-white border-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Confirm Single Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Xóa sản phẩm?"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />

       {/* Confirm Bulk Delete Modal */}
       <ConfirmModal
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={confirmBulkDelete}
        title={`Xóa ${selectedIds.length} sản phẩm?`}
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn? Hành động này không thể hoàn tác.`}
        confirmText={`Xóa ${selectedIds.length} sản phẩm`}
        cancelText="Hủy"
        type="danger"
      />

        {isCreateModalOpen && (
          <div
            className="fixed inset-0 z-[1200] bg-black/45 flex items-center justify-center p-4"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <div
              className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl p-4 md:p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold">Tạo sản phẩm mới</h2>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-9 w-9 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100"
                  aria-label="Đóng"
                >
                  ✕
                </button>
              </div>

              <ProductForm
                embedded
                onSuccess={handleCreateSuccess}
                onCancel={() => setIsCreateModalOpen(false)}
              />
            </div>
          </div>
        )}

        {detailProduct && (
          <div
            className="fixed inset-0 z-[1200] bg-black/45 flex items-center justify-center p-4"
            onClick={() => setDetailProduct(null)}
          >
            <div
              className="w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl p-4 md:p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold">Chi tiết sản phẩm</h2>
                <button
                  type="button"
                  onClick={() => setDetailProduct(null)}
                  className="h-9 w-9 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100"
                  aria-label="Đóng"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-sm">
                {getPrimaryImage(detailProduct) && (
                  <img
                    src={getPrimaryImage(detailProduct)}
                    alt={detailProduct.name}
                    className="w-full max-h-80 object-cover rounded-lg border border-border"
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-muted-foreground mb-1">Tên sản phẩm</p>
                    <p className="font-semibold">{detailProduct.name}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-muted-foreground mb-1">SKU</p>
                    <p className="font-mono">{detailProduct.sku || '—'}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-muted-foreground mb-1">Giá bán</p>
                    <p className="font-semibold text-primary">{formatPrice(detailProduct.price)}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-muted-foreground mb-1">Giá gốc</p>
                    <p className="font-semibold">{formatPrice(detailProduct.original_price)}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-muted-foreground mb-1">Tồn kho</p>
                    <p className="font-semibold">{detailProduct.stock_quantity || 0}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-muted-foreground mb-1">Đã bán</p>
                    <p className="font-semibold">{detailProduct.sold_count || 0}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-3">
                  <p className="text-muted-foreground mb-1">Mô tả</p>
                  <p className="whitespace-pre-line">{detailProduct.description || detailProduct.short_description || 'Không có mô tả'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {editProductId && (
          <div
            className="fixed inset-0 z-[1200] bg-black/45 flex items-center justify-center p-4"
            onClick={() => setEditProductId(null)}
          >
            <div
              className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl p-4 md:p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold">Chỉnh sửa sản phẩm</h2>
                <button
                  type="button"
                  onClick={() => setEditProductId(null)}
                  className="h-9 w-9 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100"
                  aria-label="Đóng"
                >
                  ✕
                </button>
              </div>

              <ProductForm
                embedded
                entityId={editProductId}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditProductId(null)}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default ProductsList;
