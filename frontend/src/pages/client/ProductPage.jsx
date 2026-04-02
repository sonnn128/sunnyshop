import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Row, Col, Spin, message, Input, Select, Pagination, Slider, Checkbox, Empty, Rate } from 'antd';
import { ShoppingCartOutlined, ThunderboltFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from '@/components/AddToCartButton.jsx';
import { productService } from '@/services/product.service.js';
import { categoryService } from '@/services/category.service.js';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [factories, setFactories] = useState([]);
    const [selectedFactories, setSelectedFactories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000000]);

    const pageSize = 12;
    const navigate = useNavigate();

    // Fetch available factories
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const res = await productService.getFactories();
                setFactories(res || []);
            } catch (e) {
                console.error(e);
            }
        };
        fetchMeta();
    }, []);

    // Load products with filters
    const loadProducts = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage - 1,
                size: pageSize,
                sortBy: sortBy, // Fixed param name
                sortDir: sortOrder, // Fixed param name
                keyword: searchTerm,
                factory: selectedFactories,
                minPrice: priceRange[0],
                maxPrice: priceRange[1]
            };

            const result = await productService.filter(params);
            const data = result.data || result;

            if (data.content) {
                const filtered = data.content.filter(p => (p.quantity ?? p.stock ?? 0) > 0);
                setProducts(filtered);
                setTotalProducts(data.totalElements);
            } else {
                setProducts([]);
                setTotalProducts(0);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            message.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // Debounce effect for search and filters
    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm, selectedFactories, priceRange, sortBy, sortOrder]);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={24}>
                {/* Sidebar Filter */}
                <Col xs={24} md={6} lg={6} xl={5}>
                    <Card
                        title={<span style={{ fontSize: '20px', fontWeight: 800 }}>Bộ lọc tìm kiếm</span>}
                        style={{ marginBottom: 24, borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: 'none' }}
                        headStyle={{ borderBottom: '1px solid #F3F4F6', padding: '20px 24px' }}
                        bodyStyle={{ padding: '24px' }}
                    >
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ fontWeight: 700, marginBottom: 12, color: '#374151', fontSize: '15px' }}>Từ khóa</div>
                            <Search
                                placeholder="Tìm theo tên sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                size="large"
                                style={{ borderRadius: '8px' }}
                            />
                        </div>

                        <div style={{ marginBottom: 28 }}>
                            <div style={{ fontWeight: 700, marginBottom: 24, color: '#374151', fontSize: '15px' }}>Khoảng giá</div>
                            <Slider
                                range
                                min={0}
                                max={10000000}
                                step={500000}
                                marks={{
                                    0: '0',
                                    2000000: '2tr',
                                    4000000: '4tr',
                                    6000000: '6tr',
                                    8000000: '8tr',
                                    10000000: '10tr'
                                }}
                                defaultValue={[0, 10000000]}
                                onChange={(val) => {
                                    setPriceRange(val);
                                    setCurrentPage(1);
                                }}
                                tooltip={{ formatter: (value) => formatPrice(value) }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: '14px', fontWeight: 600, color: '#4F46E5' }}>
                                <span>{formatPrice(priceRange[0])}</span>
                                <span>{formatPrice(priceRange[1])}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <div style={{ fontWeight: 700, marginBottom: 12, color: '#374151', fontSize: '15px' }}>Thương hiệu</div>
                            <Checkbox.Group
                                options={factories}
                                value={selectedFactories}
                                onChange={(val) => {
                                    setSelectedFactories(val);
                                    setCurrentPage(1);
                                }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                            />
                        </div>

                        <Button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedFactories([]);
                                setPriceRange([0, 10000000]);
                                setCurrentPage(1);
                            }}
                            block
                            size="large"
                            style={{ borderRadius: '12px', fontWeight: 600, color: '#6B7280', borderColor: '#D1D5DB' }}
                        >
                            Xóa bộ lọc
                        </Button>
                    </Card>
                </Col>

                {/* Product List */}
                <Col xs={24} md={18} lg={18} xl={19}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <Title level={2} style={{ margin: 0, fontWeight: 800, fontSize: '28px' }}>Tất cả sản phẩm</Title>
                        <Select
                            defaultValue="id_desc"
                            style={{ width: 200 }}
                            size="large"
                            onChange={(val) => {
                                const [s, o] = val.split('_');
                                setSortBy(s);
                                setSortOrder(o);
                            }}
                        >
                            <Option value="id_desc">Cũ nhất - Mới nhất</Option>
                            <Option value="price_asc">Giá: Thấp đến Cao</Option>
                            <Option value="price_desc">Giá: Cao đến Thấp</Option>
                        </Select>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <Spin size="large" />
                        </div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: 'white', borderRadius: '20px' }}>
                            <Empty description="Không tìm thấy sản phẩm nào phù hợp" />
                        </div>
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {products.map(product => {
                                    // MOCK UI DATA based on product ID for visual presentation
                                    const rating = 4 + (product.id ? (product.id % 2) / 2 : 0);
                                    const discountPercent = product.id && product.id % 3 !== 0 ? 15 + (product.id % 5) * 10 : 0;
                                    const oldPrice = discountPercent > 0 ? product.price * (100 / (100 - discountPercent)) : null;
                                    const isSellingFast = product.id && product.id % 2 === 0;

                                    return (
                                        <Col xs={24} sm={12} lg={8} xl={8} key={product.id}>
                                            <Card
                                                hoverable
                                                style={{ borderRadius: '20px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                                                bodyStyle={{ padding: '16px' }}
                                                cover={
                                                    <div style={{ overflow: 'hidden', padding: '16px', backgroundColor: '#F9FAFB', position: 'relative' }}>
                                                        {discountPercent > 0 && (
                                                            <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: '#FEF08A', color: '#B45309', padding: '4px 8px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', zIndex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <ThunderboltFilled style={{ color: '#EAB308' }} />
                                                                -{discountPercent}%
                                                            </div>
                                                        )}
                                                        <img
                                                            alt={product.name}
                                                            src={product.image || 'https://via.placeholder.com/300x200'}
                                                            style={{ height: 200, width: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                            onClick={() => handleProductClick(product.id)}
                                                        />
                                                    </div>
                                                }
                                            >
                                                <div onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 700, fontSize: '15px', marginBottom: '8px', color: '#111827' }}>
                                                    {product.name}
                                                </div>
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                    <Rate disabled defaultValue={rating} style={{ fontSize: '12px', color: '#FBBF24' }} />
                                                </div>

                                                <div style={{ minHeight: '24px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    {oldPrice && (
                                                        <Text delete style={{ color: '#9CA3AF', fontSize: '13px' }}>
                                                            {formatPrice(oldPrice)}
                                                        </Text>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                                                    <Text strong style={{ color: '#EF4444', fontSize: '22px', lineHeight: 1 }}>
                                                        {formatPrice(product.price)}
                                                    </Text>
                                                    <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>
                                                        {product.factory || 'No Brand'}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{
                                                        background: isSellingFast ? 'linear-gradient(90deg, #FECACA 0%, #FFEDD5 100%)' : '#F3F4F6',
                                                        borderLeft: isSellingFast ? '4px solid #EF4444' : '4px solid #D1D5DB',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        color: isSellingFast ? '#DC2626' : '#6B7280',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {isSellingFast ? 'ĐANG BÁN CHẠY' : 'SẴN HÀNG'}
                                                    </div>
                                                    
                                                    <AddToCartButton product={product} size="middle" compact showQuantity={false} />
                                                </div>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>

                            {totalProducts > pageSize && (
                                <div style={{ textAlign: 'center', marginTop: 24 }}>
                                    <Pagination
                                        current={currentPage}
                                        total={totalProducts}
                                        pageSize={pageSize}
                                        onChange={setCurrentPage}
                                        showSizeChanger={false}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ProductPage;
