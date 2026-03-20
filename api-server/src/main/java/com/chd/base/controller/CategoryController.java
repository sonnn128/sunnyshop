package com.chd.base.controller;

import com.chd.base.model.Category;
import com.chd.base.payload.response.ApiResponse;
import com.chd.base.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

	private final CategoryRepository categoryRepository;

	private Long parseParentId(Object parentId) {
		if (parentId == null) {
			return null;
		}
		if (parentId instanceof Number number) {
			return number.longValue();
		}
		try {
			String raw = parentId.toString().trim();
			if (raw.isEmpty()) {
				return null;
			}
			return Long.parseLong(raw);
		} catch (Exception ex) {
			return null;
		}
	}

	private String pickString(Map<String, Object> payload, String snakeKey, String camelKey) {
		Object value = payload.getOrDefault(snakeKey, payload.get(camelKey));
		return value == null ? null : value.toString();
	}

	private Integer pickInt(Map<String, Object> payload, String snakeKey, String camelKey, Integer fallback) {
		Object value = payload.getOrDefault(snakeKey, payload.get(camelKey));
		if (value == null) {
			return fallback;
		}
		if (value instanceof Number number) {
			return number.intValue();
		}
		try {
			return Integer.parseInt(value.toString().trim());
		} catch (Exception ex) {
			return fallback;
		}
	}

	@GetMapping
	public ResponseEntity<?> getAll() {
		List<Category> categories = categoryRepository.findAll();
		return ResponseEntity.ok(
				ApiResponse.builder().success(true).message("Get categories successfully").data(categories).build());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getById(@PathVariable Long id) {
		return categoryRepository.findById(id)
				.map(category -> ResponseEntity.ok(ApiResponse.builder().success(true)
						.message("Get category successfully").data(category).build()))
				.orElseGet(() -> ResponseEntity.status(404)
						.body(ApiResponse.builder().success(false).message("Category not found").build()));
	}

	@PostMapping
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
		String name = pickString(payload, "name", "name");
		String slug = pickString(payload, "slug", "slug");

		if (name == null || name.trim().isEmpty() || slug == null || slug.trim().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(ApiResponse.builder().success(false).message("Name and slug are required").build());
		}

		if (categoryRepository.findBySlug(slug.trim()).isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(ApiResponse.builder().success(false).message("Slug already exists").build());
		}

		Category category = new Category();
		category.setName(name.trim());
		category.setSlug(slug.trim());
		category.setDescription(pickString(payload, "description", "description"));
		category.setImageUrl(pickString(payload, "image_url", "imageUrl"));
		category.setSortOrder(pickInt(payload, "sort_order", "sortOrder", 0));

		Long parentId = parseParentId(payload.getOrDefault("parent_id", payload.get("parentId")));
		if (parentId != null) {
			categoryRepository.findById(parentId).ifPresent(category::setParent);
		}

		Category saved = categoryRepository.save(category);
		Map<String, Object> data = new HashMap<>();
		data.put("category", saved);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.builder().success(true).message("Create category successfully").data(data).build());
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
		Category category = categoryRepository.findById(id).orElse(null);
		if (category == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(ApiResponse.builder().success(false).message("Category not found").build());
		}

		String name = pickString(payload, "name", "name");
		String slug = pickString(payload, "slug", "slug");

		if (name != null && !name.trim().isEmpty()) {
			category.setName(name.trim());
		}

		if (slug != null && !slug.trim().isEmpty()) {
			Category existed = categoryRepository.findBySlug(slug.trim()).orElse(null);
			if (existed != null && !existed.getId().equals(id)) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(ApiResponse.builder().success(false).message("Slug already exists").build());
			}
			category.setSlug(slug.trim());
		}

		if (payload.containsKey("description")) {
			category.setDescription(pickString(payload, "description", "description"));
		}
		if (payload.containsKey("image_url") || payload.containsKey("imageUrl")) {
			category.setImageUrl(pickString(payload, "image_url", "imageUrl"));
		}
		if (payload.containsKey("sort_order") || payload.containsKey("sortOrder")) {
			category.setSortOrder(pickInt(payload, "sort_order", "sortOrder", category.getSortOrder()));
		}

		if (payload.containsKey("parent_id") || payload.containsKey("parentId")) {
			Long parentId = parseParentId(payload.getOrDefault("parent_id", payload.get("parentId")));
			if (parentId == null) {
				category.setParent(null);
			} else {
				categoryRepository.findById(parentId).ifPresent(category::setParent);
			}
		}

		Category saved = categoryRepository.save(category);
		Map<String, Object> data = new HashMap<>();
		data.put("category", saved);
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("Update category successfully").data(data).build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> remove(@PathVariable Long id) {
		if (!categoryRepository.existsById(id)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(ApiResponse.builder().success(false).message("Category not found").build());
		}
		categoryRepository.deleteById(id);
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("Delete category successfully").build());
	}
}
