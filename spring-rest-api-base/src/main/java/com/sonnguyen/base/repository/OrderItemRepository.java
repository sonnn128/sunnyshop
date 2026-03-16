
package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
