package com.sonnguyen.base.service;

import com.sonnguyen.base.model.User;
import com.sonnguyen.base.payload.response.ApiResponse;

public interface CartService {

	ApiResponse getCart(User user);

	ApiResponse addItem(User user, Long productId, Long variantId, int quantity);

	ApiResponse updateItem(User user, Long cartItemId, int quantity);

	ApiResponse removeItem(User user, Long cartItemId);

	ApiResponse clearCart(User user);

	ApiResponse getCartCount(User user);
}
