import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Row, Col, Spin, message, Tag, Divider, Rate, List, Avatar, Input, Form } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, HeartOutlined, HeartFilled, UserOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import AddToCartButton from '@/components/AddToCartButton.jsx';
import { productService } from '@/services/product.service.js';
import { wishlistService } from '@/services/wishlist.service.js';
import { reviewService } from '@/services/review.service.js';
import { pushView } from '@/utils/recentViews.js';
import RecentlyViewed from '@/components/RecentlyViewed.jsx';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [activeImage, setActiveImage] = useState("");

    // Wishlist State
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Review State
    const [reviews, setReviews] = useState([]);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [form] = Form.useForm();

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

    useEffect(() => {
        if (id) {
            loadProduct();
            checkWishlistStatus();
            loadReviews();
        }
    }, [id]);

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
        if (wishlistLoading) return;
        setWishlistLoading(true);
        try {
            if (inWishlist) {
                await wishlistService.removeFromWishlist(id);
                setInWishlist(false);
                message.success('Đã bỏ khỏi danh sách yêu thích');
            } else {
                await wishlistService.addToWishlist(id);
                setInWishlist(true);
                message.success('Đã thêm vào danh sách yêu thích');
            }
        } catch (e) {
            message.error('Vui lòng đăng nhập để lưu sản phẩm');
        } finally {
            setWishlistLoading(false);
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
            message.error('Gửi đánh giá thất bại');
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

                <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '60px' }} bodyStyle={{ padding: 0 }}>
                    <Row gutter={[0, 0]}>
                        {/* Image Section */}
                        <Col xs={24} md={12} lg={14}>
                            <div style={{ backgroundColor: '#F3F4F6', height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                                <div style={{ minHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: '24px' }}>
                                    <img
                                        src={activeImage || 'https://via.placeholder.com/800x800?text=Chưa+có+ảnh'}
                                        alt={product.name}
                                        style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '16px', transition: 'transform 0.3s ease' }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </div>
                                {galleryImages.length > 1 && (
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {galleryImages.map((imgUrl, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    borderRadius: '8px',
                                                    border: activeImage === imgUrl ? '2px solid #4F46E5' : '2px solid transparent',
                                                    padding: '2px',
                                                    backgroundColor: '#FFFFFF',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                                    transition: 'all 0.2s ease',
                                                    overflow: 'hidden'
                                                }}
                                                onMouseEnter={() => setActiveImage(imgUrl)}
                                                onClick={() => setActiveImage(imgUrl)}
                                            >
                                                <img 
                                                    src={imgUrl} 
                                                    alt={`Thumbnail ${idx}`} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* Details Section */}
                        <Col xs={24} md={12} lg={10}>
                            <div style={{ padding: '40px 40px 40px 40px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <Text style={{ fontSize: '14px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                                            {product.factory || 'Thương Hiệu Riêng'}
                                        </Text>
                                        <Title level={1} style={{ margin: '8px 0 16px 0', fontSize: '32px', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                                            {product.name}
                                        </Title>
                                    </div>
                                    <Button
                                        type="text"
                                        shape="circle"
                                        size="large"
                                        icon={inWishlist ? <HeartFilled style={{ color: '#EF4444', fontSize: '28px' }} /> : <HeartOutlined style={{ fontSize: '28px', color: '#6B7280' }} />}
                                        loading={wishlistLoading}
                                        onClick={toggleWishlist}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <Text style={{ fontSize: '32px', color: '#4F46E5', fontWeight: 800 }}>
                                        {formatPrice(product.price)}
                                    </Text>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                    {product.categoryName && (
                                        <Tag style={{ padding: '4px 12px', fontSize: '14px', borderRadius: '16px', border: 'none', backgroundColor: '#F3F4F6', color: '#374151' }}>
                                            Mục: {product.categoryName}
                                        </Tag>
                                    )}
                                    <Tag color={stockQuantity > 0 ? '#10B981' : '#EF4444'} style={{ padding: '4px 12px', fontSize: '14px', borderRadius: '16px', border: 'none' }}>
                                        {stockQuantity > 0 ? `Còn ${stockQuantity} sản phẩm` : 'Hết hàng'}
                                    </Tag>
                                    {product.target && (
                                        <Tag style={{ padding: '4px 12px', fontSize: '14px', borderRadius: '16px', border: 'none', backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                                            {product.target}
                                        </Tag>
                                    )}
                                </div>

                                <Divider style={{ margin: '24px 0' }} />

                                {product.sizes && product.sizes.trim() && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '15px', color: '#374151', marginBottom: '8px' }}>Kích cỡ:</div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {product.sizes.split(',').map(s => s.trim()).filter(Boolean).map(s => {
                                                const disabled = isSizeDisabled(s);
                                                return (
                                                    <Button
                                                        key={s}
                                                        type={selectedSize === s ? 'primary' : 'default'}
                                                        disabled={disabled}
                                                        style={{ 
                                                            borderRadius: '8px', 
                                                            minWidth: '50px', 
                                                            height: '40px',
                                                            borderColor: selectedSize === s ? '#4F46E5' : '#D1D5DB',
                                                            backgroundColor: selectedSize === s ? '#4F46E5' : '#FFFFFF',
                                                            color: selectedSize === s ? '#FFFFFF' : '#374151',
                                                            fontWeight: selectedSize === s ? 600 : 400,
                                                            opacity: disabled ? 0.4 : 1
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

                                {product.colors && product.colors.trim() && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '15px', color: '#374151', marginBottom: '8px' }}>Màu sắc:</div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {product.colors.split(',').map(c => c.trim()).filter(Boolean).map(c => {
                                                const disabled = isColorDisabled(c);
                                                return (
                                                    <Button
                                                        key={c}
                                                        type={selectedColor === c ? 'primary' : 'default'}
                                                        disabled={disabled}
                                                        style={{ 
                                                            borderRadius: '8px', 
                                                            height: '40px',
                                                            padding: '0 16px',
                                                            borderColor: selectedColor === c ? '#4F46E5' : '#D1D5DB',
                                                            backgroundColor: selectedColor === c ? '#4F46E5' : '#FFFFFF',
                                                            color: selectedColor === c ? '#FFFFFF' : '#374151',
                                                            fontWeight: selectedColor === c ? 600 : 400,
                                                            opacity: disabled ? 0.4 : 1
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

                                <div style={{ flex: 1 }}>
                                    <Title level={4} style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Mô tả sản phẩm</Title>
                                    <Paragraph style={{ fontSize: '16px', color: '#4B5563', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                        {product.description || 'Sản phẩm này chưa có mô tả chi tiết.'}
                                    </Paragraph>
                                </div>

                                <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                                    <AddToCartButton
                                        product={product}
                                        size="large"
                                        showQuantity={true}
                                        selectedSize={selectedSize}
                                        selectedColor={selectedColor}
                                        disabled={stockQuantity <= 0}
                                    />
                                    {stockQuantity === 0 && (
                                        <div style={{
                                            padding: '16px',
                                            backgroundColor: '#FEF2F2',
                                            borderRadius: '12px',
                                            marginTop: '16px',
                                            textAlign: 'center'
                                        }}>
                                            <Text style={{ color: '#EF4444', fontWeight: 600 }}>
                                                Sản phẩm hiện đang tạm hết hàng ở biến thể đã chọn. Vui lòng chọn biến thể khác!
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
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
                            </Card>
                        </Col>
                        
                        <Col xs={24} lg={16}>
                            {reviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: 'white', borderRadius: '20px', border: '1px dashed #D1D5DB' }}>
                                    <Text style={{ color: '#6B7280', fontSize: '16px' }}>Chưa có đánh giá nào cho sản phẩm này.<br/>Hãy là người đầu tiên chia sẻ cảm nhận!</Text>
                                </div>
                            ) : (
                                <List
                                    itemLayout="vertical"
                                    dataSource={reviews}
                                    renderItem={item => (
                                        <Card bordered={false} style={{ marginBottom: '16px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} bodyStyle={{ padding: '24px' }}>
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
