package com.chd.base.controller;

import com.chd.base.model.Category;
import com.chd.base.payload.response.ApiResponse;
import com.chd.base.service.CategoryService;
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

	private final CategoryService categoryService;

	@GetMapping
	public ResponseEntity<?> getAll() {
		List<Category> categories = categoryService.getAll();
		return ResponseEntity.ok(
				ApiResponse.builder().success(true).message("Get categories successfully").data(categories).build());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getById(@PathVariable Long id) {
		Category category = categoryService.getById(id);
		return ResponseEntity.ok(ApiResponse.builder().success(true)
				.message("Get category successfully").data(category).build());
	}

	@GetMapping("/generate-slug")
	public ResponseEntity<?> generateSlug(
			@RequestParam String name,
			@RequestParam(required = false) Long excludeId) {
		String slug = categoryService.generateSlug(name, excludeId);
		Map<String, String> data = new HashMap<>();
		data.put("slug", slug);
		return ResponseEntity.ok(ApiResponse.builder().success(true)
				.message("Slug generated successfully").data(data).build());
	}

	@PostMapping
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
		Category saved = categoryService.create(payload);
		Map<String, Object> data = new HashMap<>();
		data.put("category", saved);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.builder().success(true).message("Create category successfully").data(data).build());
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
		Category saved = categoryService.update(id, payload);
		Map<String, Object> data = new HashMap<>();
		data.put("category", saved);
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("Update category successfully").data(data).build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> remove(@PathVariable Long id) {
		categoryService.delete(id);
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("Delete category successfully").build());
	}
}
