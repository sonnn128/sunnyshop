package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.Order;
import com.sonnguyen.laptopshop.model.User;
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
    
    @Query("SELECT o FROM Order o WHERE o.status = :status")
    Page<Order> findByStatus(@Param("status") String status, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.user = :user AND o.status = :status")
    List<Order> findByUserAndStatus(@Param("user") User user, @Param("status") String status);
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = 'COMPLETED'")
    Double sumRevenue();
}
