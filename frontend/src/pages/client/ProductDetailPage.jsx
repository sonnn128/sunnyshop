import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Row, Col, Spin, message, Tag, Divider, Rate, List, Avatar, Input, Form } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, HeartOutlined, HeartFilled, UserOutlined, CarOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AddToCartButton from '@/components/AddToCartButton.jsx';
import { productService } from '@/services/product.service.js';
import { wishlistService } from '@/services/wishlist.service.js';
import { reviewService } from '@/services/review.service.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useWishlist } from '@/contexts/WishlistContext.jsx';
import { orderService } from '@/services/order.service.js';
import { pushView } from '@/utils/recentViews.js';
import RecentlyViewed from '@/components/RecentlyViewed.jsx';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { items: wishlistItems, toggle: toggleWishlistContext } = useWishlist();
    const [product, setProduct] = useState(null);
    const [hasOrdered, setHasOrdered] = useState(false);
    const [ratingFilter, setRatingFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [activeImage, setActiveImage] = useState("");

    // Wishlist State (derived from context)
    const inWishlist = wishlistItems ? wishlistItems.some(p => p.id === Number(id)) : false;

    // Review State
    const [reviews, setReviews] = useState([]);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [form] = Form.useForm();

    const discountPercent = product && product.id && product.id % 3 !== 0 ? 15 + (product.id % 5) * 10 : 0;
    const oldPrice = product && discountPercent > 0 ? product.price * (100 / (100 - discountPercent)) : null;

    const totalReviewsCount = reviews.length;
    const count5 = reviews.filter(r => Math.round(r.rating) === 5).length;
    const count4 = reviews.filter(r => Math.round(r.rating) === 4).length;
    const count3 = reviews.filter(r => Math.round(r.rating) === 3).length;
    const count2 = reviews.filter(r => Math.round(r.rating) === 2).length;
    const count1 = reviews.filter(r => Math.round(r.rating) === 1).length;

    const averageRating = totalReviewsCount > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1))
        : 5.0;

    const filteredReviews = ratingFilter === 'all'
        ? reviews
        : reviews.filter(r => Math.round(r.rating) === Number(ratingFilter));

    // Compute gallery images list
    const galleryImages = React.useMemo(() => {
        if (!product) return [];
        const list = [];
        if (product.image) list.push(product.image);
        if (product.images && product.images.trim()) {
            product.images.split(',').map(img => img.trim()).filter(Boolean).forEach(img => {
                if (!list.includes(img)) {
                    list.push(img);
                }
            });
        }
        return list;
    }, [product]);

    // Compute selected variant based on selected size & color
    const selectedVariant = React.useMemo(() => {
        if (!product || !product.variants) return null;
        return product.variants.find(
            v => v.size === selectedSize && v.color === selectedColor
        );
    }, [product, selectedSize, selectedColor]);

    // Compute stock quantity dynamically
    const stockQuantity = React.useMemo(() => {
        if (!product) return 0;
        if (product.variants && product.variants.length > 0) {
            if (selectedSize && selectedColor) {
                return selectedVariant ? selectedVariant.quantity : 0;
            }
            if (selectedSize) {
                return product.variants
                    .filter(v => v.size === selectedSize)
                    .reduce((sum, v) => sum + v.quantity, 0);
            }
            if (selectedColor) {
                return product.variants
                    .filter(v => v.color === selectedColor)
                    .reduce((sum, v) => sum + v.quantity, 0);
            }
            return product.variants.reduce((sum, v) => sum + v.quantity, 0);
        }
        return product.quantity;
    }, [product, selectedSize, selectedColor, selectedVariant]);

    // Check if color is out-of-stock for selected size
    const isColorDisabled = React.useCallback((color) => {
        if (!product || !product.variants || product.variants.length === 0) return false;
        if (!selectedSize) {
            // If no size selected, color is disabled if out-of-stock in all sizes
            return !product.variants.some(v => v.color === color && v.quantity > 0);
        }
        const variant = product.variants.find(v => v.size === selectedSize && v.color === color);
        return variant ? variant.quantity <= 0 : true;
    }, [product, selectedSize]);

    // Check if size is out-of-stock for selected color
    const isSizeDisabled = React.useCallback((size) => {
        if (!product || !product.variants || product.variants.length === 0) return false;
        if (!selectedColor) {
            // If no color selected, size is disabled if out-of-stock in all colors
            return !product.variants.some(v => v.size === size && v.quantity > 0);
        }
        const variant = product.variants.find(v => v.size === size && v.color === selectedColor);
        return variant ? variant.quantity <= 0 : true;
    }, [product, selectedColor]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        if (product && product.colors && product.images) {
            const colorList = product.colors.split(',').map(x => x.trim()).filter(Boolean);
            const imageList = product.images.split(',').map(x => x.trim()).filter(Boolean);
            const colorIndex = colorList.indexOf(color);
            if (colorIndex !== -1 && imageList[colorIndex]) {
                setActiveImage(imageList[colorIndex]);
            }
        }
    };

    const checkPurchaseStatus = async () => {
        if (!user) {
            setHasOrdered(false);
            return;
        }
        try {
            const ordersResult = await orderService.getMyOrders();
            const orders = ordersResult.data || ordersResult || [];
            const hasOrderedProduct = orders.some(order => 
                order.orderDetails && order.orderDetails.some(detail => 
                    detail.product && String(detail.product.id) === String(id)
                )
            );
            setHasOrdered(hasOrderedProduct);
        } catch (error) {
            console.error('Error checking order status:', error);
            setHasOrdered(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

        if (id) {
            loadProduct();
            checkWishlistStatus();
            loadReviews();
            checkPurchaseStatus();
        }
    }, [id, user]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const result = await productService.getById(id);
            const data = result.data || result;
            setProduct(data);
            setActiveImage(data.image);
            setSelectedSize("");
            setSelectedColor("");
            pushView(data);
        } catch (error) {
            console.error('Error loading product:', error);
            message.error('Không tìm thấy thông tin sản phẩm');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const checkWishlistStatus = async () => {
        try {
            const res = await wishlistService.checkWishlist(id);
            setInWishlist(res.data);
        } catch (e) {
            // Ignore if not logged in
        }
    };

    const loadReviews = async () => {
        try {
            const res = await reviewService.getReviewsByProduct(id);
            setReviews(res.data || []);
        } catch (e) {
            console.error(e);
        }
    }

    const toggleWishlist = async () => {
        if (!user) {
            message.warning('Vui lòng đăng nhập để lưu sản phẩm yêu thích');
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        if (product) {
            toggleWishlistContext(product);
            if (inWishlist) {
                message.success('Đã bỏ khỏi danh sách yêu thích');
            } else {
                message.success('Đã thêm vào danh sách yêu thích');
            }
        }
    };

    const handleReviewSubmit = async (values) => {
        try {
            setSubmittingReview(true);
            const payload = {
                productId: id,
                rating: values.rating,
                comment: values.comment
            };
            await reviewService.addReview(payload);
            message.success('Đã gửi đánh giá thành công');
            form.resetFields();
            loadReviews();
        } catch (e) {
            if (e.response?.status === 401) {
                message.warning('Vui lòng đăng nhập để gửi đánh giá!');
                navigate('/login', { state: { from: location.pathname } });
            } else {
                message.error('Gửi đánh giá thất bại');
            }
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: '24px', color: '#6B7280', fontSize: '16px' }}>Đang tải thông tin sản phẩm...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Text type="secondary" style={{ fontSize: '18px' }}>Không tìm thấy sản phẩm</Text>
                <br />
                <Button type="primary" size="large" onClick={() => navigate('/products')} style={{ marginTop: '24px', borderRadius: '24px', backgroundColor: '#4F46E5' }}>
                    Quay lại cửa hàng
                </Button>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: '#F9FAFB', minHeight: '100vh', paddingBottom: '80px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 5%' }}>
                {/* Back Button */}
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/products')}
                    style={{ marginBottom: '24px', color: '#6B7280', fontSize: '16px', padding: 0 }}
                >
                    Trở về cửa hàng
                </Button>

                <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '60px' }} styles={{ body: { padding: 0 } }}>
                    <Row gutter={[0, 0]}>
                        {/* Image Section */}
                        <Col xs={24} md={10} lg={9}>
                            <div style={{ backgroundColor: '#ffffff', height: '100%', minHeight: '550px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                                <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: '24px', border: '1px solid rgba(0,0,0,.05)', borderRadius: '4px', overflow: 'hidden', padding: '16px' }}>
                                    <img
                                        src={activeImage || 'https://via.placeholder.com/800x800?text=Chưa+có+ảnh'}
                                        alt={product.name}
                                        style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '4px', transition: 'transform 0.3s ease' }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </div>
                                {galleryImages.length > 1 && (
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {galleryImages.map((imgUrl, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    width: '64px',
                                                    height: '64px',
                                                    borderRadius: '2px',
                                                    border: activeImage === imgUrl ? '2px solid #ee4d2d' : '1px solid #e8e8e8',
                                                    padding: '2px',
                                                    backgroundColor: '#FFFFFF',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    overflow: 'hidden'
                                                }}
                                                onMouseEnter={() => setActiveImage(imgUrl)}
                                                onClick={() => setActiveImage(imgUrl)}
                                            >
                                                <img 
                                                    src={imgUrl} 
                                                    alt={`Thumbnail ${idx}`} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1px' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* Details Section */}
                        <Col xs={24} md={14} lg={15}>
                            <div style={{ padding: '32px 32px 32px 32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {/* Title with Mall/Yêu thích+ tag */}
                                <div style={{ marginBottom: '12px' }}>
                                    <span style={{ 
                                        backgroundColor: '#ee4d2d', 
                                        color: '#fff', 
                                        padding: '2px 4px', 
                                        borderRadius: '2px', 
                                        fontSize: '12px', 
                                        fontWeight: 600, 
                                        marginRight: '8px',
                                        verticalAlign: 'middle',
                                        textTransform: 'uppercase'
                                    }}>
                                        Yêu thích+
                                    </span>
                                    <span style={{ fontSize: '20px', fontWeight: 500, color: 'rgba(0,0,0,.8)', lineHeight: 1.4, verticalAlign: 'middle' }}>
                                        {product.name}
                                    </span>
                                </div>

                                {/* Rating summary row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ color: '#ee4d2d', fontWeight: 500, borderBottom: '1px solid #ee4d2d' }}>{averageRating.toFixed(1)}</span>
                                        <Rate disabled allowHalf value={averageRating} style={{ fontSize: '12px', color: '#ee4d2d' }} />
                                    </div>
                                    <div style={{ width: '1px', height: '12px', backgroundColor: '#dbdbdb' }} />
                                    <div>
                                        <span style={{ fontWeight: 500, borderBottom: '1px solid #222' }}>{reviews.length}</span>
                                        <span style={{ color: '#767676', marginLeft: '4px' }}>Đánh Giá</span>
                                    </div>
                                    <div style={{ width: '1px', height: '12px', backgroundColor: '#dbdbdb' }} />
                                    <div>
                                        <span style={{ fontWeight: 500 }}>{product.sold || 0}</span>
                                        <span style={{ color: '#767676', marginLeft: '4px' }}>Đã Bán</span>
                                    </div>
                                </div>

                                {/* Price Box */}
                                <div style={{ 
                                    backgroundColor: '#fafafa', 
                                    padding: '15px 20px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '12px',
                                    marginBottom: '24px',
                                    borderRadius: '4px'
                                }}>
                                    {oldPrice && (
                                        <Text delete style={{ color: '#929292', fontSize: '16px' }}>
                                            {formatPrice(oldPrice)}
                                        </Text>
                                    )}
                                    <Text style={{ color: '#ee4d2d', fontSize: '30px', fontWeight: 500 }}>
                                        {formatPrice(product.price)}
                                    </Text>
                                    {discountPercent > 0 && (
                                        <span style={{ 
                                            backgroundColor: '#ee4d2d', 
                                            color: '#fff', 
                                            fontSize: '11px', 
                                            fontWeight: 600, 
                                            padding: '2px 4px', 
                                            borderRadius: '2px',
                                            marginLeft: '8px',
                                            textTransform: 'uppercase'
                                        }}>
                                            {discountPercent}% GIẢM
                                        </span>
                                    )}
                                </div>

                                {/* Delivery row */}
                                <div style={{ display: 'flex', marginBottom: '24px', fontSize: '14px', alignItems: 'flex-start' }}>
                                    <div style={{ color: '#757575', width: '110px', flexShrink: 0 }}>Vận chuyển:</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CarOutlined style={{ color: '#26AA99', fontSize: '20px' }} />
                                            <span style={{ fontWeight: 500, color: 'rgba(0,0,0,.8)' }}>Miễn phí vận chuyển</span>
                                        </div>
                                        <div style={{ color: '#757575', fontSize: '13px' }}>
                                            Miễn phí vận chuyển cho đơn hàng từ 1.000.000₫
                                        </div>
                                    </div>
                                </div>

                                {/* Sizes selection */}
                                {product.sizes && product.sizes.trim() && (
                                    <div style={{ display: 'flex', marginBottom: '24px', alignItems: 'center' }}>
                                        <div style={{ color: '#757575', fontSize: '14px', width: '110px', flexShrink: 0 }}>Kích cỡ:</div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {product.sizes.split(',').map(s => s.trim()).filter(Boolean).map(s => {
                                                const disabled = isSizeDisabled(s);
                                                return (
                                                    <Button
                                                        key={s}
                                                        disabled={disabled}
                                                        style={{ 
                                                            borderRadius: '2px', 
                                                            minWidth: '60px', 
                                                            height: '40px',
                                                            border: selectedSize === s ? '1px solid #ee4d2d' : '1px solid rgba(0,0,0,.09)',
                                                            backgroundColor: '#fff',
                                                            color: selectedSize === s ? '#ee4d2d' : 'rgba(0,0,0,.8)',
                                                            fontWeight: selectedSize === s ? 500 : 400,
                                                            opacity: disabled ? 0.4 : 1,
                                                            boxShadow: 'none'
                                                        }}
                                                        onClick={() => setSelectedSize(s)}
                                                    >
                                                        {s}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Colors selection */}
                                {product.colors && product.colors.trim() && (
                                    <div style={{ display: 'flex', marginBottom: '24px', alignItems: 'center' }}>
                                        <div style={{ color: '#757575', fontSize: '14px', width: '110px', flexShrink: 0 }}>Màu sắc:</div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {product.colors.split(',').map(c => c.trim()).filter(Boolean).map(c => {
                                                const disabled = isColorDisabled(c);
                                                return (
                                                    <Button
                                                        key={c}
                                                        disabled={disabled}
                                                        style={{ 
                                                            borderRadius: '2px', 
                                                            height: '40px',
                                                            padding: '0 16px',
                                                            border: selectedColor === c ? '1px solid #ee4d2d' : '1px solid rgba(0,0,0,.09)',
                                                            backgroundColor: '#fff',
                                                            color: selectedColor === c ? '#ee4d2d' : 'rgba(0,0,0,.8)',
                                                            fontWeight: selectedColor === c ? 500 : 400,
                                                            opacity: disabled ? 0.4 : 1,
                                                            boxShadow: 'none'
                                                        }}
                                                        onClick={() => handleColorSelect(c)}
                                                    >
                                                        {c}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Buy / AddToCart Button Panel */}
                                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #efefef' }}>
                                    <AddToCartButton
                                        product={product}
                                        size="large"
                                        showQuantity={true}
                                        selectedSize={selectedSize}
                                        selectedColor={selectedColor}
                                        disabled={stockQuantity <= 0}
                                        layout="detail"
                                        stock={stockQuantity}
                                    />
                                    {stockQuantity === 0 && (
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#FEF2F2',
                                            borderRadius: '2px',
                                            marginTop: '16px',
                                            textAlign: 'center',
                                            border: '1px solid #FCA5A5'
                                        }}>
                                            <Text style={{ color: '#EF4444', fontWeight: 500, fontSize: '13px' }}>
                                                Sản phẩm hiện đang tạm hết hàng ở biến thể đã chọn. Vui lòng chọn biến thể khác!
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Product Description Details Card */}
                <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', marginBottom: '60px', overflow: 'hidden' }} styles={{ body: { padding: '32px' } }}>
                    <Title level={3} style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', textTransform: 'uppercase', color: '#222', borderBottom: '1px solid #f5f5f5', paddingBottom: '12px' }}>
                        Chi tiết sản phẩm
                    </Title>
                    <Paragraph style={{ fontSize: '15px', color: '#4B5563', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>
                        {product.description || 'Sản phẩm này chưa có mô tả chi tiết.'}
                    </Paragraph>
                </Card>

                {/* Reviews Section */}
                <div style={{ marginBottom: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
                        <Title level={3} style={{ margin: 0, fontWeight: 800, fontSize: '28px' }}>
                            Đánh giá từ khách hàng <span style={{ color: '#6B7280', fontWeight: 500 }}>({reviews.length})</span>
                        </Title>
                    </div>

                    <Row gutter={[40, 40]}>
                        <Col xs={24} lg={8}>
                            <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                                <Title level={4} style={{ marginBottom: '24px', fontWeight: 700 }}>Viết đánh giá của bạn</Title>
                                {!user ? (
                                    <div style={{ textAlign: 'center', padding: '24px 12px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
                                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
                                        <Text type="secondary" style={{ display: 'block', fontSize: '14px', lineHeight: 1.5, marginBottom: '16px' }}>
                                            Vui lòng đăng nhập để viết đánh giá cho sản phẩm này.
                                        </Text>
                                        <Button 
                                            type="primary" 
                                            onClick={() => navigate('/login', { state: { from: location.pathname } })}
                                            style={{ backgroundColor: '#ee4d2d', borderColor: '#ee4d2d', borderRadius: '4px' }}
                                        >
                                            Đăng nhập ngay
                                        </Button>
                                    </div>
                                ) : hasOrdered ? (
                                    <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
                                        <Form.Item name="rating" label={<span style={{ fontWeight: 600 }}>Chất lượng sản phẩm</span>} rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}>
                                            <Rate style={{ fontSize: '24px', color: '#F59E0B' }} />
                                        </Form.Item>
                                        <Form.Item name="comment" label={<span style={{ fontWeight: 600 }}>Nhận xét chi tiết</span>} rules={[{ required: true, message: 'Vui lòng nhập trải nghiệm của bạn' }]}>
                                            <TextArea rows={5} placeholder="Chia sẻ cảm nhận của bạn về chất liệu, kiểu dáng..." style={{ borderRadius: '12px', padding: '12px' }} />
                                        </Form.Item>
                                        <Button type="primary" htmlType="submit" size="large" loading={submittingReview} style={{ width: '100%', borderRadius: '12px', height: '48px', backgroundColor: '#111827', fontWeight: 600 }}>
                                            Gửi đánh giá
                                        </Button>
                                    </Form>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '24px 12px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
                                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
                                        <Text type="secondary" style={{ display: 'block', fontSize: '14px', lineHeight: 1.5 }}>
                                            Chỉ những khách hàng đã mua sản phẩm này mới có thể viết đánh giá.
                                        </Text>
                                    </div>
                                )}
                            </Card>
                        </Col>
                        
                        <Col xs={24} lg={16}>
                            {reviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: 'white', borderRadius: '20px', border: '1px dashed #D1D5DB' }}>
                                    <Text style={{ color: '#6B7280', fontSize: '16px' }}>Chưa có đánh giá nào cho sản phẩm này.<br/>Hãy là người đầu tiên chia sẻ cảm nhận!</Text>
                                </div>
                            ) : (
                                <>
                                    {/* Shopee-style Rating Filter Bar */}
                                    <div style={{ 
                                        backgroundColor: '#fffbf8', 
                                        border: '1px solid #f9ede5', 
                                        padding: '24px', 
                                        borderRadius: '8px', 
                                        marginBottom: '24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '24px', fontWeight: 600, color: '#ee4d2d' }}>{averageRating.toFixed(1)}</span>
                                            <span style={{ fontSize: '14px', color: '#ee4d2d', marginTop: '6px' }}>trên 5</span>
                                            <Rate disabled allowHalf value={averageRating} style={{ fontSize: '16px', color: '#ee4d2d', marginLeft: '12px' }} />
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <Button 
                                                onClick={() => setRatingFilter('all')}
                                                style={{
                                                    height: '32px',
                                                    padding: '0 16px',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    border: ratingFilter === 'all' ? '1px solid #ee4d2d' : '1px solid rgba(0,0,0,.09)',
                                                    backgroundColor: '#fff',
                                                    color: ratingFilter === 'all' ? '#ee4d2d' : 'rgba(0,0,0,.8)',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                Tất Cả ({totalReviewsCount})
                                            </Button>
                                            <Button 
                                                onClick={() => setRatingFilter('5')}
                                                style={{
                                                    height: '32px',
                                                    padding: '0 16px',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    border: ratingFilter === '5' ? '1px solid #ee4d2d' : '1px solid rgba(0,0,0,.09)',
                                                    backgroundColor: '#fff',
                                                    color: ratingFilter === '5' ? '#ee4d2d' : 'rgba(0,0,0,.8)',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                5 Sao ({count5})
                                            </Button>
                                            <Button 
                                                onClick={() => setRatingFilter('4')}
                                                style={{
                                                    height: '32px',
                                                    padding: '0 16px',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    border: ratingFilter === '4' ? '1px solid #ee4d2d' : '1px solid rgba(0,0,0,.09)',
                                                    backgroundColor: '#fff',
                                                    color: ratingFilter === '4' ? '#ee4d2d' : 'rgba(0,0,0,.8)',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                4 Sao ({count4})
                                            </Button>
                                            <Button 
                                                onClick={() => setRatingFilter('3')}
                                                style={{
                                                    height: '32px',
                                                    padding: '0 16px',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    border: ratingFilter === '3' ? '1px solid #ee4d2d' : '1px solid rgba(0,0,0,.09)',
                                                    backgroundColor: '#fff',
                                                    color: ratingFilter === '3' ? '#ee4d2d' : 'rgba(0,0,0,.8)',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                3 Sao ({count3})
                                            </Button>
                                            <Button 
                                                onClick={() => setRatingFilter('2')}
                                                style={{
                                                    height: '32px',
                                                    padding: '0 16px',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    border: ratingFilter === '2' ? '1px solid #ee4d2d' : '1px solid rgba(0,0,0,.09)',
                                                    backgroundColor: '#fff',
                                                    color: ratingFilter === '2' ? '#ee4d2d' : 'rgba(0,0,0,.8)',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                2 Sao ({count2})
                                            </Button>
                                            <Button 
                                                onClick={() => setRatingFilter('1')}
                                                style={{
                                                    height: '32px',
                                                    padding: '0 16px',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    border: ratingFilter === '1' ? '1px solid #ee4d2d' : '1px solid rgba(0,0,0,.09)',
                                                    backgroundColor: '#fff',
                                                    color: ratingFilter === '1' ? '#ee4d2d' : 'rgba(0,0,0,.8)',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                1 Sao ({count1})
                                            </Button>
                                        </div>
                                    </div>

                                    {filteredReviews.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px 0', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
                                            <Text style={{ color: '#6B7280', fontSize: '15px' }}>Không có đánh giá nào cho phân loại sao đã chọn.</Text>
                                        </div>
                                    ) : (
                                        <List
                                            itemLayout="vertical"
                                            dataSource={filteredReviews}
                                            renderItem={item => (
                                                <Card bordered={false} style={{ marginBottom: '16px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} styles={{ body: { padding: '24px' } }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <Avatar size={48} icon={<UserOutlined />} src={item.user?.avatar} style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF' }} />
                                                            <div>
                                                                <div style={{ fontWeight: 600, fontSize: '16px', color: '#111827' }}>
                                                                    {item.user?.fullName || item.user?.username || 'Khách hàng ẩn danh'}
                                                                </div>
                                                                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                                                                    {new Date(item.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Rate disabled defaultValue={item.rating} style={{ fontSize: '16px', color: '#F59E0B' }} />
                                                    </div>
                                                    <Paragraph style={{ color: '#4B5563', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                                                        {item.comment}
                                                    </Paragraph>
                                                </Card>
                                            )}
                                        />
                                    )}
                                </>
                            )}
                        </Col>
                    </Row>
                </div>

                <Divider style={{ margin: '60px 0' }} />
                
                {/* Recently Viewed */}
                <RecentlyViewed />
            </div>
        </div>
    );
};

export default ProductDetailPage;
