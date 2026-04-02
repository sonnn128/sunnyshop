import React from 'react';
import { Badge, Button, Tooltip } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';

const CartIcon = ({ size = 'default', showText = false, style = {} }) => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/cart');
  };

  const buttonContent = showText ? (
    <>
      <ShoppingCartOutlined />
      <span style={{ marginLeft: '8px' }}>Cart</span>
    </>
  ) : (
    <ShoppingCartOutlined />
  );

  return (
    <Tooltip title={`${totalItems} items in cart`}>
      <Badge count={totalItems} size="small" offset={[-5, 5]}>
        <Button
          type="text"
          icon={!showText ? <ShoppingCartOutlined /> : null}
          onClick={handleClick}
          size={size}
          style={{ 
            color: 'white', 
            display: 'flex',
            alignItems: 'center',
            ...style 
          }}
        >
          {showText && (
            <>
              <ShoppingCartOutlined style={{ marginRight: '8px' }} />
              Cart
            </>
          )}
        </Button>
      </Badge>
    </Tooltip>
  );
};

export default CartIcon;
