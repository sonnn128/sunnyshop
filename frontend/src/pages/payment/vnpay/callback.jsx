import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../../components/ui/ToastProvider';
import API from '../../../lib/api';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * Component xử lý callback từ VNPay sau khi người dùng hoàn tất thanh toán
 * Phân tích URL parameters và cập nhật trạng thái đơn hàng
 */
const VNPayCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(location.search);
    
    const processPaymentResult = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin từ URL parameters
        const vnpTxnRef = params.get('vnp_TxnRef'); // Mã đơn hàng
        const vnpResponseCode = params.get('vnp_ResponseCode'); // Mã phản hồi
        const vnpTransactionStatus = params.get('vnp_TransactionStatus'); // Trạng thái giao dịch
        
        // Gọi API để xác nhận thanh toán
        const response = await API.post('/payments/vnpay/verify', {
          queryParams: Object.fromEntries(params),
        });
        
        // Phân tích kết quả từ server
        if (response && response.success) {
          // Thanh toán thành công
          setPaymentStatus('success');
          setOrderInfo(response.order);
          
          // Chuyển hướng đến trang xác nhận đơn hàng sau 3 giây
          setTimeout(() => {
            navigate(`/order-confirmation/${response.order.orderId}`);
          }, 3000);
        } else {
          // Thanh toán thất bại
          setPaymentStatus('failed');
          setError(response?.message || 'Thanh toán không thành công.');
        }
      } catch (error) {
        console.error('[VNPayCallback] Error processing payment:', error);
        setPaymentStatus('failed');
        setError('Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng liên hệ hỗ trợ khách hàng.');
      } finally {
        setLoading(false);
      }
    };
    
    processPaymentResult();
  }, [location.search, navigate, toast]);
  
  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Đang xử lý thanh toán</h2>
          <p className="text-muted-foreground">Vui lòng không đóng trang này...</p>
        </div>
      </div>
    );
  }
  
  // Render success or failure state
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
        {paymentStatus === 'success' ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Icon name="check-circle" className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-green-600 mb-2">Thanh toán thành công!</h2>
            <p className="text-muted-foreground mb-6">
              Đơn hàng của bạn đã được thanh toán thành công và đang được xử lý.
            </p>
            {orderInfo && (
              <div className="bg-muted/30 rounded p-4 mb-6 text-left">
                <p className="font-medium">Mã đơn hàng: #{orderInfo.orderId}</p>
                <p>Tổng thanh toán: {orderInfo.totalAmount?.toLocaleString()} đ</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-6">
              Bạn sẽ được chuyển hướng đến trang xác nhận đơn hàng sau vài giây...
            </p>
            <Button onClick={() => navigate('/user-dashboard')} className="w-full">
              Xem đơn hàng của tôi
            </Button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Icon name="alert-circle" className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Thanh toán thất bại</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.'}
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/shopping-cart')} className="w-full">
                Quay lại giỏ hàng
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Tiếp tục mua sắm
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VNPayCallback;