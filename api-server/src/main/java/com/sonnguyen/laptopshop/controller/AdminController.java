package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.repository.UserRepository;
import com.sonnguyen.laptopshop.repository.OrderRepository;
import com.sonnguyen.laptopshop.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
// 
public class AdminController {
    
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final com.sonnguyen.laptopshop.repository.CategoryRepository categoryRepository;

    public AdminController(UserRepository userRepository, 
                           ProductRepository productRepository, 
                           OrderRepository orderRepository,
                           com.sonnguyen.laptopshop.repository.CategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<User> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable);
    }

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public java.util.Map<String, Object> getDashboardStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalProducts", productRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        stats.put("totalRevenue", orderRepository.sumRevenue() != null ? orderRepository.sumRevenue() : 0.0);
        return stats;
    }

    @GetMapping("/dashboard/recent-orders")
    @PreAuthorize("hasRole('ADMIN')")
    public List<com.sonnguyen.laptopshop.model.Order> getRecentOrders(@RequestParam(defaultValue = "5") int limit) {
        Pageable pageable = PageRequest.of(0, limit, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
        return orderRepository.findAll(pageable).getContent();
    }

    @GetMapping("/dashboard/top-products")
    @PreAuthorize("hasRole('ADMIN')")
    public List<com.sonnguyen.laptopshop.model.Product> getTopProducts(@RequestParam(defaultValue = "5") int limit) {
        // For now returning recent products, ideally should be top selling
        Pageable pageable = PageRequest.of(0, limit, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
        return productRepository.findAll(pageable).getContent();
    }
}

