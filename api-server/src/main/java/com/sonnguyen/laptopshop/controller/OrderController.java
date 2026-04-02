package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.payload.request.OrderRequest;
import com.sonnguyen.laptopshop.payload.response.OrderResponse;
import com.sonnguyen.laptopshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
// 
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        String username = authentication.getName();
        OrderResponse order = orderService.createOrder(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        String username = authentication.getName();
        List<OrderResponse> orders = orderService.getUserOrders(username);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/my-orders/{status}")
    public ResponseEntity<List<OrderResponse>> getMyOrdersByStatus(
            @PathVariable String status,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        String username = authentication.getName();
        List<OrderResponse> orders = orderService.getUserOrdersByStatus(username, status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(order -> ResponseEntity.ok(order))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getOrdersByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders = orderService.getOrdersByStatus(status, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrdersWithoutPagination(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        List<OrderResponse> orders = orderService.getAllOrdersWithoutPagination();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        return orderService.updateOrderStatus(id, status)
                .map(order -> ResponseEntity.ok(order))
                .orElse(ResponseEntity.notFound().build());
    }
}
