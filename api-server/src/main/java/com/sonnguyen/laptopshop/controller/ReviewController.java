package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.exception.CommonException;
import com.sonnguyen.laptopshop.model.Product;
import com.sonnguyen.laptopshop.model.Review;
import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.repository.ProductRepository;
import com.sonnguyen.laptopshop.repository.ReviewRepository;
import com.sonnguyen.laptopshop.repository.UserRepository;
import com.sonnguyen.laptopshop.utils.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CommonException("Product not found", HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(reviewRepository.findByProductOrderByCreatedAtDesc(product));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody com.sonnguyen.laptopshop.payload.request.ReviewRequest request) {
        User user = getCurrentUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new CommonException("Product not found", HttpStatus.NOT_FOUND));
        
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        return ResponseEntity.ok(reviewRepository.save(review));
    }
    
    private User getCurrentUser() {
        try {
            return SecurityUtils.getCurrentUser();
        } catch (Exception e) {
            throw new CommonException("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
    }
}
