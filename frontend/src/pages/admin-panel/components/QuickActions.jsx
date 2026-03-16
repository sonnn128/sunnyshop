import React from 'react';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();
  
  const actions = [
    {
      id: 1,
      title: "Thêm sản phẩm mới",
      description: "Tạo sản phẩm mới trong catalog",
      icon: "Plus",
      variant: "default",
      onClick: () => navigate('/admin-panel/products/new')
    },
    {
      id: 2,
      title: "Quản lý danh mục",
      description: "Xem và chỉnh sửa danh mục",
      icon: "Folder",
      variant: "outline",
      onClick: () => navigate('/admin-panel?tab=categories')
    },
    {
      id: 3,
      title: "Xử lý đơn hàng",
      description: "Xem và xử lý đơn hàng chờ",
      icon: "Package",
      variant: "outline",
      onClick: () => console.log("Process orders")
    },
    {
      id: 4,
      title: "Báo cáo doanh thu",
      description: "Xem báo cáo chi tiết",
      icon: "BarChart3",
      variant: "outline",
      onClick: () => console.log("View reports")
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elegant">
      <h3 className="text-lg font-semibold text-foreground mb-4">Thao tác nhanh</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            iconName={action?.icon}
            iconPosition="left"
            onClick={action?.onClick}
            className="justify-start h-auto p-4 flex-col items-start"
          >
            <div className="text-left">
              <div className="font-medium">{action?.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{action?.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;