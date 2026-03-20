
package com.chd.base.controller;

import com.chd.base.model.Coupon;
import com.chd.base.service.CouponService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/coupons")
public class CouponController {

	private final CouponService couponService;

	public CouponController(CouponService couponService) {
		this.couponService = couponService;
	}

	@GetMapping
	public List<Coupon> getAllCoupons() {
		return couponService.getAllCoupons();
	}
}
