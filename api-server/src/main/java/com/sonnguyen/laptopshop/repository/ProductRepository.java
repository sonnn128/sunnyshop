package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    Page<Product> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.factory = :factory")
    Page<Product> findByFactory(@Param("factory") String factory, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice, Pageable pageable);
    
    @Query("SELECT DISTINCT p.factory FROM Product p")
    List<String> findAllFactories();
    
    @Query("SELECT p FROM Product p WHERE p.quantity > 0")
    Page<Product> findAvailableProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p ORDER BY p.sold DESC")
    Page<Product> findTopSellingProducts(Pageable pageable);
}
