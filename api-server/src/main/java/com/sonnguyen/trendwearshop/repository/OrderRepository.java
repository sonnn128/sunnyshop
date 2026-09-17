package com.sonnguyen.trendwearshop.repository;

import com.sonnguyen.trendwearshop.model.Order;
import com.sonnguyen.trendwearshop.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserId(UUID userId);
    List<Order> findByUserIdOrderByOrderDateDesc(UUID userId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    Long countByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId AND o.status != 'CANCELLED'")
    Long countActiveByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0.0) FROM Order o WHERE o.user.id = :userId AND o.status != 'CANCELLED'")
    Double sumSpentByUserId(@Param("userId") UUID userId);

    @Query("SELECT o FROM Order o WHERE o.status = :status")
    Page<Order> findByStatus(@Param("status") String status, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.user = :user AND o.status = :status")
    List<Order> findByUserAndStatus(@Param("user") User user, @Param("status") String status);
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = 'COMPLETED'")
    Double sumRevenue();
}
