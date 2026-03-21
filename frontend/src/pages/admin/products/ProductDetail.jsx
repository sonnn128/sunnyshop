import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '@/lib/api';
import Button from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastProvider';
import { ArrowLeft, Package, Pencil, Tag } from 'lucide-react';

const normalizeProduct = (product = {}) => {
  const normalizedId = product?._id ?? product?.id;
  return {
    ...product,
    _id: normalizedId,
    id: normalizedId,
    images: Array.isArray(product?.images) ? product.images : []
  };
};

const getPrimaryImage = (product) => {
  if (!product?.images || product.images.length === 0) return null;
  const first = product.images[0];
  if (typeof first === 'string') {
    const primaryString = product.images.find((img) => typeof img === 'string');
    return primaryString || null;
  }
  const primary = product.images.find((img) => img.is_primary);
  const resolved = primary || first;
  return resolved?.image_url || resolved?.imageUrl || resolved?.url || null;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price || 0);
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get(`/products/${id}`);
        const data = res?.data?.data ?? res?.data?.product ?? res?.data;
        if (mounted) {
          setProduct(data ? normalizeProduct(data) : null);
        }
      } catch (error) {
        toast.push({ title: 'Loi', message: 'Khong tai duoc san pham', type: 'error' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, toast]);

  const primaryImage = useMemo(() => getPrimaryImage(product), [product]);

  if (loading) {
    return (
      <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-elegant">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-2 text-muted-foreground">Dang tai...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-elegant">
        <div className="text-center py-12">
          <Package size={56} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Khong tim thay san pham</h3>
          <Button onClick={() => navigate('/admin?tab=products')}>Quay lai</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-elegant">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin?tab=products')}>
            <ArrowLeft size={16} />
            Quay lai
          </Button>
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Package className="text-primary" />
              Chi tiet san pham
            </h2>
            <p className="text-sm text-muted-foreground">{product.name}</p>
          </div>
        </div>
        <Link to={`/admin/products/${product._id}`}>
          <Button>
            <Pencil size={16} />
            Chinh sua
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-background border rounded-xl overflow-hidden">
            <div className="relative h-64 bg-muted">
              {primaryImage ? (
                <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={40} className="text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {product.images.map((img, index) => {
                const url = typeof img === 'string' ? img : (img.image_url || img.imageUrl || img.url);
                if (!url) return null;
                return (
                  <img
                    key={`${url}-${index}`}
                    src={url}
                    alt={`${product.name}-${index}`}
                    className="w-full h-20 object-cover rounded-lg border"
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-background border rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3">Thong tin co ban</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Ten san pham</p>
                <p className="font-semibold">{product.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Slug</p>
                <p className="font-semibold">/{product.slug}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gia</p>
                <p className="font-semibold text-primary">{formatPrice(product.price)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gia goc</p>
                <p className="font-semibold">{formatPrice(product.sale_price ?? product.salePrice ?? product.original_price ?? product.originalPrice)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ton kho</p>
                <p className="font-semibold">{product.stock_quantity ?? product.stockQuantity ?? 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trang thai</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  product.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : product.status === 'out_of_stock'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {product.status || 'inactive'}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground">Danh muc</p>
                <p className="font-semibold">{product.category?.name || '---'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Thuong hieu</p>
                <p className="font-semibold">{product.brand?.name || '---'}</p>
              </div>
            </div>
          </div>

          <div className="bg-background border rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Tag size={18} className="text-primary" />
              Mo ta
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {product.description || 'Chua co mo ta.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
