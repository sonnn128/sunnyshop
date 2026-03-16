
package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
	List<Wishlist> findByUserId(String userId);
}
