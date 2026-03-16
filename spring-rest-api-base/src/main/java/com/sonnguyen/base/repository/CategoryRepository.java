package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	Optional<Category> findBySlug(String slug);
}
