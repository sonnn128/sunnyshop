
package com.chd.base.controller;

import com.chd.base.model.Wishlist;
import com.chd.base.service.WishlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
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

	@GetMapping
	public List<Wishlist> getMyWishlist() {
		// Mocking for now, in reality should use SecurityContext to get userId
		return wishlistService.getUserWishlist("mock-user-id");
	}

	@GetMapping("/user/{userId}")
	public List<Wishlist> getUserWishlist(@PathVariable String userId) {
		return wishlistService.getUserWishlist(userId);
	}
}
