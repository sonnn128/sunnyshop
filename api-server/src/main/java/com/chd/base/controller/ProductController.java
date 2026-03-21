package com.chd.base.controller;

import com.chd.base.model.Product;
import com.chd.base.payload.request.CreateProductRequest;
import com.chd.base.payload.response.ApiResponse;
import com.chd.base.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

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
		Page<Product> result = productService.searchProducts(status, isFeatured, categoryId, search, pageable);

		return ResponseEntity
				.ok(ApiResponse.builder().success(true).message("Get products successfully").data(result).build());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getProduct(@PathVariable Long id) {
		Product product = productService.getById(id);
		return ResponseEntity.ok(
				ApiResponse.builder().success(true).message("Get product successfully").data(product).build());
	}

	@PostMapping
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> createProduct(@RequestBody CreateProductRequest request) {
		Map<String, Object> payload = new HashMap<>();
		payload.put("name", request.getName());
		payload.put("slug", request.getSlug());
		payload.put("description", request.getDescription());
		payload.put("price", request.getPrice());
		payload.put("sale_price", request.getSalePrice());
		payload.put("original_price", request.getSalePrice());
		payload.put("cost_price", request.getCostPrice());
		payload.put("stock_quantity", request.getStockQuantity());
		payload.put("status", request.getStatus());
		payload.put("is_featured", request.isFeatured());
		payload.put("category_id", request.getCategoryId());
		payload.put("brand_id", request.getBrandId());
		payload.put("images", request.getImages());
		
		Product saved = productService.create(payload);
		Map<String, Object> data = new HashMap<>();
		data.put("product", saved);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.builder().success(true).message("Create product successfully").data(data).build());
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
		Product saved = productService.update(id, payload);
		Map<String, Object> data = new HashMap<>();
		data.put("product", saved);
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("Update product successfully").data(data).build());
	}

	@PostMapping("/import-excel")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> importExcel(@RequestBody Map<String, Object> payload) {
		Object rawProducts = payload.get("products");
		if (!(rawProducts instanceof List<?> list)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(ApiResponse.builder().success(false).message("Products payload is required").build());
		}
		@SuppressWarnings("unchecked")
		List<Map<String, Object>> products = (List<Map<String, Object>>) list;
		Map<String, Object> result = productService.importProducts(products);
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("Import products successfully").data(result).build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'ROLE_ADMIN', 'ROLE_MANAGER')")
	public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
		productService.delete(id);
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("Delete product successfully").build());
	}
}
