
package com.chd.base.service.impl;

import com.chd.base.model.Order;
import com.chd.base.model.OrderStatus;
import com.chd.base.model.User;
import com.chd.base.repository.OrderRepository;
import com.chd.base.repository.UserRepository;
import com.chd.base.service.OrderService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

	private final OrderRepository orderRepository;
	private final UserRepository userRepository;

	public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository) {
		this.orderRepository = orderRepository;
		this.userRepository = userRepository;
	}

	@Override
	public Order createOrder(Order order) {
		// Logic to handle stock and other business rules should be added here
		return orderRepository.save(order);
	}

	@Override
	public List<Order> getAllOrders() {
		return orderRepository.findAll();
	}

	@Override
	public List<Order> getUserOrders(String username) {
		User user = userRepository.findByUsername(username);
		if (user == null) {
			return List.of();
		}
		return orderRepository.findByUser(user);
	}

	@Override
	public Order getOrderById(Long id) {
		return orderRepository.findById(id).orElse(null);
	}

	@Override
	public Order updateOrderStatus(Long id, OrderStatus status) {
		Order order = getOrderById(id);
		if (order != null) {
			order.setStatus(status);
			return orderRepository.save(order);
		}
		return null;
	}
}
