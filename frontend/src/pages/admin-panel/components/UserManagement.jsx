import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: "Nguyễn Văn Admin",
      email: "admin@abcfashion.com",
      role: "admin",
      status: "active",
      lastLogin: "24/09/2024 14:30",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      name: "Trần Thị Manager",
      email: "manager@abcfashion.com",
      role: "manager",
      status: "active",
      lastLogin: "24/09/2024 13:15",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      name: "Lê Văn Staff",
      email: "staff1@abcfashion.com",
      role: "staff",
      status: "active",
      lastLogin: "24/09/2024 12:45",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 4,
      name: "Phạm Thị Staff",
      email: "staff2@abcfashion.com",
      role: "staff",
      status: "inactive",
      lastLogin: "23/09/2024 16:20",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 5,
      name: "Hoàng Văn Support",
      email: "support@abcfashion.com",
      role: "support",
      status: "active",
      lastLogin: "24/09/2024 11:30",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg"
    }
  ];

  const roleOptions = [
    { value: 'all', label: 'Tất cả vai trò' },
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'manager', label: 'Quản lý' },
    { value: 'staff', label: 'Nhân viên' },
    { value: 'support', label: 'Hỗ trợ' }
  ];

  const getRoleConfig = (role) => {
    const configs = {
      admin: { label: "Quản trị viên", color: "bg-error/10 text-error", icon: "Shield" },
      manager: { label: "Quản lý", color: "bg-primary/10 text-primary", icon: "Crown" },
      staff: { label: "Nhân viên", color: "bg-accent/10 text-accent", icon: "User" },
      support: { label: "Hỗ trợ", color: "bg-success/10 text-success", icon: "Headphones" }
    };
    return configs?.[role] || configs?.staff;
  };

  const getStatusConfig = (status) => {
    return status === 'active' 
      ? { label: "Hoạt động", color: "bg-success/10 text-success" }
      : { label: "Không hoạt động", color: "bg-error/10 text-error" };
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesRole = roleFilter === 'all' || user?.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-card border border-border rounded-lg shadow-elegant">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">Quản lý người dùng</h3>
          <Button variant="default" iconName="UserPlus" iconPosition="left">
            Thêm người dùng
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="Lọc theo vai trò"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Người dùng</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vai trò</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Đăng nhập cuối</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user) => {
              const roleConfig = getRoleConfig(user?.role);
              const statusConfig = getStatusConfig(user?.status);
              
              return (
                <tr key={user?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={user?.avatar} 
                          alt={user?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user?.name}</div>
                        <div className="text-sm text-muted-foreground">{user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleConfig?.color}`}>
                      <Icon name={roleConfig?.icon} size={12} className="mr-1" />
                      {roleConfig?.label}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig?.color}`}>
                      {statusConfig?.label}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">{user?.lastLogin}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="Edit">
                        Sửa
                      </Button>
                      <Button variant="ghost" size="sm" iconName="MoreHorizontal">
                        Thêm
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredUsers?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Không tìm thấy người dùng nào</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;