
package com.chd.base.service;

import com.chd.base.model.Order;
import com.chd.base.model.OrderStatus;

import java.util.List;

public interface OrderService {
	Order createOrder(Order order);
	List<Order> getAllOrders();
	List<Order> getUserOrders(String username);
	Order getOrderById(Long id);
	Order updateOrderStatus(Long id, OrderStatus status);
}
