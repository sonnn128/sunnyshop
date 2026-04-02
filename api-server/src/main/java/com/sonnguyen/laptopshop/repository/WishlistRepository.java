package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.Product;
import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    @Query("SELECT w FROM Wishlist w JOIN FETCH w.product p LEFT JOIN FETCH p.category WHERE w.user.id = :userId")
    List<Wishlist> findByUserId(@Param("userId") UUID userId);
    Optional<Wishlist> findByUserIdAndProductId(UUID userId, Long productId);
    boolean existsByUserIdAndProductId(UUID userId, Long productId);
    void deleteByUserIdAndProductId(UUID userId, Long productId);
}
