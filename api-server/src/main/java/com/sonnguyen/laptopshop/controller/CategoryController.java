package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.payload.CategoryRequest;
import com.sonnguyen.laptopshop.payload.CategoryResponse;
import com.sonnguyen.laptopshop.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management APIs")
public class CategoryController {

    private final CategoryService categoryService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestPart("category") String categoryStr,
            @RequestPart(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile) throws java.io.IOException {
        CategoryRequest request = objectMapper.readValue(categoryStr, CategoryRequest.class);
        CategoryResponse category = categoryService.createCategory(request, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategoryJson(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse category = categoryService.createCategory(request, null);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id, 
            @RequestPart("category") String categoryStr,
            @RequestPart(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile) throws java.io.IOException {
        CategoryRequest request = objectMapper.readValue(categoryStr, CategoryRequest.class);
        CategoryResponse category = categoryService.updateCategory(id, request, imageFile);
        return ResponseEntity.ok(category);
    }

    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategoryJson(
            @PathVariable Long id, 
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse category = categoryService.updateCategory(id, request, null);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.sonnguyen.laptopshop.payload.response.ApiResponse> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(
                com.sonnguyen.laptopshop.payload.response.ApiResponse.builder()
                        .success(true)
                        .message("Category deleted successfully")
                        .build()
        );
    }
}
