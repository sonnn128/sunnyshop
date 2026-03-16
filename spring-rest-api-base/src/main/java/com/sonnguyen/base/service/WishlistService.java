
package com.sonnguyen.base.service;

import com.sonnguyen.base.model.Wishlist;

import java.util.List;

public interface WishlistService {
    Wishlist addToWishlist(Wishlist wishlist);
    void removeFromWishlist(Long id);
    List<Wishlist> getUserWishlist(String userId);
}
