
package com.chd.base.service.impl;

import com.chd.base.model.Coupon;
import com.chd.base.repository.CouponRepository;
import com.chd.base.service.CouponService;
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
