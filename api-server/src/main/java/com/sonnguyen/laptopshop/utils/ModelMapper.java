package com.sonnguyen.laptopshop.utils;

import com.sonnguyen.laptopshop.model.*;
import com.sonnguyen.laptopshop.payload.request.ProductRequest;
import com.sonnguyen.laptopshop.payload.response.*;

import java.util.List;

public class ModelMapper {

    private ModelMapper() {
        // Utility class
    }

    // Product mappings
    public static Product toProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setImage(request.getImage());
        product.setDescription(request.getDescription());
        product.setQuantity(request.getQuantity());
        product.setFactory(request.getFactory());
        product.setTarget(request.getTarget());
        product.setSold(0L);
        return product;
    }

    public static ProductResponse toProductResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setImage(product.getImage());
        response.setDescription(product.getDescription());
        response.setQuantity(product.getQuantity());
        response.setSold(product.getSold());
        response.setFactory(product.getFactory());
        response.setTarget(product.getTarget());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        
        // Map category information
        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getName());
        }
        
        return response;
    }

    // Cart mappings
    public static CartResponse toCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setSum(cart.getSum());
        response.setCreatedAt(cart.getCreatedAt());
        response.setUpdatedAt(cart.getUpdatedAt());
        
        if (cart.getCartDetails() != null) {
            List<CartDetailResponse> cartDetailResponses = cart.getCartDetails().stream()
                    .map(ModelMapper::toCartDetailResponse)
                    .toList();
            response.setCartDetails(cartDetailResponses);
        }
        
        return response;
    }

    public static CartDetailResponse toCartDetailResponse(CartDetail cartDetail) {
        CartDetailResponse response = new CartDetailResponse();
        response.setId(cartDetail.getId());
        response.setQuantity(cartDetail.getQuantity());
        response.setPrice(cartDetail.getPrice());
        response.setCreatedAt(cartDetail.getCreatedAt());
        response.setUpdatedAt(cartDetail.getUpdatedAt());
        
        if (cartDetail.getProduct() != null) {
            response.setProduct(toProductResponse(cartDetail.getProduct()));
        }
        
        return response;
    }

    // Order mappings
    public static OrderResponse toOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setTotalPrice(order.getTotalPrice());
        response.setReceiverName(order.getReceiverName());
        response.setReceiverAddress(order.getReceiverAddress());
        response.setReceiverPhone(order.getReceiverPhone());
        response.setStatus(order.getStatus());
        response.setOrderDate(order.getOrderDate());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        
        if (order.getOrderDetails() != null) {
            List<OrderDetailResponse> orderDetailResponses = order.getOrderDetails().stream()
                    .map(ModelMapper::toOrderDetailResponse)
                    .toList();
            response.setOrderDetails(orderDetailResponses);
        }
        
        return response;
    }

    public static OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail) {
        OrderDetailResponse response = new OrderDetailResponse();
        response.setId(orderDetail.getId());
        response.setQuantity(orderDetail.getQuantity());
        response.setPrice(orderDetail.getPrice());
        response.setCreatedAt(orderDetail.getCreatedAt());
        response.setUpdatedAt(orderDetail.getUpdatedAt());
        
        if (orderDetail.getProduct() != null) {
            response.setProduct(toProductResponse(orderDetail.getProduct()));
        }
        
        return response;
    }

    // User mappings
    public static UserResponse toUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setAddress(user.getAddress());
        response.setGender(user.getGender());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        
        // Map roles
        if (user.getRoles() != null) {
            List<UserResponse.RoleInfo> roleInfos = user.getRoles().stream()
                    .map(role -> {
                        UserResponse.RoleInfo roleInfo = new UserResponse.RoleInfo();
                        roleInfo.setId(role.getId());
                        roleInfo.setAuthority(role.getAuthority());
                        roleInfo.setPermissions(role.getPermissions() != null ? 
                                role.getPermissions().stream()
                                        .map(permission -> permission.getId())
                                        .toList() : List.of());
                        return roleInfo;
                    })
                    .toList();
            response.setRoles(roleInfos);
        }
        
        return response;
    }
    // Address mappings
    public static Address toAddress(com.sonnguyen.laptopshop.payload.request.AddressRequest request) {
        Address address = new Address();
        address.setReceiverName(request.getReceiverName());
        address.setPhone(request.getPhone());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setStreet(request.getStreet());
        address.setDefault(request.isDefault());
        return address;
    }

    public static AddressResponse toAddressResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setReceiverName(address.getReceiverName());
        response.setPhone(address.getPhone());
        response.setCity(address.getCity());
        response.setDistrict(address.getDistrict());
        response.setWard(address.getWard());
        response.setStreet(address.getStreet());
        response.setDefault(address.isDefault());
        return response;
    }
}
