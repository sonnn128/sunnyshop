package com.sonnguyen.trendwearshop.repository;

import com.sonnguyen.trendwearshop.model.Product;
import com.sonnguyen.trendwearshop.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductOrderByCreatedAtDesc(Product product);
    void deleteByUserId(UUID userId);
}
