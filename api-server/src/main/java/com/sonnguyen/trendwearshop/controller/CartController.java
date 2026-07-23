package com.sonnguyen.trendwearshop.controller;

import com.sonnguyen.trendwearshop.payload.request.CartItemRequest;
import com.sonnguyen.trendwearshop.payload.response.CartResponse;
import com.sonnguyen.trendwearshop.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(null);
        }
        String userId = authentication.getName();
        CartResponse cart = cartService.getCartByUserId(userId);
        if (cart != null) {
            return ResponseEntity.ok(cart);
        }
        return ResponseEntity.ok(new CartResponse());
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(
            @Valid @RequestBody CartItemRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(null);
        }
        String userId = authentication.getName();
        CartResponse cart = cartService.addItemToCart(userId, request);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{cartDetailId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long cartDetailId,
            @RequestParam Long quantity,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(null);
        }
        String userId = authentication.getName();
        CartResponse cart = cartService.updateCartItem(userId, cartDetailId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{cartDetailId}")
    public ResponseEntity<CartResponse> removeItemFromCart(
            @PathVariable Long cartDetailId,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(null);
        }
        String userId = authentication.getName();
        CartResponse cart = cartService.removeItemFromCart(userId, cartDetailId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        String userId = authentication.getName();
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
