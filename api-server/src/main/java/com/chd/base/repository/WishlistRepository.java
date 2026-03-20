
package com.chd.base.repository;

import com.chd.base.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
	List<Wishlist> findByUserId(String userId);
}
