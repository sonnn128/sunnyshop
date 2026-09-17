import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import api from '../config/api.js';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Load cart from server when user logs in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCartFromServer();
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate total items count
  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Add item to cart
  const addToCart = async (product, quantity = 1, size = "", color = "") => {
    try {
      setLoading(true);
      setError(null);

      // Check if item already exists in cart with same size and color
      const existingItemIndex = cartItems.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += quantity;
        setCartItems(updatedItems);
      } else {
        // Add new item to cart
        const newItem = {
          id: product.id,
          cartDetailId: null,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          size: size,
          color: color,
          category: product.category,
          factory: product.factory
        };
        setCartItems([...cartItems, newItem]);
      }

      // If user is logged in, sync with server
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.post('/cart/items', {
            productId: product.id,
            quantity: quantity,
            size: size,
            color: color
          });
          
          // Update local cart details to set cartDetailId from server response
          if (response.data && response.data.cartDetails) {
            const updatedItemsFromServer = response.data.cartDetails.map(detail => ({
              id: detail.product.id,
              cartDetailId: detail.id,
              name: detail.product.name,
              price: detail.price,
              image: detail.product.image,
              quantity: detail.quantity,
              size: detail.size || "",
              color: detail.color || "",
              category: {
                id: detail.product.categoryId,
                name: detail.product.categoryName
              },
              factory: detail.product.factory
            }));
            setCartItems(updatedItemsFromServer);
          }
        } catch (apiError) {
          console.error('Failed to sync cart with server:', apiError);
          if (apiError.response?.status === 401 || apiError.response?.status === 403) {
            console.warn('Token might be invalid, clearing local storage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }

      return { success: true };
    } catch (error) {
      setError('Failed to add item to cart');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity, size = "", color = "") => {
    try {
      setLoading(true);
      setError(null);

      if (quantity <= 0) {
        return removeFromCart(productId, size, color);
      }

      const updatedItems = cartItems.map(item =>
        item.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      );
      setCartItems(updatedItems);

      // If user is logged in, sync with server using cartDetailId
      const token = localStorage.getItem('token');
      const targetItem = cartItems.find(
        item => item.id === productId && item.size === size && item.color === color
      );

      if (token && targetItem && targetItem.cartDetailId) {
        try {
          await api.put(`/cart/items/${targetItem.cartDetailId}?quantity=${quantity}`);
        } catch (apiError) {
          console.warn('Failed to sync cart with server:', apiError);
        }
      }

      return { success: true };
    } catch (error) {
      setError('Failed to update quantity');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId, size = "", color = "") => {
    try {
      setLoading(true);
      setError(null);

      const targetItem = cartItems.find(
        item => item.id === productId && item.size === size && item.color === color
      );
      const updatedItems = cartItems.filter(
        item => !(item.id === productId && item.size === size && item.color === color)
      );
      setCartItems(updatedItems);

      // If user is logged in, sync with server using cartDetailId
      const token = localStorage.getItem('token');
      if (token && targetItem && targetItem.cartDetailId) {
        try {
          await api.delete(`/cart/items/${targetItem.cartDetailId}`);
        } catch (apiError) {
          console.warn('Failed to sync cart with server:', apiError);
        }
      }

      return { success: true };
    } catch (error) {
      setError('Failed to remove item from cart');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      setCartItems([]);

      // If user is logged in, sync with server
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.delete('/cart');
        } catch (apiError) {
          console.warn('Failed to sync cart with server:', apiError);
        }
      }

      return { success: true };
    } catch (error) {
      setError('Failed to clear cart');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Load cart from server (for logged in users)
  const loadCartFromServer = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        return { success: true };
      }

      const response = await api.get('/cart');
      const cartResponse = response.data;

      if (cartResponse && cartResponse.cartDetails) {
        // Convert CartDetailResponse to our cart item format
        const cartItems = cartResponse.cartDetails.map(detail => ({
          id: detail.product.id,
          cartDetailId: detail.id,
          name: detail.product.name,
          price: detail.price,
          image: detail.product.image,
          quantity: detail.quantity,
          size: detail.size || "",
          color: detail.color || "",
          category: {
            id: detail.product.categoryId,
            name: detail.product.categoryName
          },
          factory: detail.product.factory
        }));
        setCartItems(cartItems);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to load cart from server:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Token might be invalid, clearing local storage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sync local cart with server
  const syncCartWithServer = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: true };

      // Send all local cart items to server
      for (const item of cartItems) {
        try {
          await api.post('/cart/items', {
            productId: item.id,
            quantity: item.quantity,
            size: item.size || "",
            color: item.color || ""
          });
        } catch (error) {
          console.warn(`Failed to sync item ${item.id}:`, error);
        }
      }

      return { success: true };
    } catch (error) {
      console.warn('Failed to sync cart with server:', error);
      return { success: false, error: error.message };
    }
  };

  const value = useMemo(() => ({
    cartItems,
    totalItems,
    totalPrice,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCartFromServer,
    syncCartWithServer,
  }), [cartItems, totalItems, totalPrice, loading, error]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
