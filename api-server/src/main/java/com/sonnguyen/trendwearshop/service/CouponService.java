package com.sonnguyen.trendwearshop.service;

import com.sonnguyen.trendwearshop.model.Coupon;
import java.util.List;

public interface CouponService {
    List<Coupon> getAllCoupons();
    List<Coupon> getActiveCoupons();
    Coupon getCouponById(Long id);
    Coupon getCouponByCode(String code);
    Coupon createCoupon(Coupon coupon);
    Coupon updateCoupon(Long id, Coupon couponDetails);
    void deleteCoupon(Long id);
    Coupon validateCoupon(String code, Double orderTotal);
}
