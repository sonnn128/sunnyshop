package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.exception.CommonException;
import com.sonnguyen.laptopshop.model.Product;
import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.model.Wishlist;
import com.sonnguyen.laptopshop.payload.response.ProductResponse;
import com.sonnguyen.laptopshop.repository.ProductRepository;
import com.sonnguyen.laptopshop.repository.UserRepository;
import com.sonnguyen.laptopshop.repository.WishlistRepository;
import com.sonnguyen.laptopshop.utils.ModelMapper;
import com.sonnguyen.laptopshop.utils.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/wishlists")
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistController(WishlistRepository wishlistRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getMyWishlist() {
        User user = getCurrentUser();
        List<Wishlist> wishlists = wishlistRepository.findByUserId(user.getId());
        List<ProductResponse> products = wishlists.stream()
                .map(w -> ModelMapper.toProductResponse(w.getProduct()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable Long productId) {
        User user = getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CommonException("Product not found", HttpStatus.NOT_FOUND));

        if (!wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            wishlistRepository.save(new Wishlist(user, product));
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    @Transactional
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId) {
        User user = getCurrentUser();
        if (!productRepository.existsById(productId)) {
             throw new CommonException("Product not found", HttpStatus.NOT_FOUND);
        }
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> checkWishlist(@PathVariable Long productId) {
        try {
            User user = getCurrentUser();
            if (!productRepository.existsById(productId)) {
                 return ResponseEntity.ok(false);
            }
            return ResponseEntity.ok(wishlistRepository.existsByUserIdAndProductId(user.getId(), productId));
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    private User getCurrentUser() {
        try {
            return SecurityUtils.getCurrentUser();
        } catch (Exception e) {
            throw new CommonException("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
    }
}
