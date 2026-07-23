package com.sonnguyen.trendwearshop.repository;

import com.sonnguyen.trendwearshop.model.Order;
import com.sonnguyen.trendwearshop.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrder(Order order);
    void deleteByOrder(Order order);
}
