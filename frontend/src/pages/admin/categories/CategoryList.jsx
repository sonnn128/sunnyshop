import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Folder, Plus, Pencil, Trash2, Search, Grid3x3, List, Table } from 'lucide-react';
import { formatCategoriesWithHierarchy } from '@/utils/categoryTree';

const CategoryList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'grid', 'list', or 'table' - table is default
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get('/categories');
      const cats = res?.data?.data || res?.data?.categories || res?.data || [];
      const normalizedCats = Array.isArray(cats)
        ? cats.map((cat) => ({
            ...cat,
            _id: cat?._id ?? cat?.id,
            image_url: cat?.image_url ?? cat?.imageUrl ?? '',
            sort_order: cat?.sort_order ?? cat?.sortOrder ?? 0,
            is_active: cat?.is_active ?? cat?.isActive ?? cat?.active ?? true,
            is_featured: cat?.is_featured ?? cat?.isFeatured ?? cat?.featured ?? false,
            parent_id: cat?.parent_id ?? cat?.parentId ?? cat?.parent ?? null,
          }))
        : [];
      const sortedCats = Array.isArray(cats)
        ? [...normalizedCats].sort((a, b) => (a?.sort_order || 0) - (b?.sort_order || 0))
        : [];
      setCategories(formatCategoriesWithHierarchy(sortedCats));
    } catch (e) {
      console.error('Load categories error:', e);
      
      // If backend not ready (404), use empty array instead of showing error
      if (e.response?.status === 404) {
        console.warn('Categories API not available yet. Using empty list.');
        setCategories([]);
      } else {
        toast.push({ 
          title: 'Lỗi', 
          message: 'Không tải được danh sách danh mục', 
          type: 'error' 
        });
        setCategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.category) return;
    
    try {
      await API.delete(`/categories/${deleteModal.category._id || deleteModal.category.id}`);
      toast.push({ 
        title: 'Thành công', 
        message: 'Xóa danh mục thành công', 
        type: 'success' 
      });
      fetchCategories();
    } catch (e) {
      console.error('Delete error:', e);
      toast.push({ 
        title: 'Lỗi', 
        message: e.response?.data?.message || 'Xóa danh mục thất bại', 
        type: 'error' 
      });
    } finally {
      setDeleteModal({ isOpen: false, category: null });
    }
  };

  const filteredCategories = Array.isArray(categories) 
    ? categories.filter(cat => {
        const term = searchTerm.toLowerCase();
        return (
          cat.name?.toLowerCase().includes(term) ||
          cat.description?.toLowerCase().includes(term) ||
          cat.slug?.toLowerCase().includes(term) ||
          cat.displayLabel?.toLowerCase().includes(term) ||
          cat.indentedLabel?.toLowerCase().includes(term)
        );
      })
    : [];

  const totalCategories = Array.isArray(categories) ? categories.length : 0;
  const activeCategories = Array.isArray(categories)
    ? categories.filter((cat) => cat?.is_active).length
    : 0;
  const inactiveCategories = Math.max(0, totalCategories - activeCategories);

  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-elegant">
        
        {/* Header */}
        <div className="mb-6 text-left">
          <div>
            <h1 className="text-3xl font-bold flex items-center justify-start gap-2 text-left">
              <Folder className="text-primary" />
              Quản lý Danh mục
            </h1>
            <p className="text-muted-foreground mt-1">
              Tổng cộng {categories.length} danh mục
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Tổng danh mục</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{totalCategories}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-emerald-700">Đang hoạt động</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">{activeCategories}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-600">Không hoạt động</p>
            <p className="mt-1 text-2xl font-bold text-slate-700">{inactiveCategories}</p>
          </div>
        </div>

        {/* Search + Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <Button onClick={() => navigate('/admin/categories/new')} className="md:self-end">
            <Plus size={18} />
            Thêm danh mục
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 border rounded-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-primary text-white border-primary' 
                  : 'hover:bg-muted'
              }`}
              title="Xem dạng bảng"
            >
              <Table size={20} />
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
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-muted-foreground">Đang tải...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Folder size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? 'Không tìm thấy danh mục' : 'Chưa có danh mục nào'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Thử tìm kiếm với từ khóa khác' 
                : 'Bắt đầu bằng cách thêm danh mục đầu tiên'}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/admin/categories/new')}>
                <Plus size={18} />
                Thêm danh mục
              </Button>
            )}
          </div>
        )}

        {/* Categories Grid View */}
        {!loading && filteredCategories.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                {cat.image_url && (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Name & Description */}
                <h3 className="text-xl font-semibold mb-1">
                  {cat.indentedLabel || cat.name}
                </h3>
                {cat.displayLabel && cat.displayLabel !== cat.name && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Đường dẫn: {cat.displayLabel}
                  </p>
                )}
                {cat.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {cat.description}
                  </p>
                )}

                {/* Slug & Sort Order */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div>
                    <span className="font-medium">Slug:</span> /{cat.slug}
                  </div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                    #️⃣ {cat.sort_order || 0}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    cat.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {cat.is_active ? '✓ Hoạt động' : '○ Không hoạt động'}
                  </span>
                  {cat.is_featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      ★ Nổi bật
                    </span>
                  )}
                </div>

                {/* Parent Category */}
                {cat.parentChainLabel && (
                  <div className="text-sm text-muted-foreground mb-4">
                    <span className="font-medium">Danh mục cha:</span>{' '}
                    {cat.parentChainLabel}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/admin/categories/${cat._id}/detail`)}
                    className="flex-1"
                  >
                    Chi tiết
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/categories/${cat._id}`)}
                    className="flex-1"
                  >
                    <Pencil size={16} />
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteModal({ isOpen: true, category: cat })}
                    className="text-red-500 hover:text-red-700 hover:border-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Categories Table View */}
        {!loading && filteredCategories.length > 0 && viewMode === 'table' && (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="px-6 py-3 text-left font-semibold">Ảnh</th>
                  <th className="px-6 py-3 text-left font-semibold">Tên Danh Mục</th>
                  <th className="px-6 py-3 text-left font-semibold">Slug</th>
                  <th className="px-6 py-3 text-left font-semibold">Trạng Thái</th>
                  <th className="px-6 py-3 text-center font-semibold">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="border-b hover:bg-muted/30 transition-colors">
                    {/* Ảnh */}
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {cat.image_url ? (
                          <img
                            src={cat.image_url}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Folder size={24} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Tên Danh Mục */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold line-clamp-1">
                          {cat.indentedLabel || cat.name}
                        </p>
                        {cat.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4">
                      <code className="bg-muted/50 px-2 py-1 rounded text-xs">
                        /{cat.slug}
                      </code>
                    </td>

                    {/* Trạng Thái */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          cat.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {cat.is_active ? '✓ Hoạt động' : '○ Không hoạt động'}
                        </span>
                        {cat.is_featured && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 whitespace-nowrap">
                            ★ Nổi bật
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Hành Động */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/admin/categories/${cat._id}/detail`)}
                          title="Xem chi tiết"
                        >
                          Chi tiết
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/categories/${cat._id}`)}
                          title="Chỉnh sửa"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteModal({ isOpen: true, category: cat })}
                          className="text-red-500 hover:text-red-700 hover:border-red-500"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Categories List View */}
        {!loading && filteredCategories.length > 0 && viewMode === 'list' && (
          <div className="space-y-3">
            {filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Folder size={32} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      {/* Left: Category Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="font-semibold text-lg line-clamp-1">
                            {cat.indentedLabel || cat.name}
                          </h3>
                          {cat.is_featured && (
                            <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap">
                              ★ Nổi bật
                            </span>
                          )}
                        </div>

                        {cat.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                        {cat.displayLabel && cat.displayLabel !== cat.name && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                            Đường dẫn: {cat.displayLabel}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-3 text-sm mb-2">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Slug:</span>
                            <span className="font-mono text-xs">/{cat.slug}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Thứ tự:</span>
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium text-xs">
                              #{cat.sort_order || 0}
                            </span>
                          </div>
                          {cat.parentChainLabel && (
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Cha:</span>
                              <span className="text-xs line-clamp-1">
                                {cat.parentChainLabel}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        <div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            cat.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {cat.is_active ? '✓ Hoạt động' : '○ Không hoạt động'}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex md:flex-col gap-2 md:min-w-[120px]">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/admin/categories/${cat._id}/detail`)}
                          className="flex-1 md:flex-none"
                        >
                          Chi tiết
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/categories/${cat._id}`)}
                          className="flex-1 md:flex-none"
                        >
                          <Pencil size={16} />
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteModal({ isOpen: true, category: cat })}
                          className="flex-1 md:flex-none text-red-500 hover:text-red-700 hover:border-red-500"
                        >
                          <Trash2 size={16} />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, category: null })}
          onConfirm={handleDelete}
          title="Xóa danh mục"
          message={
            <>
              Bạn có chắc chắn muốn xóa danh mục{' '}
              <strong>{deleteModal.category?.name}</strong>?
              <br />
              <span className="text-red-500 text-sm">
                Lưu ý: Các sản phẩm trong danh mục này sẽ không bị xóa.
              </span>
            </>
          }
          confirmText="Xóa"
          variant="danger"
        />
    </div>
  );
};

export default CategoryList;
