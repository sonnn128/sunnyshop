package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.Cart;
import com.sonnguyen.laptopshop.model.CartDetail;
import com.sonnguyen.laptopshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {
    List<CartDetail> findByCart(Cart cart);
    Optional<CartDetail> findByCartAndProduct(Cart cart, Product product);
    void deleteByCart(Cart cart);
}
