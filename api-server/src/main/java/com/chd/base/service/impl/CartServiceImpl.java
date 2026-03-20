package com.chd.base.service.impl;

import com.chd.base.model.CartItem;
import com.chd.base.model.Product;
import com.chd.base.model.User;
import com.chd.base.payload.response.ApiResponse;
import com.chd.base.repository.CartItemRepository;
import com.chd.base.repository.ProductRepository;
import com.chd.base.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;

	@Override
	@Transactional(readOnly = true)
	public ApiResponse getCart(User user) {
		List<CartItem> items = cartItemRepository.findByUser(user);

		int count = 0;
		BigDecimal total = BigDecimal.ZERO;

		for (CartItem item : items) {
			count += item.getQuantity();
			BigDecimal price = item.getPriceAtAdd() != null ? item.getPriceAtAdd() : item.getProduct().getPrice();
			total = total.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
		}

		return ApiResponse.builder().success(true).message("Get cart successfully")
				.data(new CartDto(items, count, total)).build();
	}

	@Override
	@Transactional
	public ApiResponse addItem(User user, Long productId, Long variantId, int quantity) {
		Product product = productRepository.findById(productId).orElse(null);
		if (product == null || !product.isActive()) {
			throw new IllegalStateException("Product is not available");
		}

		CartItem existing = cartItemRepository.findByUserAndProductIdAndVariantId(user, productId, variantId)
				.orElse(null);

		if (existing != null) {
			existing.setQuantity(existing.getQuantity() + quantity);
			cartItemRepository.save(existing);
		} else {
			CartItem item = new CartItem();
			item.setUser(user);
			item.setProduct(product);
			item.setVariantId(variantId);
			item.setQuantity(quantity);
			item.setPriceAtAdd(product.getPrice());
			cartItemRepository.save(item);
		}

		return getCart(user);
	}

	@Override
	@Transactional
	public ApiResponse updateItem(User user, Long cartItemId, int quantity) {
		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
		if (!item.getUser().getId().equals(user.getId())) {
			throw new IllegalStateException("Forbidden");
		}
		if (quantity <= 0) {
			cartItemRepository.delete(item);
		} else {
			item.setQuantity(quantity);
			cartItemRepository.save(item);
		}
		return getCart(user);
	}

	@Override
	@Transactional
	public ApiResponse removeItem(User user, Long cartItemId) {
		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
		if (!item.getUser().getId().equals(user.getId())) {
			throw new IllegalStateException("Forbidden");
		}
		cartItemRepository.delete(item);
		return getCart(user);
	}

	@Override
	@Transactional
	public ApiResponse clearCart(User user) {
		cartItemRepository.deleteByUser(user);
		return ApiResponse.builder().success(true).message("Cart cleared")
				.data(new CartDto(List.of(), 0, BigDecimal.ZERO)).build();
	}

	@Override
	@Transactional(readOnly = true)
	public ApiResponse getCartCount(User user) {
		long count = cartItemRepository.countByUser(user);
		return ApiResponse.builder().success(true).message("Get cart count successfully").data(count).build();
	}

	// DTO đơn giản cho response, bạn có thể tách ra file riêng
	public record CartDto(List<CartItem> items, int count, BigDecimal total) {
	}
}
