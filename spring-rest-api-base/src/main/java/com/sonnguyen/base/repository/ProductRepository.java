package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

	@Query("""
			select p from Product p
			where (:status is null or p.status = :status)
			  and (:featured is null or p.featured = :featured)
			  and (:categoryId is null or p.category.id = :categoryId)
			  and (
			        :search is null
			        or lower(p.name) like lower(concat('%', :search, '%'))
			        or lower(p.slug) like lower(concat('%', :search, '%'))
			      )
			""")
	Page<Product> searchProducts(@Param("status") String status, @Param("featured") Boolean featured,
			@Param("categoryId") Long categoryId, @Param("search") String search, Pageable pageable);
}
