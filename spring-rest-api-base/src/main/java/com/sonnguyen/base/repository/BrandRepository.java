package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Long> {

	List<Brand> findByIsActiveTrueOrderBySortOrderAscNameAsc();

	List<Brand> findByNameContainingIgnoreCaseOrderBySortOrderAscNameAsc(String name);

	@Query("SELECT b FROM Brand b WHERE (:activeOnly = false OR b.isActive = true) "
			+ "AND (:search IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :search, '%'))) "
			+ "ORDER BY b.sortOrder ASC, b.name ASC")
	List<Brand> findAllFiltered(boolean activeOnly, String search);

	Optional<Brand> findBySlug(String slug);

	boolean existsByNameIgnoreCase(String name);

	boolean existsBySlug(String slug);
}
