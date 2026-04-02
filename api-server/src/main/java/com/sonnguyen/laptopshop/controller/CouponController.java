package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.model.Coupon;
import com.sonnguyen.laptopshop.payload.response.ApiResponse;
import com.sonnguyen.laptopshop.repository.CouponRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons", description = "Coupon management APIs")
public class CouponController {

    private final CouponRepository couponRepository;

    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Coupon>> checkCoupon(@RequestParam String code) {
        return couponRepository.findByCode(code)
                .map(coupon -> {
                    if (!coupon.isActive()) {
                        return ResponseEntity.badRequest().body(
                                ApiResponse.<Coupon>builder()
                                        .success(false)
                                        .message("Coupon is inactive")
                                        .build()
                        );
                    }
                    if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDate.now())) {
                        return ResponseEntity.badRequest().body(
                                ApiResponse.<Coupon>builder()
                                        .success(false)
                                        .message("Coupon has expired")
                                        .build()
                        );
                    }
                    return ResponseEntity.ok(
                            ApiResponse.<Coupon>builder()
                                    .success(true)
                                    .message("Coupon is valid")
                                    .data(coupon)
                                    .build()
                    );
                })
                .orElse(ResponseEntity.badRequest().body(
                        ApiResponse.<Coupon>builder()
                                .success(false)
                                .message("Invalid coupon code")
                                .build()
                ));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@RequestBody Coupon coupon) {
        if (couponRepository.findByCode(coupon.getCode()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<Coupon>builder()
                            .success(false)
                            .message("Coupon code already exists")
                            .build()
            );
        }
        Coupon saved = couponRepository.save(coupon);
        return ResponseEntity.ok(
                ApiResponse.<Coupon>builder()
                        .success(true)
                        .message("Coupon created")
                        .data(saved)
                        .build()
        );
    }
}
