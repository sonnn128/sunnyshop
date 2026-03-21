package com.chd.base.repository;

import com.chd.base.model.CartItem;
import com.chd.base.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

	@Query("SELECT c FROM CartItem c JOIN FETCH c.product WHERE c.user = :user")
	List<CartItem> findByUser(@Param("user") User user);

	@Query("SELECT c FROM CartItem c JOIN FETCH c.product WHERE c.user = :user AND c.product.id = :productId AND c.variantId = :variantId")
	Optional<CartItem> findByUserAndProductIdAndVariantId(@Param("user") User user, @Param("productId") Long productId, @Param("variantId") Long variantId);

	long countByUser(User user);

	void deleteByUser(User user);
}
