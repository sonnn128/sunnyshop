package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String code);
    java.util.List<Coupon> findByIsActiveTrue();
}
