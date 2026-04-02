import React, { useState } from 'react';
import { Button, InputNumber, message, Space, Tooltip } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useCart } from '../contexts/CartContext.jsx';
import { useWishlist } from '../contexts/WishlistContext.jsx';
import { useNavigate } from 'react-router-dom';

const AddToCartButton = ({ product, size = 'default', showQuantity = true, style = {}, compact = false }) => {
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

    try {
      setAdding(true);
      const result = await addToCart(product, quantity);

      if (result.success) {
        message.success(`${product.name} added to cart!`);
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
    // Add to cart then navigate to checkout
    try {
      setAdding(true);
      const result = await addToCart(product, quantity);
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

  if (showQuantity) {
    return (
      <Space.Compact style={style}>
        <InputNumber
          min={1}
          max={99}
          value={quantity}
          onChange={handleQuantityChange}
          disabled={adding || loading}
          style={{ width: 80 }}
        />
        <Tooltip title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
          <Button
            icon={isInWishlist ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
            onClick={handleToggleWishlist}
            disabled={adding}
          />
        </Tooltip>
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          loading={adding || loading}
          size={size}
        >
          Add to Cart
        </Button>
        <Button
          type="default"
          onClick={handleBuyNow}
          disabled={adding || loading}
        >
          Buy Now
        </Button>
      </Space.Compact>
    );
  }
  // compact mode for card actions (small icons / no long labels)
  if (compact) {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
          <Button
            icon={isInWishlist ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
            onClick={handleToggleWishlist}
            size="small"
          />
        </Tooltip>

        <Tooltip title="Add to cart">
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            loading={adding || loading}
            size="small"
          >
            {/* short label fits inside compact button */}
            Cart
          </Button>
        </Tooltip>

        <Tooltip title="Buy now">
          <Button type="default" onClick={handleBuyNow} size="small">
            Buy
          </Button>
        </Tooltip>
      </div>
    );
  }

  return (
    <Space>
      <Tooltip title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
        <Button
          icon={isInWishlist ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
          onClick={handleToggleWishlist}
        />
      </Tooltip>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddToCart}
        loading={adding || loading}
        size={size}
        style={style}
      >
        Add to Cart
      </Button>
      <Button type="default" onClick={handleBuyNow}>Buy Now</Button>
    </Space>
  );
};

export default AddToCartButton;
