import React, { useState } from 'react';
import { Button, InputNumber, message, Space, Tooltip } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useCart } from '../contexts/CartContext.jsx';
import { useWishlist } from '../contexts/WishlistContext.jsx';
import { useNavigate } from 'react-router-dom';

const AddToCartButton = ({ product, size = 'default', showQuantity = true, style = {}, compact = false, selectedSize = "", selectedColor = "", disabled = false, onlyBuy = false, layout = "default", stock = null }) => {
  const { addToCart, loading } = useCart();
  const { items: wishlistItems, toggle: toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product) {
      message.error('Product not found');
      return;
    }

    if (quantity <= 0) {
      message.warning('Please select a valid quantity');
      return;
    }

    if (product.sizes && product.sizes.trim() && !selectedSize) {
      message.warning('Vui lòng chọn kích cỡ (size)');
      return;
    }

    if (product.colors && product.colors.trim() && !selectedColor) {
      message.warning('Vui lòng chọn màu sắc');
      return;
    }

    try {
      setAdding(true);
      const result = await addToCart(product, quantity, selectedSize, selectedColor);

      if (result.success) {
        message.success(`Đã thêm ${product.name} vào giỏ hàng!`);
        setQuantity(1); // Reset quantity after adding
      } else {
        message.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      message.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (product.sizes && product.sizes.trim() && !selectedSize) {
      message.warning('Vui lòng chọn kích cỡ (size)');
      return;
    }

    if (product.colors && product.colors.trim() && !selectedColor) {
      message.warning('Vui lòng chọn màu sắc');
      return;
    }

    // Add to cart then navigate to checkout
    try {
      setAdding(true);
      const result = await addToCart(product, quantity, selectedSize, selectedColor);
      if (result.success) {
        navigate('/checkout');
      } else {
        message.error(result.error || 'Failed to add to cart');
      }
    } catch (e) {
      message.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const isInWishlist = wishlistItems.some((p) => p.id === product.id);
  const handleToggleWishlist = () => toggleWishlist(product);

  const handleQuantityChange = (value) => {
    if (value && value > 0) {
      setQuantity(value);
    }
  };

  if (layout === 'detail') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        {/* Quantity and Wishlist Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontWeight: 400, fontSize: '14px', color: '#757575', width: '110px' }}>Số lượng:</div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            border: '1px solid #d8d8d8',
            borderRadius: '2px', 
            backgroundColor: '#fff'
          }}>
            <Button 
              type="text" 
              onClick={() => handleQuantityChange(quantity - 1)} 
              disabled={quantity <= 1 || adding || loading || disabled}
              style={{ fontWeight: 'normal', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', padding: 0, borderRadius: 0, border: 'none', borderRight: '1px solid #e8e8e8' }}
            >
              -
            </Button>
            <span style={{ fontWeight: 400, width: '50px', textAlign: 'center', fontSize: '16px', color: '#111827', display: 'inline-block', lineHeight: '32px', height: '32px' }}>
              {quantity}
            </span>
            <Button 
              type="text" 
              onClick={() => handleQuantityChange(quantity + 1)} 
              disabled={quantity >= 99 || adding || loading || disabled || (stock !== null && quantity >= stock)}
              style={{ fontWeight: 'normal', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', padding: 0, borderRadius: 0, border: 'none', borderLeft: '1px solid #e8e8e8' }}
            >
              +
            </Button>
          </div>
          
          {stock !== null && (
            <span style={{ color: '#757575', fontSize: '14px', marginLeft: '12px' }}>
              {stock} sản phẩm có sẵn
            </span>
          )}

          <Tooltip title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}>
            <Button
              type="text"
              icon={isInWishlist ? <HeartFilled style={{ color: '#ee4d2d', fontSize: '20px' }} /> : <HeartOutlined style={{ fontSize: '20px', color: '#757575' }} />}
              onClick={handleToggleWishlist}
              disabled={adding}
              style={{ 
                height: '40px', 
                width: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginLeft: 'auto'
              }}
            />
          </Tooltip>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
          <Button
            type="default"
            icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
            onClick={handleAddToCart}
            disabled={adding || loading || disabled}
            loading={adding || loading}
            style={{ 
              flex: 1, 
              height: '48px', 
              borderRadius: '2px', 
              fontSize: '15px', 
              fontWeight: 500, 
              color: '#ee4d2d', 
              borderColor: '#ee4d2d', 
              backgroundColor: '#ffeee8',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 1px 1px 0 rgba(0,0,0,.03)'
            }}
          >
            Thêm Vào Giỏ Hàng
          </Button>
          <Button
            type="primary"
            onClick={handleBuyNow}
            disabled={adding || loading || disabled}
            style={{ 
              flex: 1, 
              height: '48px', 
              borderRadius: '2px', 
              fontSize: '15px', 
              fontWeight: 500, 
              backgroundColor: '#ee4d2d', 
              borderColor: '#ee4d2d',
              color: '#fff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 1px 1px 0 rgba(0,0,0,.09)'
            }}
          >
            Mua Ngay
          </Button>
        </div>
      </div>
    );
  }

  if (showQuantity) {
    return (
      <Space.Compact style={style} size={size}>
        <InputNumber
          min={1}
          max={99}
          value={quantity}
          onChange={handleQuantityChange}
          disabled={adding || loading || disabled}
          style={{ width: 80 }}
          size={size}
        />
        <Tooltip title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}>
          <Button
            icon={isInWishlist ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
            onClick={handleToggleWishlist}
            disabled={adding}
            size={size}
          />
        </Tooltip>
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={adding || loading || disabled}
          loading={adding || loading}
          size={size}
        >
          Thêm vào giỏ
        </Button>
        <Button
          type="default"
          onClick={handleBuyNow}
          disabled={adding || loading || disabled}
          size={size}
        >
          Mua ngay
        </Button>
      </Space.Compact>
    );
  }
  // compact mode for card actions (small icons / no long labels)
  if (compact) {
    const compactSize = size === 'default' ? 'small' : size;
    const isLarge = size === 'large';
    const btnStyle = { 
      borderRadius: '8px', 
      height: isLarge ? '36px' : undefined,
      padding: isLarge ? '0 8px' : undefined,
      fontSize: isLarge ? '13px' : undefined
    };

    if (onlyBuy) {
      return (
        <Tooltip title="Mua ngay">
          <Button 
            type="primary" 
            onClick={handleBuyNow} 
            loading={adding || loading}
            style={{ 
              width: '100%', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: '#EA580C', 
              borderColor: '#EA580C',
              color: '#ffffff',
              borderRadius: '8px',
              height: '36px',
              fontSize: '13px'
            }}
          >
            Mua Ngay
          </Button>
        </Tooltip>
      );
    }

    return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <Tooltip title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}>
          <Button
            icon={isInWishlist ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
            onClick={handleToggleWishlist}
            size={compactSize}
            style={{ ...btnStyle, padding: isLarge ? '0 10px' : undefined }}
          />
        </Tooltip>

        <Tooltip title="Thêm vào giỏ hàng">
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            loading={adding || loading}
            size={compactSize}
            style={{ ...btnStyle, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            Thêm
          </Button>
        </Tooltip>

        <Tooltip title="Mua ngay">
          <Button 
            type="default" 
            onClick={handleBuyNow} 
            size={compactSize}
            style={{ ...btnStyle, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            Mua
          </Button>
        </Tooltip>
      </div>
    );
  }

  return (
    <Space>
      <Tooltip title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}>
        <Button
          icon={isInWishlist ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
          onClick={handleToggleWishlist}
          size={size}
        />
      </Tooltip>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddToCart}
        disabled={adding || loading || disabled}
        loading={adding || loading}
        size={size}
        style={style}
      >
        Thêm vào giỏ
      </Button>
      <Button type="default" onClick={handleBuyNow} disabled={adding || loading || disabled} size={size}>Mua ngay</Button>
    </Space>
  );
};

export default AddToCartButton;
