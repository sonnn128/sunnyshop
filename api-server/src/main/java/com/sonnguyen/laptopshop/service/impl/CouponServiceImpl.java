package com.sonnguyen.laptopshop.service.impl;

import com.sonnguyen.laptopshop.model.Coupon;
import com.sonnguyen.laptopshop.repository.CouponRepository;
import com.sonnguyen.laptopshop.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public List<Coupon> getActiveCoupons() {
        return couponRepository.findByIsActiveTrue().stream().filter(coupon -> {
            if (coupon.getStartDate() != null && LocalDateTime.now().isBefore(coupon.getStartDate())) return false;
            if (coupon.getEndDate() != null && LocalDateTime.now().isAfter(coupon.getEndDate())) return false;
            if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) return false;
            return true;
        }).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public Coupon getCouponById(Long id) {
        return couponRepository.findById(id).orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    @Override
    public Coupon getCouponByCode(String code) {
        return couponRepository.findByCode(code).orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    @Override
    public Coupon createCoupon(Coupon coupon) {
        coupon.setUsedCount(0);
        return couponRepository.save(coupon);
    }

    @Override
    public Coupon updateCoupon(Long id, Coupon details) {
        Coupon coupon = getCouponById(id);
        coupon.setCode(details.getCode());
        coupon.setDiscountType(details.getDiscountType());
        coupon.setDiscountValue(details.getDiscountValue());
        coupon.setMinOrderValue(details.getMinOrderValue());
        coupon.setMaxDiscountAmount(details.getMaxDiscountAmount());
        coupon.setStartDate(details.getStartDate());
        coupon.setEndDate(details.getEndDate());
        coupon.setUsageLimit(details.getUsageLimit());
        coupon.setIsActive(details.getIsActive());
        return couponRepository.save(coupon);
    }

    @Override
    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }

    @Override
    public Coupon validateCoupon(String code, Double orderTotal) {
        Coupon coupon = getCouponByCode(code);
        
        if (!coupon.getIsActive()) {
            throw new RuntimeException("Mã giảm giá không hoạt động");
        }
        if (coupon.getStartDate() != null && LocalDateTime.now().isBefore(coupon.getStartDate())) {
            throw new RuntimeException("Mã giảm giá chưa đến thời gian áp dụng");
        }
        if (coupon.getEndDate() != null && LocalDateTime.now().isAfter(coupon.getEndDate())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn");
        }
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng");
        }
        if (coupon.getMinOrderValue() != null && orderTotal < coupon.getMinOrderValue()) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã");
        }
        
        return coupon;
    }
}
