import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users as UsersIcon, Search, Grid3x3, List, Shield, UserPlus, Mail, Phone, Clock, Ban } from 'lucide-react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import ConfirmModal from 'components/ui/ConfirmModal';
import { useToast } from 'components/ui/ToastProvider';
import { getAdminUsers, deleteAdminUser } from 'lib/adminUserApi';

const roleOptions = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'manager', label: 'Quản lý' },
  { value: 'staff', label: 'Nhân viên' },
  { value: 'support', label: 'Hỗ trợ' },
  { value: 'customer', label: 'Khách hàng' }
];

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
  { value: 'suspended', label: 'Tạm khóa' }
];

const roleBadges = {
  admin: { label: 'Quản trị viên', color: 'bg-red-100 text-red-700 border border-red-200', icon: Shield },
  manager: { label: 'Quản lý', color: 'bg-amber-100 text-amber-700 border border-amber-200', icon: Shield },
  staff: { label: 'Nhân viên', color: 'bg-blue-100 text-blue-700 border border-blue-200', icon: Shield },
  support: { label: 'Hỗ trợ', color: 'bg-emerald-100 text-emerald-700 border border-emerald-200', icon: Shield },
  customer: { label: 'Khách hàng', color: 'bg-slate-100 text-slate-700 border border-slate-200', icon: Shield }
};

const statusStyles = {
  active: 'bg-green-100 text-green-700 border border-green-200',
  inactive: 'bg-slate-100 text-slate-600 border border-slate-200',
  suspended: 'bg-amber-100 text-amber-700 border border-amber-200'
};

