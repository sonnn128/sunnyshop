package com.sonnguyen.trendwearshop.repository;

import com.sonnguyen.trendwearshop.model.Cart;
import com.sonnguyen.trendwearshop.model.CartDetail;
import com.sonnguyen.trendwearshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {
    List<CartDetail> findByCart(Cart cart);
    Optional<CartDetail> findByCartAndProduct(Cart cart, Product product);
    Optional<CartDetail> findByCartAndProductAndSizeAndColor(Cart cart, Product product, String size, String color);
    void deleteByCart(Cart cart);
}
