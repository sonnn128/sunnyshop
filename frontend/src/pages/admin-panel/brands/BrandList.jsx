import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ui/ToastProvider';
import Button from '../../../components/ui/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { getBrands, deleteBrand, toggleBrandActive } from '../../../lib/brandApi';
import { Briefcase, Plus, Pencil, Trash2, Search, Grid3x3, List, ToggleLeft, ToggleRight } from 'lucide-react';

const BrandList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, brand: null });

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(data || []);
    } catch (e) {
      console.error('Load brands error:', e);
      toast.push({ 
        title: 'Lỗi', 
        message: 'Không tải được danh sách thương hiệu', 
        type: 'error' 
      });
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.brand) return;
    
    try {
      await deleteBrand(deleteModal.brand._id);
      toast.push({ 
        title: 'Thành công', 
        message: 'Xóa thương hiệu thành công', 
        type: 'success' 
      });
      fetchBrands();
    } catch (e) {
      console.error('Delete error:', e);
      toast.push({ 
        title: 'Lỗi', 
        message: e.response?.data?.message || 'Xóa thương hiệu thất bại', 
        type: 'error' 
      });
    } finally {
      setDeleteModal({ isOpen: false, brand: null });
    }
  };

  const handleToggleActive = async (brand) => {
    try {
      await toggleBrandActive(brand._id);
      toast.push({ 
        title: 'Thành công', 
        message: `Đã ${brand.is_active ? 'ẩn' : 'hiện'} thương hiệu`, 
        type: 'success' 
      });
      fetchBrands();
    } catch (e) {
      toast.push({ 
        title: 'Lỗi', 
        message: 'Không thể cập nhật trạng thái', 
        type: 'error' 
      });
    }
  };

  const filteredBrands = Array.isArray(brands) 
    ? brands.filter(brand =>
        brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-accent" />
            Quản lý Thương hiệu
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredBrands.length} thương hiệu
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/admin-panel/brands/new')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm thương hiệu
        </Button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
        </div>
        
        <div className="flex items-center gap-2 border border-border rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent text-white' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Brands Grid/List */}
      {filteredBrands.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Chưa có thương hiệu nào</h3>
          <p className="text-muted-foreground mb-4">Bắt đầu bằng cách thêm thương hiệu đầu tiên</p>
          <Button onClick={() => navigate('/admin-panel/brands/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm thương hiệu
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBrands.map((brand) => (
            <div
              key={brand._id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Logo */}
              <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {brand.logo_url ? (
                  <img 
                    src={brand.logo_url} 
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Briefcase className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              
              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground truncate">{brand.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    brand.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {brand.is_active ? 'Hoạt động' : 'Ẩn'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{brand.slug}</p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => handleToggleActive(brand)}
                  className="p-2 text-muted-foreground hover:text-accent transition-colors"
                  title={brand.is_active ? 'Ẩn' : 'Hiện'}
                >
                  {brand.is_active ? (
                    <ToggleRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => navigate(`/admin-panel/brands/${brand._id}`)}
                  className="p-2 text-muted-foreground hover:text-accent transition-colors"
                  title="Chỉnh sửa"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, brand })}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Logo</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Tên</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Slug</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Trạng thái</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBrands.map((brand) => (
                <tr key={brand._id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                      {brand.logo_url ? (
                        <img 
                          src={brand.logo_url} 
                          alt={brand.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <Briefcase className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{brand.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{brand.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      brand.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {brand.is_active ? 'Hoạt động' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleActive(brand)}
                        className="p-2 text-muted-foreground hover:text-accent transition-colors"
                        title={brand.is_active ? 'Ẩn' : 'Hiện'}
                      >
                        {brand.is_active ? (
                          <ToggleRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/admin-panel/brands/${brand._id}`)}
                        className="p-2 text-muted-foreground hover:text-accent transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, brand })}
                        className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, brand: null })}
        onConfirm={handleDelete}
        title="Xóa thương hiệu"
        message={`Bạn có chắc chắn muốn xóa thương hiệu "${deleteModal.brand?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        confirmVariant="danger"
      />
    </div>
  );
};

export default BrandList;
