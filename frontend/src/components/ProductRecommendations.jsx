import React, { useState, useEffect } from 'react';
import { getRecommendations, getTrendingProducts } from '../lib/api';
import ProductCard from '../pages/product-catalog/components/ProductCard';
import cart from '../lib/cart';
import { useToast } from '../components/ui/ToastProvider';
import API from '../lib/api';
import { resolveQuickVariantSelection, summarizeVariantOptions } from '../lib/productVariants';

const ProductRecommendations = ({
  userId,
  productId,
  title = "Sản phẩm đề xuất",
  limit = 8,
  showTrending = false
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, [userId, productId, limit, showTrending]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (showTrending) {
        data = await getTrendingProducts({ limit });
      } else {
        data = await getRecommendations({ userId, productId, limit });
      }

      if (data.success) {
        const enrichedProducts = (data.data || []).map((product) => {
          const { sizes = [], colors = [] } = summarizeVariantOptions(product) || {};
          return {
            ...product,
            availableSizes: sizes.length ? sizes : product?.availableSizes || product?.sizes || [],
            availableColors: colors.length ? colors : product?.availableColors || product?.colors || []
          };
        });
        setRecommendations(enrichedProducts);
      } else {
        setError(data.message || 'Không thể tải đề xuất sản phẩm');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Lỗi khi tải đề xuất sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const selection = await resolveQuickVariantSelection(product);
      const productId = product?.id || product?._id || selection.productId;
      await cart.addItem({
        productId,
        name: product.name,
        price: selection.price || product.price,
        image: product.image || product.primaryImage,
        quantity: 1,
        variant_id: selection.variantId,
        selectedSize: selection.selectedSize,
        selectedColor: selection.selectedColor
      });
      toast.push({
        title: 'Thành công',
        message: `Đã thêm ${product.name} vào giỏ hàng`,
        type: 'success'
      });
    } catch (e) {
      console.error(e);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể thêm vào giỏ hàng',
        type: 'error'
      });
    }
  };

  const handleWishlistToggle = async (productId) => {
    // Basic implementation or placeholder if context not available
    try {
        await API.post('/api/wishlist/add', { product_id: productId });
        toast.push({
            title: 'Thành công',
            message: 'Đã thêm vào danh sách yêu thích',
            type: 'success'
        });
    } catch (e) {
        // If already exists or error
        toast.push({
            title: 'Thông báo',
            message: 'Sản phẩm có thể đã có trong danh sách yêu thích',
            type: 'info'
        });
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            showRating={true}
            showSoldCount={showTrending}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
            onQuickView={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;