
package com.chd.base.controller;

import com.chd.base.model.Wishlist;
import com.chd.base.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

	private final WishlistService wishlistService;

	private String getCurrentUsername() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return authentication != null ? authentication.getName() : null;
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
		String userId = getCurrentUsername();
		return wishlistService.getUserWishlist(userId);
	}

	@GetMapping("/user/{userId}")
	public List<Wishlist> getUserWishlist(@PathVariable String userId) {
		return wishlistService.getUserWishlist(userId);
	}
}
