import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Mô tả', icon: 'FileText' },
    { id: 'specifications', label: 'Thông số', icon: 'List' },
    { id: 'care', label: 'Hướng dẫn bảo quản', icon: 'Heart' },
    { id: 'shipping', label: 'Vận chuyển', icon: 'Truck' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed mb-4">
              {product?.description}
            </p>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Đặc điểm nổi bật:</h4>
              <ul className="space-y-2">
                {product?.features?.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'specifications':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product?.specifications)?.map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium text-foreground capitalize">{key}:</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'care':
        return (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-2 text-warning" />
                Hướng dẫn bảo quản
              </h4>
              <div className="space-y-3">
                {product?.careInstructions?.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon name="Droplets" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-sm">{instruction}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <Icon name="Thermometer" size={24} className="mx-auto mb-2 text-accent" />
                <p className="text-xs text-muted-foreground">Giặt nước lạnh</p>
              </div>
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <Icon name="Sun" size={24} className="mx-auto mb-2 text-accent" />
                <p className="text-xs text-muted-foreground">Phơi nơi thoáng mát</p>
              </div>
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <Icon name="Zap" size={24} className="mx-auto mb-2 text-accent" />
                <p className="text-xs text-muted-foreground">Ủi nhiệt độ thấp</p>
              </div>
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <Icon name="X" size={24} className="mx-auto mb-2 text-error" />
                <p className="text-xs text-muted-foreground">Không tẩy trắng</p>
              </div>
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">Thông tin vận chuyển</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon name="MapPin" size={16} className="text-accent" />
                    <span className="text-sm text-foreground">Giao hàng toàn quốc</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Clock" size={16} className="text-accent" />
                    <span className="text-sm text-foreground">2-3 ngày làm việc (nội thành)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Truck" size={16} className="text-accent" />
                    <span className="text-sm text-foreground">3-5 ngày làm việc (ngoại thành)</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-3">Phí vận chuyển</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nội thành TP.HCM:</span>
                    <span className="text-foreground">30.000 VND</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ngoại thành:</span>
                    <span className="text-foreground">50.000 VND</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Đơn hàng &gt; 500.000 VND:</span>
                    <span className="text-success font-medium">Miễn phí</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Tab Headers */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-smooth ${
                activeTab === tab?.id
                  ? 'text-accent border-b-2 border-accent' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs;