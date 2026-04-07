import React, { useEffect, useState } from 'react';
import { Tag, Spin, theme } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../config/api.js';

const CategoryStrip = () => {
  const { token } = theme.useToken();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get('/categories');
        const data = res.data.data || res.data;
        if (!mounted) return;
        setCategories(Array.isArray(data) ? data : (data.content || []));
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{ padding: '8px 24px' }}><Spin size="small" /></div>;

  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (catId) => {
    if (activeCategory == catId) {
      // Click lần 2 - xóa filter
      navigate('/products');
    } else {
      // Click lần 1 - chọn danh mục
      navigate(`/products?category=${catId}`);
    }
  };

  return (
    <div style={{ padding: '8px 24px', background: token.colorBgContainer, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <Tag
            key={cat.id}
            color={activeCategory == cat.id ? "blue" : "default"}
            style={{ cursor: 'pointer', fontWeight: activeCategory == cat.id ? '600' : '400' }}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.name}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default CategoryStrip;
