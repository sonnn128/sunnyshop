package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.Cart;
import com.sonnguyen.laptopshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserId(UUID userId);
    Optional<Cart> findByUserUsername(String username);
}
