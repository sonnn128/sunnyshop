import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoyaltyProgram = () => {
  const [userPoints, setUserPoints] = useState({
    currentPoints: 0,
    totalEarned: 0,
    nextTierPoints: 0,
    currentTier: 'bronze',
    expiringPoints: 0,
    expiryDate: ''
  });

  const tiers = [
    {
      name: 'bronze',
      label: 'Đồng',
      minPoints: 0,
      benefits: ['Tích điểm cơ bản', 'Sinh nhật giảm 5%'],
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      name: 'silver',
      label: 'Bạc',
      minPoints: 1000,
      benefits: ['Tích điểm x1.5', 'Sinh nhật giảm 10%', 'Miễn phí vận chuyển'],
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      name: 'gold',
      label: 'Vàng',
      minPoints: 5000,
      benefits: ['Tích điểm x2', 'Sinh nhật giảm 15%', 'Ưu tiên hỗ trợ', 'Truy cập sớm sale'],
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      name: 'platinum',
      label: 'Bạch kim',
      minPoints: 10000,
      benefits: ['Tích điểm x3', 'Sinh nhật giảm 20%', 'Tư vấn cá nhân', 'Sự kiện độc quyền'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const pointsHistory = [];

  const rewards = [];

  const currentTierData = tiers?.find(tier => tier?.name === userPoints?.currentTier);
  const nextTierData = tiers?.find(tier => tier?.minPoints > userPoints?.currentPoints);
  const progressPercentage = nextTierData 
    ? ((userPoints?.currentPoints - currentTierData?.minPoints) / (nextTierData?.minPoints - currentTierData?.minPoints)) * 100
    : 100;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleRedeemReward = (reward) => {
    if (userPoints?.currentPoints >= reward?.points) {
      setUserPoints(prev => ({
        ...prev,
        currentPoints: prev?.currentPoints - reward?.points
      }));
  // Placeholder success - integrate with API when available
  // e.g., await API.post('/api/loyalty/redeem', { rewardId: reward.id })
    }
  };

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="bg-gradient-to-r from-accent to-accent/80 rounded-lg p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold mb-2">Chương trình thành viên</h2>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{userPoints?.currentPoints?.toLocaleString()}</p>
                <p className="text-sm opacity-90">Điểm hiện tại</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">{currentTierData?.label}</p>
                <p className="text-sm opacity-90">Hạng thành viên</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-90 mb-1">Tổng điểm đã tích: {userPoints?.totalEarned?.toLocaleString()}</p>
            {userPoints?.expiringPoints > 0 && (
              <p className="text-sm bg-warning/20 text-warning-foreground px-2 py-1 rounded">
                {userPoints?.expiringPoints} điểm sẽ hết hạn vào {formatDate(userPoints?.expiryDate)}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Progress */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tiến độ hạng thành viên</h3>
          
          {nextTierData ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Còn {nextTierData?.minPoints - userPoints?.currentPoints} điểm để lên hạng {nextTierData?.label}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {tiers?.map((tier) => (
                  <div
                    key={tier?.name}
                    className={`text-center p-2 rounded-lg border ${
                      tier?.name === userPoints?.currentTier
                        ? `${tier?.bgColor} ${tier?.borderColor} ${tier?.color}`
                        : userPoints?.currentPoints >= tier?.minPoints
                        ? 'bg-success/10 border-success/20 text-success' :'bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    <p className="text-xs font-medium">{tier?.label}</p>
                    <p className="text-xs">{tier?.minPoints?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Icon name="Crown" size={48} className="mx-auto text-accent mb-2" />
              <p className="text-foreground font-medium">Bạn đã đạt hạng cao nhất!</p>
              <p className="text-sm text-muted-foreground">Tiếp tục tích điểm để nhận thêm ưu đãi</p>
            </div>
          )}
        </div>

        {/* Current Tier Benefits */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quyền lợi hạng {currentTierData?.label}</h3>
          
          <div className="space-y-3">
            {currentTierData?.benefits?.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
          
          {nextTierData && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-2">
                Quyền lợi hạng {nextTierData?.label}:
              </p>
              <div className="space-y-2">
                {nextTierData?.benefits?.slice(currentTierData?.benefits?.length)?.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon name="Plus" size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Rewards */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Đổi quà tặng</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards?.map((reward) => (
            <div
              key={reward?.id}
              className={`border rounded-lg p-4 ${
                reward?.available && userPoints?.currentPoints >= reward?.points
                  ? 'border-accent bg-accent/5' :'border-border'
              }`}
            >
              <div className="aspect-square w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden">
                <img
                  src={reward?.image}
                  alt={reward?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h4 className="font-medium text-foreground text-sm mb-1 text-center">{reward?.name}</h4>
              <p className="text-xs text-muted-foreground mb-3 text-center">{reward?.description}</p>
              
              <div className="text-center">
                <p className="text-sm font-semibold text-accent mb-2">{reward?.points} điểm</p>
                
                <Button
                  variant={
                    reward?.available && userPoints?.currentPoints >= reward?.points
                      ? 'default' :'outline'
                  }
                  size="sm"
                  onClick={() => handleRedeemReward(reward)}
                  disabled={!reward?.available || userPoints?.currentPoints < reward?.points}
                  className="w-full"
                >
                  {!reward?.available
                    ? 'Hết hàng'
                    : userPoints?.currentPoints >= reward?.points
                    ? 'Đổi ngay' :'Không đủ điểm'
                  }
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Points History */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Lịch sử điểm</h3>
        
        <div className="space-y-3">
          {pointsHistory?.map((transaction) => (
            <div key={transaction?.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction?.type === 'earned' ?'bg-success/10 text-success'
                    : transaction?.type === 'bonus' ?'bg-accent/10 text-accent' :'bg-error/10 text-error'
                }`}>
                  <Icon 
                    name={
                      transaction?.type === 'earned' ?'Plus'
                        : transaction?.type === 'bonus' ?'Gift' :'Minus'
                    } 
                    size={16} 
                  />
                </div>
                
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction?.date)}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  transaction?.points > 0 ? 'text-success' : 'text-error'
                }`}>
                  {transaction?.points > 0 ? '+' : ''}{transaction?.points} điểm
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <Button variant="outline" size="sm">
            Xem thêm lịch sử
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;