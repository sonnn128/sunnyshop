
package com.chd.base.repository;

import com.chd.base.model.Order;
import com.chd.base.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findByUser(User user);
}
