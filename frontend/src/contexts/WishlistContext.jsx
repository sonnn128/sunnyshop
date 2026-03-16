import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../lib/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistProductIds, setWishlistProductIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from backend
  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/api/wishlist');
      const items = response.data?.items || [];
      
      setWishlistItems(items);
      
      // Create Set of product IDs for fast lookup
      const productIds = new Set(
        items.map(item => item.product_id?.toString() || item.product_id)
      );
      setWishlistProductIds(productIds);
      
      console.log('[Wishlist Context] Loaded:', items.length, 'items');
    } catch (error) {
      console.error('[Wishlist Context] Load error:', error);
      // If not authenticated, just set empty
      setWishlistItems([]);
      setWishlistProductIds(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistProductIds.has(productId.toString());
  };

  // Add to wishlist
  const addToWishlist = async (productId, snapshot) => {
    try {
      const finalProductId = productId;
      
      const payload = {
        productId: finalProductId,
        product_id: finalProductId,
        snapshot: snapshot || {}
      };

      await API.post('/api/wishlist/add', payload);
      
      // Update local state
      setWishlistProductIds(prev => new Set([...prev, finalProductId.toString()]));
      
      // Reload full list to get complete data
      await loadWishlist();
      
      return true;
    } catch (error) {
      console.error('[Wishlist Context] Add error:', error);
      throw error;
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const finalProductId = productId;
      
      const payload = {
        productId: finalProductId,
        product_id: finalProductId
      };

      await API.post('/api/wishlist/remove', payload);
      
      // Update local state
      setWishlistProductIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(finalProductId.toString());
        return newSet;
      });
      
      // Reload full list
      await loadWishlist();
      
      return true;
    } catch (error) {
      console.error('[Wishlist Context] Remove error:', error);
      throw error;
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (productId, snapshot) => {
    const isCurrentlyInWishlist = isInWishlist(productId);
    
    if (isCurrentlyInWishlist) {
      await removeFromWishlist(productId);
      return false; // Removed
    } else {
      await addToWishlist(productId, snapshot);
      return true; // Added
    }
  };

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const value = {
    wishlistItems,
    wishlistProductIds,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist: loadWishlist,
    count: wishlistItems.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
