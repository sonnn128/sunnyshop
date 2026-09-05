import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/format';
import { Card, Typography, Button, Row, Col, Spin, message, Input, Select, Pagination, Slider, Checkbox, Empty, Rate } from 'antd';
import { ShoppingCartOutlined, ThunderboltFilled } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AddToCartButton from '@/components/AddToCartButton.jsx';
import { productService } from '@/services/product.service.js';
import { brandService } from '@/services/brand.service.js';
import { targetService } from '@/services/target.service.js';
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

    const [searchParams] = useSearchParams();

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [brands, setBrands] = useState([]);
    const [targets, setTargets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [rawCategories, setRawCategories] = useState([]);

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedTargets, setSelectedTargets] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 50000000]);
    const [selectedRating, setSelectedRating] = useState(null);

    // Sync selected filters from URL search params
    useEffect(() => {
        const catParam = searchParams.get('category');
        const br = searchParams.get('brand');
        const tg = searchParams.get('target');

        const resolvedCategories = catParam
            ? catParam.split(',').map((value) => {
                const asNumber = Number(value);
                if (!Number.isNaN(asNumber)) {
                    return asNumber;
                }
                const match = rawCategories.find((c) => c.name === value || c.slug === value);
                return match ? match.id : null;
            }).filter((value) => value !== null)
            : [];

        setSelectedCategories(resolvedCategories);
        setSelectedBrands(br ? [br] : []);
        setSelectedTargets(tg ? [tg] : []);

        // When url param changes, it resets pagination
        setCurrentPage(1);
    }, [searchParams, rawCategories]);

    const pageSize = 12;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const resBrands = await brandService.getAll();
                const brData = resBrands.data || resBrands || [];
                setBrands(brData.map(b => ({ label: b.name, value: b.name })));

                const resTargets = await targetService.getAll();
                const tgData = resTargets.data || resTargets || [];
                setTargets(tgData.map(t => ({ label: t.name, value: t.name })));

                const resCats = await categoryService.getAll();
                const catData = resCats.data || resCats || [];
                setRawCategories(catData);
                setCategories(catData.map(c => ({ label: c.name, value: c.id })));
            } catch (e) {
                console.error(e);
            }
        };
        fetchFilters();
    }, []);

    // Load products with filters
    const loadProducts = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage - 1,
                size: pageSize,
                sortBy: sortBy,
                sortDir: sortOrder,
                keyword: searchTerm,
                factory: selectedBrands,
                target: selectedTargets,
                category: selectedCategories,
                minPrice: priceRange[0],
                maxPrice: priceRange[1]
            };

            const result = await productService.filter(params);
            const data = result.data || result;

            if (data.content) {
                let filtered = data.content.filter(p => (p.quantity ?? p.stock ?? 0) > 0);
                if (selectedRating !== null) {
                    filtered = filtered.filter(p => {
                        const rating = 1 + (p.id ? (p.id % 5) : 4);
                        return rating >= selectedRating;
                    });
                }
                setProducts(filtered);
                setTotalProducts(filtered.length);
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
    }, [currentPage, searchTerm, selectedBrands, selectedTargets, selectedCategories, priceRange, sortBy, sortOrder, selectedRating]);

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
                                max={50000000}
                                step={500000}
                                marks={{
                                    0: '0',
                                    10000000: '10tr',
                                    20000000: '20tr',
                                    30000000: '30tr',
                                    40000000: '40tr',
                                    50000000: '50tr'
                                }}
                                defaultValue={[0, 50000000]}
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
                                options={brands}
                                value={selectedBrands}
                                onChange={(val) => {
                                    setSelectedBrands(val);
                                    setCurrentPage(1);
                                }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                            />
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <div style={{ fontWeight: 700, marginBottom: 12, color: '#374151', fontSize: '15px' }}>Đối tượng</div>
                            <Checkbox.Group
                                options={targets}
                                value={selectedTargets}
                                onChange={(val) => {
                                    setSelectedTargets(val);
                                    setCurrentPage(1);
                                }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                            />
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <div style={{ fontWeight: 700, marginBottom: 12, color: '#374151', fontSize: '15px' }}>Danh mục</div>
                            <Checkbox.Group
                                options={categories}
                                value={selectedCategories}
                                onChange={(val) => {
                                    setSelectedCategories(val);
                                    setCurrentPage(1);
                                }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                            />
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <div style={{ fontWeight: 700, marginBottom: 12, color: '#374151', fontSize: '15px' }}>Đánh giá</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { value: null, label: 'Tất cả' },
                                    { value: 5, label: '⭐⭐⭐⭐⭐' },
                                    { value: 4, label: '⭐⭐⭐⭐ & lên' },
                                    { value: 3, label: '⭐⭐⭐ & lên' },
                                    { value: 2, label: '⭐⭐ & lên' },
                                    { value: 1, label: '⭐ & lên' }
                                ].map((item, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => {
                                            setSelectedRating(item.value);
                                            setCurrentPage(1);
                                        }}
                                        style={{ 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            padding: '6px 12px', 
                                            borderRadius: '6px',
                                            backgroundColor: selectedRating === item.value ? '#FFEAEA' : 'transparent',
                                            borderLeft: selectedRating === item.value ? '4px solid #EF4444' : '4px solid transparent',
                                            color: selectedRating === item.value ? '#EF4444' : '#4B5563',
                                            fontWeight: selectedRating === item.value ? 700 : 400,
                                            transition: 'all 0.2s',
                                            userSelect: 'none'
                                        }}
                                    >
                                        {item.value !== null ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Rate disabled defaultValue={item.value} style={{ fontSize: '11px', color: '#FBBF24' }} />
                                                {item.value < 5 && <span style={{ fontSize: '12px' }}>trở lên</span>}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '13px' }}>Tất cả đánh giá</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedBrands([]);
                                setSelectedTargets([]);
                                setSelectedCategories([]);
                                setPriceRange([0, 50000000]);
                                setSelectedRating(null);
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
                                    const rating = 1 + (product.id ? (product.id % 5) : 4);
                                    const discountPercent = product.id && product.id % 3 !== 0 ? 15 + (product.id % 5) * 10 : 0;
                                    const oldPrice = discountPercent > 0 ? product.price * (100 / (100 - discountPercent)) : null;
                                    const isSellingFast = product.id && product.id % 2 === 0;

                                    return (
                                        <Col xs={24} sm={12} md={8} lg={6} xl={6} key={product.id}>
                                            <Card
                                                hoverable
                                                style={{ borderRadius: '16px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                                                bodyStyle={{ padding: '12px' }}
                                                cover={
                                                    <div style={{ overflow: 'hidden', backgroundColor: '#F9FAFB', position: 'relative' }}>
                                                        <img
                                                            alt={product.name}
                                                            src={product.image || 'https://via.placeholder.com/300x200'}
                                                            style={{ height: 220, width: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                            onClick={() => handleProductClick(product.id)}
                                                        />
                                                    </div>
                                                }
                                            >
                                                <div 
                                                    onClick={() => handleProductClick(product.id)} 
                                                    style={{ 
                                                        cursor: 'pointer', 
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        height: '40px',
                                                        lineHeight: '20px',
                                                        fontWeight: 700, 
                                                        fontSize: '14px', 
                                                        marginBottom: '4px', 
                                                        color: '#111827' 
                                                    }}
                                                >
                                                    {product.name}
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                                    <Rate disabled defaultValue={rating} style={{ fontSize: '11px', color: '#FBBF24' }} />
                                                </div>

                                                <div style={{ minHeight: '20px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    {oldPrice && (
                                                        <>
                                                            <Text delete style={{ color: '#9CA3AF', fontSize: '12px' }}>
                                                                {formatPrice(oldPrice)}
                                                            </Text>
                                                            <span style={{ 
                                                                backgroundColor: '#FEF08A', 
                                                                color: '#EA580C', 
                                                                fontSize: '10px', 
                                                                fontWeight: 700, 
                                                                padding: '2px 6px', 
                                                                borderRadius: '4px',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '2px',
                                                                lineHeight: 1
                                                            }}>
                                                                ⏰ -{discountPercent}%
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <Text strong style={{ color: '#EA580C', fontSize: '18px', fontWeight: 800, lineHeight: 1 }}>
                                                        {formatPrice(product.price)}
                                                    </Text>
                                                    <div style={{ width: '84px' }}>
                                                        <AddToCartButton product={product} size="small" compact showQuantity={false} onlyBuy={true} />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', minHeight: '22px' }}>
                                                    <div style={{
                                                        background: isSellingFast ? '#FFEAEA' : '#F3F4F6',
                                                        borderLeft: isSellingFast ? '4px solid #EF4444' : '4px solid #D1D5DB',
                                                        padding: '2px 8px',
                                                        borderRadius: '10px',
                                                        fontSize: '10px',
                                                        fontWeight: 700,
                                                        color: isSellingFast ? '#EF4444' : '#6B7280',
                                                        letterSpacing: '0.5px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center'
                                                     }}>
                                                        {isSellingFast ? 'ĐANG BÁN CHẠY' : 'SẴN HÀNG'}
                                                    </div>
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
