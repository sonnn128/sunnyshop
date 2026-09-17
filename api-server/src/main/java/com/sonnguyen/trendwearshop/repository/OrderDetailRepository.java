package com.sonnguyen.trendwearshop.repository;

import com.sonnguyen.trendwearshop.model.Order;
import com.sonnguyen.trendwearshop.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrder(Order order);
    void deleteByOrder(Order order);

    @Query("SELECT COALESCE(SUM(od.quantity), 0L) FROM OrderDetail od WHERE od.order.user.id = :userId AND od.order.status != 'CANCELLED'")
    Long sumQuantityPurchasedByUserId(@Param("userId") UUID userId);
}