const UsersList = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 12
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = async (override = {}) => {
    setLoading(true);
    try {
      const query = {
        page: override.page || filters.page,
        limit: filters.limit,
        sort: '-created_at'
      };

      if ((override.role || filters.role) && (override.role || filters.role) !== 'all') {
        query.role = override.role || filters.role;
      }

      if ((override.status || filters.status) && (override.status || filters.status) !== 'all') {
        query.status = override.status || filters.status;
      }

      if (typeof (override.search ?? filters.search) === 'string' && (override.search ?? filters.search).trim()) {
        query.search = (override.search ?? filters.search).trim();
      }

      const response = await getAdminUsers(query);
      setUsers(response.users || []);

      const currentPage = response.pagination?.currentPage || response.pagination?.page || query.page || 1;
      const perPage = response.pagination?.perPage || response.pagination?.limit || filters.limit;
      const totalItems = response.pagination?.totalItems || response.pagination?.count || (response.users?.length || 0);
      const totalPages = response.pagination?.totalPages
        || (perPage > 0 ? Math.max(1, Math.ceil(totalItems / perPage)) : 1);

      setPagination({ currentPage, totalPages, totalItems, perPage });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể tải danh sách người dùng. Vui lòng thử lại sau.',
        type: 'error'
      });
      setUsers([]);
      setPagination(prev => ({ ...prev, currentPage: 1, totalPages: 1, totalItems: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.role, filters.status, filters.page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers({ search: filters.search, page: 1 });
      setFilters(prev => (prev.page === 1 ? prev : { ...prev, page: 1 }));
    }, filters.search ? 400 : 0);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? value : 1
    }));
  };

  const handleDelete = (user) => {
    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAdminUser(deleteTarget.id);
      toast.push({
        title: 'Đã xóa',
        message: `Tài khoản ${deleteTarget.fullName || deleteTarget.email} đã được xóa.`,
        type: 'success'
      });
      setDeleteTarget(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể xóa người dùng. Vui lòng thử lại.',
        type: 'error'
      });
      setDeleteTarget(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return 'Chưa cập nhật';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredSummary = useMemo(() => {
    const roleLabel = roleOptions.find(r => r.value === filters.role)?.label || 'Tất cả vai trò';
    const statusLabel = statusOptions.find(s => s.value === filters.status)?.label || 'Tất cả trạng thái';
    return `${roleLabel.toLowerCase()} • ${statusLabel.toLowerCase()}`;
  }, [filters.role, filters.status]);

  const renderRoleBadge = (role) => {
    const key = (role || 'customer').toLowerCase();
    const config = roleBadges[key] || roleBadges.customer;
    const IconComponent = config.icon || Shield;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  const renderStatusBadge = (status) => {
    const key = (status || 'active').toLowerCase();
    const style = statusStyles[key] || statusStyles.active;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
        {key === 'active' && <Shield size={12} />}
        {key === 'inactive' && <Ban size={12} />}
        {key === 'suspended' && <Clock size={12} />}
        {key === 'active' ? 'Hoạt động' : key === 'inactive' ? 'Không hoạt động' : 'Tạm khóa'}
      </span>
    );
  };

  const handlePageChange = (direction) => {
    setFilters(prev => {
      const nextPage = direction === 'next' ? prev.page + 1 : prev.page - 1;
      if (nextPage < 1 || nextPage > pagination.totalPages) {
        return prev;
      }
      return { ...prev, page: nextPage };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UsersIcon className="text-primary" />
            Quản lý người dùng
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pagination.totalItems} người dùng • {filteredSummary}
          </p>
        </div>
        <Button onClick={() => navigate('/admin-panel/users/new')} iconName="UserPlus" iconPosition="left">
          Thêm người dùng
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-medium">Bộ lọc</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
              value={filters.search}
              onChange={(event) => handleFilterChange('search', event.target.value)}
              iconName="Search"
            />
          </div>
          <div>
            <Select
              options={roleOptions}
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
              label="Vai trò"
            />
          </div>
          <div>
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              label="Trạng thái"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Chế độ hiển thị:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md border transition ${viewMode === 'grid' ? 'bg-primary text-white border-primary' : 'hover:bg-muted border-border'}`}
              title="Hiển thị dạng thẻ"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md border transition ${viewMode === 'list' ? 'bg-primary text-white border-primary' : 'hover:bg-muted border-border'}`}
              title="Hiển thị dạng danh sách"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Trang {pagination.currentPage} / {pagination.totalPages}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex flex-col items-center gap-3 text-muted-foreground">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Đang tải danh sách người dùng...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <UsersIcon size={48} />
              <p>Không tìm thấy người dùng nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {users.map((user) => (
                  <div key={user.id} className="border border-border rounded-xl p-5 bg-background hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center text-lg font-semibold text-foreground">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          (user.fullName || user.email || '?').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground truncate max-w-full">
                            {user.fullName}
                          </h3>
                          {renderRoleBadge(user.role)}
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {user.email && (
                            <div className="flex items-center gap-2">
                              <Mail size={14} />
                              <span className="truncate">{user.email}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>Hoạt động gần nhất: {formatDate(user.lastLogin)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderStatusBadge(user.status)}
                            <span className="text-xs">Tạo ngày {formatDate(user.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/60">
                      <div className="text-xs text-muted-foreground">
                        Đơn hàng: <span className="font-semibold text-foreground">{user.orderCount}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin-panel/users/${user.id}`)}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(user)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="border border-border rounded-lg p-4 bg-background hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center text-base font-semibold text-foreground">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                          ) : (
                            (user.fullName || user.email || '?').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground truncate max-w-xs">
                              {user.fullName}
                            </h3>
                            {renderRoleBadge(user.role)}
                            {renderStatusBadge(user.status)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {user.email && (
                              <span className="flex items-center gap-1">
                                <Mail size={14} /> {user.email}
                              </span>
                            )}
                            {user.phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={14} /> {user.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> Cập nhật: {formatDate(user.updatedAt || user.lastLogin)}
                            </span>
                            <span>Đơn hàng: <strong>{user.orderCount}</strong></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin-panel/users/${user.id}`)}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(user)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage <= 1}
                  onClick={() => handlePageChange('prev')}
                >
                  Trang trước
                </Button>
                <div className="text-sm text-muted-foreground">
                  Hiển thị {users.length} / {pagination.totalItems} người dùng
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => handlePageChange('next')}
                >
                  Trang tiếp
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Xóa người dùng"
        message={deleteTarget ? `Bạn có chắc chắn muốn xóa tài khoản ${deleteTarget.fullName || deleteTarget.email}?` : ''}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default UsersList;
