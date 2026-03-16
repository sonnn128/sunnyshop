package com.sonnguyen.base.controller;

import com.sonnguyen.base.model.User;
import com.sonnguyen.base.payload.response.ApiResponse;
import com.sonnguyen.base.service.CartService;
import com.sonnguyen.base.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    private User currentUser(Object principal) {
        return userService.getCurrentUser(principal);
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getCart(@AuthenticationPrincipal Object principal) {
        User user = currentUser(principal);
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addItem(@AuthenticationPrincipal Object principal,
                                               @RequestBody AddItemRequest req) {
        User user = currentUser(principal);
        return ResponseEntity.ok(
                cartService.addItem(user, req.productId(), req.variantId(), req.quantity())
        );
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse> updateItem(@AuthenticationPrincipal Object principal,
                                                  @RequestBody UpdateItemRequest req) {
        User user = currentUser(principal);
        return ResponseEntity.ok(
                cartService.updateItem(user, req.cartItemId(), req.quantity())
        );
    }

    @PostMapping("/remove")
    public ResponseEntity<ApiResponse> removeItem(@AuthenticationPrincipal Object principal,
                                                  @RequestBody RemoveItemRequest req) {
        User user = currentUser(principal);
        return ResponseEntity.ok(
                cartService.removeItem(user, req.cartItemId())
        );
    }

    @PostMapping("/clear")
    public ResponseEntity<ApiResponse> clear(@AuthenticationPrincipal Object principal) {
        User user = currentUser(principal);
        return ResponseEntity.ok(cartService.clearCart(user));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse> count(@AuthenticationPrincipal Object principal) {
        User user = currentUser(principal);
        return ResponseEntity.ok(cartService.getCartCount(user));
    }

    public record AddItemRequest(Long productId, Long variantId, int quantity) {}
    public record UpdateItemRequest(Long cartItemId, int quantity) {}
    public record RemoveItemRequest(Long cartItemId) {}
}