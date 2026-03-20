package com.chd.base.repository;

import com.chd.base.model.CartItem;
import com.chd.base.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

	List<CartItem> findByUser(User user);

	Optional<CartItem> findByUserAndProductIdAndVariantId(User user, Long productId, Long variantId);

	long countByUser(User user);

	void deleteByUser(User user);
}
