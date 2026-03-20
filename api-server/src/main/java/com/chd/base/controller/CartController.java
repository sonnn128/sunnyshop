package com.chd.base.controller;

import com.chd.base.model.User;
import com.chd.base.payload.response.ApiResponse;
import com.chd.base.service.CartService;
import com.chd.base.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

	private final CartService cartService;

	@GetMapping
	public ResponseEntity<ApiResponse> getCart() {
		User user = SecurityUtils.getCurrentUser();
		return ResponseEntity.ok(cartService.getCart(user));
	}

	@PostMapping("/add")
	public ResponseEntity<ApiResponse> addItem(@RequestBody AddItemRequest req) {
		User user = SecurityUtils.getCurrentUser();
		return ResponseEntity.ok(cartService.addItem(user, req.productId(), req.variantId(), req.quantity()));
	}

	@PostMapping("/update")
	public ResponseEntity<ApiResponse> updateItem(@RequestBody UpdateItemRequest req) {
		User user = SecurityUtils.getCurrentUser();
		return ResponseEntity.ok(cartService.updateItem(user, req.cartItemId(), req.quantity()));
	}

	@PostMapping("/remove")
	public ResponseEntity<ApiResponse> removeItem(@RequestBody RemoveItemRequest req) {
		User user = SecurityUtils.getCurrentUser();
		return ResponseEntity.ok(cartService.removeItem(user, req.cartItemId()));
	}

	@PostMapping("/clear")
	public ResponseEntity<ApiResponse> clear() {
		User user = SecurityUtils.getCurrentUser();
		return ResponseEntity.ok(cartService.clearCart(user));
	}

	@GetMapping("/count")
	public ResponseEntity<ApiResponse> count() {
		User user = SecurityUtils.getCurrentUser();
		return ResponseEntity.ok(cartService.getCartCount(user));
	}

	public record AddItemRequest(Long productId, Long variantId, int quantity) {
	}
	public record UpdateItemRequest(Long cartItemId, int quantity) {
	}
	public record RemoveItemRequest(Long cartItemId) {
	}
}
