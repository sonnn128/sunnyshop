
package com.sonnguyen.base.service;

import com.sonnguyen.base.model.Order;
import com.sonnguyen.base.model.OrderStatus;

import java.util.List;

public interface OrderService {
	Order createOrder(Order order);
	List<Order> getAllOrders();
	Order getOrderById(Long id);
	Order updateOrderStatus(Long id, OrderStatus status);
}
