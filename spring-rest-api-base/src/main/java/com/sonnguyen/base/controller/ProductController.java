package com.sonnguyen.base.controller;

import com.sonnguyen.base.model.Product;
import com.sonnguyen.base.payload.response.ApiResponse;
import com.sonnguyen.base.repository.CategoryRepository;
import com.sonnguyen.base.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;

	@GetMapping
	public ResponseEntity<?> listProducts(@RequestParam(value = "page", defaultValue = "1") int page,
			@RequestParam(value = "limit", defaultValue = "20") int limit,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "is_featured", required = false) Boolean isFeatured,
			@RequestParam(value = "category", required = false) Long categoryId,
			@RequestParam(value = "search", required = false) String search) {

		int pageIndex = Math.max(page - 1, 0);
		int size = Math.min(Math.max(limit, 1), 200);

		Pageable pageable = PageRequest.of(pageIndex, size, Sort.by(Sort.Direction.DESC, "createdAt"));

		Page<Product> result = productRepository.searchProducts(status, isFeatured, categoryId, search, pageable);

		return ResponseEntity
				.ok(ApiResponse.builder().success(true).message("Get products successfully").data(result).build());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getProduct(@PathVariable Long id) {
		return productRepository.findById(id)
				.map(product -> ResponseEntity.ok(
						ApiResponse.builder().success(true).message("Get product successfully").data(product).build()))
				.orElseGet(() -> ResponseEntity.status(404)
						.body(ApiResponse.builder().success(false).message("Product not found").build()));
	}
}
