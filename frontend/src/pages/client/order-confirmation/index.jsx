import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { getUserOrderById } from '../../lib/orderApi';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If navigation state includes order, use it immediately
    const stateOrder = location?.state?.order;
    if (stateOrder) {
      setOrder(stateOrder);
      setLoading(false);
      return;
    }

    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng.');
      setLoading(false);
      return;
    }
    // Gọi API lấy thông tin đơn hàng
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getUserOrderById(orderId);
        if (orderData) {
          setOrder(orderData);
        } else {
          setError('Không tìm thấy thông tin đơn hàng.');
        }
      } catch (err) {
        console.error('Lỗi khi lấy đơn hàng từ API:', err);
        setError('Không tìm thấy thông tin đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Đang tải thông tin đơn hàng...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
          <Icon name="alert-circle" className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Lỗi</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/user-orders')}>Xem đơn hàng của tôi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="check-circle" className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-semibold text-green-600">Đặt hàng thành công!</h2>
        </div>
        <p className="text-muted-foreground mb-6">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận và sẽ được xử lý sớm nhất.</p>
        <div className="bg-muted/30 rounded p-4 mb-6">
          <p><span className="font-medium">Mã đơn hàng:</span> #{order.id || order._id || order.orderNumber}</p>
          <p><span className="font-medium">Người nhận:</span> {
            order.shippingAddress?.name ||
            order.billingAddress?.name ||
            order.customer?.name ||
            order.shipping_address?.name ||
            order.billing_address?.name ||
            'N/A'
          }</p>
          <p><span className="font-medium">Địa chỉ:</span> {
            order.shippingAddress?.address_line1 ||
            order.billingAddress?.address_line1 ||
            order.customer?.address ||
            order.shipping_address?.address_line1 ||
            order.billing_address?.address_line1 ||
            order.address ||
            'N/A'
          }</p>
          <p><span className="font-medium">Số điện thoại:</span> {
            order.shippingAddress?.phone ||
            order.billingAddress?.phone ||
            order.customer?.phone ||
            order.shipping_address?.phone ||
            order.billing_address?.phone ||
            order.phone ||
            'N/A'
          }</p>
          <p><span className="font-medium">Email:</span> {
            order.shippingAddress?.email ||
            order.billingAddress?.email ||
            order.guestEmail ||
            order.customer?.email ||
            order.shipping_address?.email ||
            order.billing_address?.email ||
            order.guest_email ||
            order.email ||
            'N/A'
          }</p>
          <p><span className="font-medium">Phương thức thanh toán:</span> {
            (order.paymentMethod || order.payment_method) === 'cod' 
              ? 'Thanh toán khi nhận hàng' 
              : 'Chuyển khoản ngân hàng'
          }</p>
          <p><span className="font-medium">Tổng tiền:</span> {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(order.total || order.totalAmount || order.total_amount || 0)}</p>
          <p><span className="font-medium">Trạng thái:</span> <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
            order.status === 'shipping' ? 'bg-purple-100 text-purple-800' :
            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.status === 'pending' ? 'Chờ xác nhận' :
             order.status === 'confirmed' ? 'Đã xác nhận' :
             order.status === 'processing' ? 'Đang xử lý' :
             order.status === 'shipped' || order.status === 'shipping' ? 'Đang giao hàng' :
             order.status === 'delivered' ? 'Đã giao hàng' :
             order.status === 'cancelled' ? 'Đã hủy' : 'Đang xử lý'}
          </span></p>
          <p><span className="font-medium">Ngày đặt hàng:</span> {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')}</p>
        </div>
        <h3 className="font-semibold mb-2">Sản phẩm đã mua</h3>
        <ul className="mb-6">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <li key={index} className="flex justify-between py-2 border-b">
                <span>
                  {item.productName || item.product_name || item.name || 'Sản phẩm'} x {item.quantity}
                </span>
                <span>{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format((item.unitPrice || item.price || 0) * (item.quantity || 1))}</span>
              </li>
            ))
          ) : order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((item, index) => (
              <li key={index} className="flex justify-between py-2 border-b">
                <span>
                  {item.product?.name || item.name || 'Sản phẩm'} x {item.quantity}
                  {item.selectedSize && <span className="text-xs text-gray-500 ml-1">(Size: {item.selectedSize})</span>}
                  {item.selectedColor && <span className="text-xs text-gray-500 ml-1">(Màu: {item.selectedColor})</span>}
                </span>
                <span>{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(item.price * item.quantity || 0)}</span>
              </li>
            ))
          ) : (
            <li>Không có sản phẩm nào.</li>
          )}
        </ul>
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Tổng tiền:</span>
          <span className="text-lg font-bold text-primary">
            {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(order.totalAmount || order.total || 0)}
          </span>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate(`/order-detail/${order.id || order._id}`)} 
            className="flex-1"
            variant="outline"
          >
            Xem chi tiết đơn hàng
          </Button>
          <Button onClick={() => navigate('/user-orders')} className="flex-1">
            Xem tất cả đơn hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
