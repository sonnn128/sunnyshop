package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.Order;
import com.sonnguyen.laptopshop.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrder(Order order);
}
