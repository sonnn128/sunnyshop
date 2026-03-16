
package com.sonnguyen.base.service.impl;

import com.sonnguyen.base.model.Wishlist;
import com.sonnguyen.base.repository.WishlistRepository;
import com.sonnguyen.base.service.WishlistService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;

    public WishlistServiceImpl(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    @Override
    public Wishlist addToWishlist(Wishlist wishlist) {
        return wishlistRepository.save(wishlist);
    }

    @Override
    public void removeFromWishlist(Long id) {
        wishlistRepository.deleteById(id);
    }

    @Override
    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }
}
