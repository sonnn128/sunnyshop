package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
    Optional<Category> findByName(String name);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Long id);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
    long countProductsByCategoryId(@Param("categoryId") Long categoryId);
}
