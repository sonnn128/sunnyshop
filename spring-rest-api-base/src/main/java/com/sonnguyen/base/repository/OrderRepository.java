
package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
