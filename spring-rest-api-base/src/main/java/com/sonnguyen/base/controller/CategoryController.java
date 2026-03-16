package com.sonnguyen.base.controller;

import com.sonnguyen.base.model.Category;
import com.sonnguyen.base.payload.response.ApiResponse;
import com.sonnguyen.base.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Get categories successfully")
                        .data(categories)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(category -> ResponseEntity.ok(
                        ApiResponse.builder()
                                .success(true)
                                .message("Get category successfully")
                                .data(category)
                                .build()
                ))
                .orElseGet(() -> ResponseEntity.status(404).body(
                        ApiResponse.builder()
                                .success(false)
                                .message("Category not found")
                                .build()
                ));
    }
}

