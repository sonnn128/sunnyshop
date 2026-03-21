import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useToast } from '../../../components/ui/ToastProvider';
import { useWishlist } from '../../../contexts/WishlistContext';
import cart from '../../../lib/cart';
import API from '../../../lib/api';

const WishlistSection = () => {
  const toast = useToast();
  const { wishlistItems, removeFromWishlist, refreshWishlist, isLoading } = useWishlist();
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [productStockMap, setProductStockMap] = useState({}); // Map product_id -> stock info

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fetch stock info from database for all wishlist products
  useEffect(() => {
    const fetchStockInfo = async () => {
      if (!wishlistItems || wishlistItems.length === 0) return;

      try {
        // Get all unique product IDs (handles populated or raw ObjectId)
        const productIds = Array.from(new Set(
          wishlistItems
            .map(item => item.product_id?._id || item.product_id)
            .filter(Boolean)
            .map(String)
        ));

        if (productIds.length === 0) return;

        // Fetch products from API and build a map keyed by string id
        const stockMap = {};
        await Promise.all(
          productIds.map(async (pid) => {
            const productIdStr = String(pid);
            try {
                // Prefer using the populated product from wishlist response when available
                const wishItem = wishlistItems.find(it => String(it.product_id?._id || it.product_id) === productIdStr || String(it.product?._id || it.product_id) === productIdStr);
                const populated = wishItem?.product || wishItem?.product_id || null;
                let product = populated || null;
                // If not fully populated, fetch details
                if (!product || !product.images || product.images.length === 0 || product.primaryImage === undefined) {
                  const res = await API.get(`/api/products/${productIdStr}`);
                  product = res?.data?.product || res?.data || product;
                }
              if (product) {
                stockMap[productIdStr] = {
                  stock_quantity: product.stock_quantity || 0,
                  status: product.status || 'active',
                  inStock: product.status === 'active' && (product.stock_quantity || 0) > 0,
                  primaryImage: product.primaryImage || (Array.isArray(product?.images) && (product.images[0]?.image_url || product.images[0]?.url || product.images[0])) || null,
                };
              }
            } catch (err) {
              console.warn(`Failed to fetch product ${productIdStr}:`, err);
              // Default to out of stock if fetch fails
              stockMap[productIdStr] = {
                stock_quantity: 0,
                status: 'inactive',
                inStock: false,
                primaryImage: null,
              };
            }
          })
        );

        setProductStockMap(stockMap);
      } catch (error) {
        console.error('Error fetching stock info:', error);
      }
    };

    fetchStockInfo();
  }, [wishlistItems]);

  // Map wishlist items from context to display format
  const displayItems = wishlistItems.map(item => {
    const productId = String(item.product_id?._id || item.product_id || '');
    const stockInfo = productStockMap[productId] || {
      stock_quantity: 0,
      status: 'inactive',
      inStock: false
    };
    
    const populatedProduct = item.product || item?.product_id;
    const resolvedImage = item.snapshot?.image || populatedProduct?.primaryImage || (stockInfo && stockInfo.primaryImage) || null;
    // eslint-disable-next-line no-console
    console.debug('[Wishlist Debug] product', productId, 'snapshotImage', item.snapshot?.image, 'fetchedPrimary', stockInfo?.primaryImage, 'final', resolvedImage);
    return {
      id: productId,
      productId: productId, // For linking to product detail
      name: item.snapshot?.name || 'Sản phẩm',
      brand: item.snapshot?.brand,
      image: resolvedImage,
      price: item.snapshot?.price || 0,
      originalPrice: item.snapshot?.originalPrice,
      category: item.snapshot?.category,
      size: item.snapshot?.size,
      color: item.snapshot?.color,
      stock_quantity: stockInfo.stock_quantity,
      status: stockInfo.status,
      inStock: stockInfo.inStock,
      addedDate: item.created_at || item.createdAt
    };
  });

  // Handle remove single item
  const handleRemoveItem = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteConfirm(true);
  };

  const confirmRemoveItem = async () => {
    if (!itemToDelete) return;

    try {
      await removeFromWishlist(itemToDelete);
      setSelectedItems(prev => prev?.filter(id => id !== itemToDelete));
      toast.push({
        title: 'Đã xóa',
        message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
        type: 'success'
      });
    } catch (e) {
      console.error('Remove item error:', e);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể xóa sản phẩm',
        type: 'error'
      });
    } finally {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev?.includes(itemId) 
        ? prev?.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems?.length === displayItems?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(displayItems?.map(item => item?.id));
    }
  };

  const handleRemoveSelected = () => {
    setShowDeleteAllConfirm(true);
  };

  const confirmRemoveSelected = async () => {
    if (selectedItems.length === 0) return;

    try {
      // Remove all selected items
      await Promise.all(
        selectedItems.map(itemId => removeFromWishlist(itemId))
      );
      
      setSelectedItems([]);
      toast.push({
        title: 'Đã xóa',
        message: `Đã xóa ${selectedItems.length} sản phẩm khỏi danh sách yêu thích`,
        type: 'success'
      });
    } catch (e) {
      console.error('Remove selected error:', e);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể xóa một số sản phẩm',
        type: 'error'
      });
    } finally {
      setShowDeleteAllConfirm(false);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      // Tạo object giống như ProductInfo để cart.addItem() có thể merge đúng
      await cart.addItem({
        id: item.productId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        selectedSize: item.size || null,
        selectedColor: item.color || null,
        quantity: 1
      });
      
      toast.push({
        title: 'Thành công!',
        message: `Đã thêm "${item.name}" vào giỏ hàng`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.push({
        title: 'Có lỗi xảy ra',
        message: 'Không thể thêm sản phẩm vào giỏ hàng',
        type: 'error'
      });
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-foreground">Danh sách yêu thích</h2>
            <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-sm font-medium">
              {displayItems?.length} sản phẩm
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <Icon name="Grid3X3" size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <Icon name="List" size={16} />
              </Button>
            </div>
            
            {/* Bulk Actions */}
            {displayItems?.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedItems?.length === displayItems?.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Button>
                
                {selectedItems?.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    iconName="Trash2"
                    iconPosition="left"
                    onClick={handleRemoveSelected}
                  >
                    Xóa ({selectedItems?.length})
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={48} className="mx-auto text-muted-foreground mb-4 animate-spin" />
            <p className="text-muted-foreground">Đang tải danh sách yêu thích...</p>
          </div>
        ) : displayItems?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Heart" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Danh sách yêu thích trống</h3>
            <p className="text-muted-foreground mb-4">Hãy thêm những sản phẩm bạn yêu thích để dễ dàng theo dõi</p>
            <Link to="/product-catalog">
              <Button variant="default" iconName="ShoppingBag" iconPosition="left">
                Khám phá sản phẩm
              </Button>
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
            : "space-y-4"
          }>
            {displayItems?.map((item) => (
            <div
              key={item?.id}
              className={`border border-border rounded-lg overflow-hidden hover:shadow-elegant transition-smooth ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Product Image with Link */}
              <Link 
                to={`/product-detail?id=${item?.productId}`}
                className={`relative block ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'}`}
              >
                <div className="w-full h-full overflow-hidden">
                  <Image
                    src={item?.image}
                    alt={item?.name}
                    className="w-full h-full object-cover hover:scale-105 transition-smooth"
                  />
                </div>
                
                {/* Discount Badge */}
                {item?.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-error text-error-foreground px-2 py-1 rounded-full text-xs font-medium">
                    -{item?.discount}%
                  </div>
                )}
                
                {/* Stock Status Badge */}
                {!item?.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-error text-error-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Hết hàng
                    </span>
                  </div>
                )}
                
                {item?.inStock && (
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Còn hàng
                    </span>
                  </div>
                )}
              </Link>
              
              {/* Selection Checkbox */}
              <div className="absolute top-2 right-2">
                <input
                  type="checkbox"
                  checked={selectedItems?.includes(item?.id)}
                  onChange={() => handleSelectItem(item?.id)}
                  className="w-4 h-4 text-accent focus:ring-accent rounded"
                />
              </div>

              {/* Product Info */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className={viewMode === 'list' ? 'flex justify-between items-start' : ''}>
                  <div className={viewMode === 'list' ? 'flex-1 pr-4' : ''}>
                    {/* Product Name with Link */}
                    <Link 
                      to={`/product-detail?id=${item?.productId}`}
                      className="block hover:text-primary transition-colors"
                    >
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2">{item?.name}</h3>
                    </Link>
                    
                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-accent">{formatPrice(item?.price)}</span>
                      {item?.originalPrice > item?.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item?.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="text-xs text-muted-foreground mb-3 space-y-1">
                      {item?.size && <p>Kích thước: {item.size}</p>}
                      {item?.color && <p>Màu sắc: {item.color}</p>}
                      <p>Thêm vào: {formatDate(item?.addedDate)}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className={`flex ${viewMode === 'list' ? 'flex-col space-y-2' : 'space-x-2'}`}>
                    <Button
                      variant={item?.inStock ? "default" : "outline"}
                      size="sm"
                      iconName="ShoppingCart"
                      iconPosition="left"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item?.inStock}
                      className={viewMode === 'grid' ? 'flex-1' : ''}
                    >
                      {item?.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item?.id)}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Confirm Delete Single Item Modal */}
    <ConfirmModal
      isOpen={showDeleteConfirm}
      onClose={() => {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      }}
      onConfirm={confirmRemoveItem}
      title="Xóa sản phẩm?"
      message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?"
      type="danger"
      confirmText="Xóa"
      cancelText="Hủy"
    />

    {/* Confirm Delete Selected Items Modal */}
    <ConfirmModal
      isOpen={showDeleteAllConfirm}
      onClose={() => setShowDeleteAllConfirm(false)}
      onConfirm={confirmRemoveSelected}
      title="Xóa các sản phẩm đã chọn?"
      message={`Bạn có chắc chắn muốn xóa ${selectedItems.length} sản phẩm đã chọn khỏi danh sách yêu thích?`}
      type="danger"
      confirmText="Xóa tất cả"
      cancelText="Hủy"
    />
  </>
  );
};

export default WishlistSection;