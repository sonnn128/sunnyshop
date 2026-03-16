
package com.sonnguyen.base.controller;

import com.sonnguyen.base.model.Wishlist;
import com.sonnguyen.base.service.WishlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping
    public Wishlist addToWishlist(@RequestBody Wishlist wishlist) {
        return wishlistService.addToWishlist(wishlist);
    }

    @DeleteMapping("/{id}")
    public void removeFromWishlist(@PathVariable Long id) {
        wishlistService.removeFromWishlist(id);
    }

    @GetMapping("/user/{userId}")
    public List<Wishlist> getUserWishlist(@PathVariable Long userId) {
        return wishlistService.getUserWishlist(userId);
    }
}
