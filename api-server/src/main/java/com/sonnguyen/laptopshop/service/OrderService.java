package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.model.*;
import com.sonnguyen.laptopshop.payload.request.CartItemRequest;
import com.sonnguyen.laptopshop.payload.request.OrderRequest;
import com.sonnguyen.laptopshop.payload.response.OrderResponse;
import com.sonnguyen.laptopshop.repository.*;
import com.sonnguyen.laptopshop.utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import com.sonnguyen.laptopshop.exception.CommonException;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, OrderDetailRepository orderDetailRepository,
                       ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public OrderResponse createOrder(String username, OrderRequest request) {
        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new CommonException("User not found", HttpStatus.NOT_FOUND);
            }

            if (request.getCartItems() == null || request.getCartItems().isEmpty()) {
                throw new CommonException("Cart is empty", HttpStatus.BAD_REQUEST);
            }

            Order order = new Order();
            order.setUser(user);
            order.setReceiverName(request.getReceiverName());
            order.setReceiverAddress(request.getReceiverAddress());
            order.setReceiverPhone(request.getReceiverPhone());
            order.setStatus("PENDING");
            order.setTotalPrice(0.0);

            Order savedOrder = orderRepository.save(order);

            double totalPrice = 0.0;
            for (CartItemRequest item : request.getCartItems()) {
                if (item.getQuantity() == null || item.getQuantity() <= 0) {
                    throw new CommonException("Invalid item quantity", HttpStatus.BAD_REQUEST);
                }

                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new CommonException("Product not found", HttpStatus.NOT_FOUND));

                if (product.getQuantity() < item.getQuantity()) {
                    throw new CommonException("Insufficient product quantity for product: " + product.getName(), HttpStatus.BAD_REQUEST);
                }

                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setOrder(savedOrder);
                orderDetail.setProduct(product);
                orderDetail.setQuantity(item.getQuantity());
                orderDetail.setPrice(product.getPrice());
                orderDetailRepository.save(orderDetail);

                // Update product quantity and sold count
                product.setQuantity(product.getQuantity() - item.getQuantity());
                product.setSold(product.getSold() + item.getQuantity());
                productRepository.save(product);

                totalPrice += item.getQuantity() * product.getPrice();
            }

            savedOrder.setTotalPrice(totalPrice);
            Order finalOrder = orderRepository.save(savedOrder);

            return ModelMapper.toOrderResponse(finalOrder);
        } catch (CommonException ce) {
            // rethrow CommonException as-is
            throw ce;
        } catch (Exception e) {
            // Unexpected exception -> wrap to provide clearer HTTP 500 + trigger rollback
            throw new CommonException("Failed to create order: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Page<OrderResponse> getOrdersByUserId(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Convert to page manually since we don't have a pageable method
        return Page.empty(pageable);
    }

    public List<OrderResponse> getUserOrders(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream()
                .map(ModelMapper::toOrderResponse)
                .toList();
    }

    public Optional<OrderResponse> getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .map(ModelMapper::toOrderResponse);
    }

    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(ModelMapper::toOrderResponse);
    }

    public List<OrderResponse> getAllOrdersWithoutPagination() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(ModelMapper::toOrderResponse)
                .toList();
    }

    public Page<OrderResponse> getOrdersByStatus(String status, Pageable pageable) {
        Page<Order> orders = orderRepository.findByStatus(status, pageable);
        return orders.map(ModelMapper::toOrderResponse);
    }

    public Optional<OrderResponse> updateOrderStatus(Long orderId, String status) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus(status);
                    return orderRepository.save(order);
                })
                .map(ModelMapper::toOrderResponse);
    }

    public List<OrderResponse> getUserOrdersByStatus(String username, String status) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        List<Order> orders = orderRepository.findByUserAndStatus(user, status);
        return orders.stream()
                .map(ModelMapper::toOrderResponse)
                .toList();
    }
}
