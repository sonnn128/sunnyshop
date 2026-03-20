
package com.chd.base.controller;

import com.chd.base.model.Order;
import com.chd.base.model.OrderStatus;
import com.chd.base.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@PostMapping
	public Order createOrder(@RequestBody Order order) {
		return orderService.createOrder(order);
	}

	@GetMapping
	public List<Order> getAllOrders() {
		return orderService.getAllOrders();
	}

	@GetMapping("/admin")
	public List<Order> getAdminOrders() {
		return orderService.getAllOrders();
	}

	@GetMapping("/top-products")
	public List<?> getTopProducts() {
		// Mock data or service call
		return List.of();
	}

	@GetMapping("/{id}")
	public Order getOrderById(@PathVariable Long id) {
		return orderService.getOrderById(id);
	}

	@PutMapping("/{id}/status")
	public Order updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatus status) {
		return orderService.updateOrderStatus(id, status);
	}
}
