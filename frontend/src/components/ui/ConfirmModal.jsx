import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Xác nhận', 
  message, 
  confirmText = 'Xác nhận', 
  cancelText = 'Hủy bỏ',
  type = 'warning' // warning, danger, info
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIconAndColor = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'AlertTriangle',
          bgColor: 'bg-red-50 dark:bg-red-950/30',
          iconColor: 'text-red-600 dark:text-red-400',
          ringColor: 'ring-red-500/20',
          buttonVariant: 'destructive'
        };
      case 'warning':
        return {
          icon: 'AlertCircle',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          ringColor: 'ring-yellow-500/20',
          buttonVariant: 'default'
        };
      case 'info':
        return {
          icon: 'Info',
          bgColor: 'bg-blue-50 dark:bg-blue-950/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          ringColor: 'ring-blue-500/20',
          buttonVariant: 'default'
        };
      default:
        return {
          icon: 'AlertCircle',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          ringColor: 'ring-yellow-500/20',
          buttonVariant: 'default'
        };
    }
  };

  const { icon, bgColor, iconColor, ringColor, buttonVariant } = getIconAndColor();

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-border/50">
        {/* Icon Header with gradient background */}
        <div className="relative pt-8 pb-6 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 rounded-t-2xl"></div>
          
          <div className="relative flex justify-center">
            <div className={`${bgColor} ${ringColor} rounded-2xl p-4 ring-4 shadow-lg animate-in zoom-in duration-300 delay-100`}>
              <div className="relative">
                <Icon name={icon} size={40} className={`${iconColor} animate-pulse`} strokeWidth={2.5} />
                {type === 'danger' && (
                  <div className="absolute inset-0 animate-ping opacity-20">
                    <Icon name={icon} size={40} className={iconColor} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-2 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3 animate-in slide-in-from-top-2 duration-300 delay-150">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-[15px] animate-in slide-in-from-top-2 duration-300 delay-200">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6 pt-6 animate-in slide-in-from-bottom-2 duration-300 delay-250">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 font-semibold hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariant}
            onClick={handleConfirm}
            className="flex-1 h-11 font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
