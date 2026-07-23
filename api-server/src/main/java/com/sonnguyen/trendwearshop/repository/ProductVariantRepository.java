package com.sonnguyen.trendwearshop.repository;

import com.sonnguyen.trendwearshop.model.Product;
import com.sonnguyen.trendwearshop.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProduct(Product product);
    Optional<ProductVariant> findByProductAndSizeAndColor(Product product, String size, String color);
}
