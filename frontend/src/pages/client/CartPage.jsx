import React, { useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Table, InputNumber, Empty, Spin, message, Input, theme, Select, Checkbox } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '@/contexts/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import { couponService } from '@/services/coupon.service';

const { Title } = Typography;

const CartPage = () => {
    const { token } = theme.useToken();
    const {
        cartItems,
        totalPrice,
        loading,
        error,
        updateQuantity,
        removeFromCart,
        clearCart,
        loadCartFromServer
    } = useCart();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = React.useState('');
    const [discount, setDiscount] = React.useState(0);
    const [appliedCoupon, setAppliedCoupon] = React.useState(null);
    const [activeCoupons, setActiveCoupons] = React.useState([]);

    const getRowKey = (record) => `${record.id}-${record.size || ''}-${record.color || ''}`;
    const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);

    // Select all items by default on cart load
    useEffect(() => {
        if (cartItems.length > 0 && selectedRowKeys.length === 0) {
            setSelectedRowKeys(cartItems.map(getRowKey));
        }
    }, [cartItems]);

    // Load cart from server when component mounts
    useEffect(() => {
        loadCartFromServer();
        fetchActiveCoupons();
    }, []);

    const fetchActiveCoupons = async () => {
        try {
            const data = await couponService.getActive();
            setActiveCoupons(data || []);
        } catch (error) {
            console.error('Failed to load active coupons', error);
        }
    };

    // Show error message if there's an error
    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleQuantityChange = async (record, value) => {
        if (value && value > 0) {
            await updateQuantity(record.id, value, record.size, record.color);
        }
    };

    const handleRemoveItem = async (record) => {
        await removeFromCart(record.id, record.size, record.color);
        message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    };

    const handleClearCart = async () => {
        await clearCart();
        message.success('Đã xóa toàn bộ giỏ hàng');
    };

    const handleCheckout = () => {
        const selectedItems = cartItems.filter(item => selectedRowKeys.includes(getRowKey(item)));
        if (selectedItems.length === 0) {
            message.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
            return;
        }
        localStorage.setItem('checkoutItemKeys', JSON.stringify(selectedRowKeys));
        navigate('/checkout');
    };

    const handleRemoveSelected = async () => {
        try {
            for (const key of selectedRowKeys) {
                const [id, size, color] = key.split('-');
                await removeFromCart(Number(id), size, color);
            }
            message.success('Đã xóa các sản phẩm được chọn khỏi giỏ hàng');
            setSelectedRowKeys([]);
        } catch (error) {
            message.error('Xóa sản phẩm thất bại');
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src={record.image || 'https://via.placeholder.com/60x60?text=No+Image'}
                        alt={text}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        {record.factory && (
                            <div style={{ color: '#666', fontSize: '12px' }}>bởi {record.factory}</div>
                        )}
                        {(record.size || record.color) && (
                            <div style={{ marginTop: '4px', display: 'flex', gap: '8px' }}>
                                {record.size && <span style={{ padding: '2px 8px', fontSize: '11px', backgroundColor: '#F3F4F6', borderRadius: '4px', color: '#4B5563', fontWeight: 500 }}>Size: {record.size}</span>}
                                {record.color && <span style={{ padding: '2px 8px', fontSize: '11px', backgroundColor: '#F3F4F6', borderRadius: '4px', color: '#4B5563', fontWeight: 500 }}>Màu: {record.color}</span>}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatPrice(price),
            width: 120,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, record) => (
                <InputNumber
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(record, value)}
                    disabled={loading}
                />
            ),
            width: 120,
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (_, record) => formatPrice(record.price * record.quantity),
            width: 120,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record)}
                    loading={loading}
                >
                    Xóa
                </Button>
            ),
            width: 100,
        },
    ];

    if (loading && cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Đang tải giỏ hàng...</div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <Title level={2}>Giỏ hàng</Title>
                <Card>
                    <Empty
                        image={<ShoppingCartOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                        description="Giỏ hàng đang trống"
                        style={{ padding: '50px 0' }}
                    >
                        <Button type="primary" onClick={() => navigate('/products')}>
                            Tiếp tục mua sắm
                        </Button>
                    </Empty>
                </Card>
            </div>
        );
    }



    const selectedItems = cartItems.filter(item => selectedRowKeys.includes(getRowKey(item)));
    const selectedItemsCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const selectedTotalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Recalculate discount based on selected items price
    useEffect(() => {
        if (appliedCoupon) {
            let calculatedDiscount = 0;
            if (appliedCoupon.discountType === 'PERCENTAGE') {
                calculatedDiscount = (selectedTotalPrice * appliedCoupon.discountValue) / 100;
                if (appliedCoupon.maxDiscountAmount && calculatedDiscount > appliedCoupon.maxDiscountAmount) {
                    calculatedDiscount = appliedCoupon.maxDiscountAmount;
                }
            } else {
                calculatedDiscount = appliedCoupon.discountValue;
            }
            setDiscount(calculatedDiscount);
        } else {
            setDiscount(0);
        }
    }, [selectedTotalPrice, appliedCoupon]);

    const handleApplyCoupon = async () => {
        if (selectedItems.length === 0) {
            message.error('Vui lòng chọn ít nhất một sản phẩm trước khi áp dụng mã giảm giá');
            return;
        }
        if (!couponCode.trim()) {
            message.error('Vui lòng nhập mã giảm giá');
            return;
        }
        try {
            const coupon = await couponService.validate(couponCode, selectedTotalPrice);
            
            let calculatedDiscount = 0;
            if (coupon.discountType === 'PERCENTAGE') {
                calculatedDiscount = (selectedTotalPrice * coupon.discountValue) / 100;
                if (coupon.maxDiscountAmount && calculatedDiscount > coupon.maxDiscountAmount) {
                    calculatedDiscount = coupon.maxDiscountAmount;
                }
            } else {
                calculatedDiscount = coupon.discountValue;
            }

            setDiscount(calculatedDiscount);
            setAppliedCoupon(coupon);
            message.success('Đã áp dụng mã giảm giá!');
            localStorage.setItem('coupon', JSON.stringify(coupon));
        } catch (e) {
            message.error(typeof e === 'string' ? e : (e.response?.data?.message || 'Mã giảm giá không hợp lệ'));
            setDiscount(0);
            setAppliedCoupon(null);
        }
    };

    const finalPrice = Math.max(0, selectedTotalPrice - discount);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>Giỏ hàng ({cartItems.length} sản phẩm)</Title>
                <Button
                    danger
                    onClick={handleClearCart}
                    loading={loading}
                >
                    Xóa giỏ hàng
                </Button>
            </div>

            <Card bodyStyle={{ padding: 0 }} style={{ overflow: 'hidden', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys) => setSelectedRowKeys(keys)
                    }}
                    columns={columns}
                    dataSource={cartItems}
                    pagination={false}
                    rowKey={getRowKey}
                    loading={loading}
                />
            </Card>

            {/* Shopee-style Cart Footer (Sticky Viewport Bottom) */}
            <div style={{
                position: 'sticky',
                bottom: 0,
                zIndex: 100,
                border: '1px solid #f2f2f2',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 -5px 15px rgba(0,0,0,0.06)',
                overflow: 'hidden'
            }}>
                {/* Voucher Row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom: '1px dashed #f2f2f2',
                    backgroundColor: '#fffbf8'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#ee4d2d', fontSize: '18px' }}>🎟️</span>
                        <span style={{ fontSize: '14px', color: '#222', fontWeight: 500 }}>Mã giảm giá của Shop (Shop Voucher)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {appliedCoupon && (
                            <span style={{ 
                                border: '1px solid #ee4d2d', 
                                color: '#ee4d2d', 
                                padding: '2px 8px', 
                                fontSize: '12px', 
                                borderRadius: '2px',
                                fontWeight: 500,
                                backgroundColor: '#fff'
                            }}>
                                Mã: {appliedCoupon.code} (-{appliedCoupon.discountType === 'PERCENTAGE' ? appliedCoupon.discountValue + '%' : formatPrice(appliedCoupon.discountValue)})
                            </span>
                        )}
                        <Select
                            placeholder="Chọn mã giảm giá"
                            value={couponCode || undefined}
                            onChange={(val) => {
                                setCouponCode(val);
                                if (!val) {
                                    setAppliedCoupon(null);
                                    setDiscount(0);
                                    localStorage.removeItem('coupon');
                                }
                            }}
                            style={{ width: 220, textAlign: 'left' }}
                            disabled={!!appliedCoupon}
                            allowClear
                            options={activeCoupons.map(c => ({
                                value: c.code,
                                label: `${c.code} - Giảm ${c.discountType === 'PERCENTAGE' ? c.discountValue + '%' : formatPrice(c.discountValue)}`
                            }))}
                        />
                        {appliedCoupon ? (
                            <Button size="small" onClick={() => {
                                setAppliedCoupon(null);
                                setDiscount(0);
                                setCouponCode('');
                                localStorage.removeItem('coupon');
                            }}>Xóa mã</Button>
                        ) : (
                            <Button type="primary" size="small" onClick={handleApplyCoupon} style={{ backgroundColor: '#ee4d2d', borderColor: '#ee4d2d' }}>Áp dụng</Button>
                        )}
                    </div>
                </div>

                {/* Action & Total Row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    backgroundColor: '#fff',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    {/* Left action section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <Checkbox 
                            checked={selectedRowKeys.length === cartItems.length && cartItems.length > 0} 
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedRowKeys(cartItems.map(getRowKey));
                                } else {
                                    setSelectedRowKeys([]);
                                }
                            }}
                            style={{ fontSize: '14px', color: '#222' }}
                        >
                            Chọn Tất Cả ({cartItems.length})
                        </Checkbox>
                        
                        <Button 
                            type="text" 
                            onClick={handleRemoveSelected}
                            disabled={selectedRowKeys.length === 0}
                            style={{ padding: 0, height: 'auto', color: selectedRowKeys.length === 0 ? '#d9d9d9' : '#222', fontSize: '14px' }}
                        >
                            Xóa
                        </Button>
                        
                        <Button 
                            type="text" 
                            style={{ padding: 0, height: 'auto', color: '#d9d9d9', fontSize: '14px', cursor: 'default' }}
                            disabled
                        >
                            Bỏ sản phẩm không hoạt động
                        </Button>

                        <Button 
                            type="text" 
                            style={{ padding: 0, height: 'auto', color: '#222', fontSize: '14px' }}
                        >
                            Lưu vào mục Đã thích
                        </Button>
                    </div>

                    {/* Right checkout section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: 'auto' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                <span style={{ fontSize: '15px', color: '#222' }}>
                                    Tổng cộng ({selectedItemsCount} sản phẩm):
                                </span>
                                <span style={{ fontSize: '24px', fontWeight: 600, color: '#ee4d2d', marginLeft: '8px' }}>
                                    {formatPrice(finalPrice)}
                                </span>
                            </div>
                            {discount > 0 && (
                                <div style={{ fontSize: '13px', color: '#ee4d2d', marginTop: '2px' }}>
                                    Tiết kiệm: -{formatPrice(discount)}
                                </div>
                            )}
                        </div>

                        <Button
                            type="primary"
                            onClick={handleCheckout}
                            loading={loading}
                            style={{
                                height: '48px',
                                padding: '0 36px',
                                borderRadius: '2px',
                                fontSize: '16px',
                                fontWeight: 500,
                                backgroundColor: '#ee4d2d',
                                borderColor: '#ee4d2d',
                                color: '#fff',
                                boxShadow: '0 1px 1px 0 rgba(0,0,0,.09)'
                            }}
                        >
                            Mua Hàng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
