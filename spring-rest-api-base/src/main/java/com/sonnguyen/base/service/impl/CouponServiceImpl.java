
package com.sonnguyen.base.service.impl;

import com.sonnguyen.base.model.Coupon;
import com.sonnguyen.base.repository.CouponRepository;
import com.sonnguyen.base.service.CouponService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    public CouponServiceImpl(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }
}
