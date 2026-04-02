package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.exception.CommonException;
import com.sonnguyen.laptopshop.model.Category;
import com.sonnguyen.laptopshop.payload.CategoryRequest;
import com.sonnguyen.laptopshop.payload.CategoryResponse;
import com.sonnguyen.laptopshop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    private static final String CATEGORY_NOT_FOUND_BY_ID = "Category not found with id: ";
    private static final String CATEGORY_NOT_FOUND_BY_SLUG = "Category not found with slug: ";
    private static final String CATEGORY_SLUG_EXISTS = "Category with slug '";
    private static final String CATEGORY_SLUG_EXISTS_SUFFIX = "' already exists";
    private static final String CANNOT_DELETE_CATEGORY_WITH_PRODUCTS = "Cannot delete category with existing products";

    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CommonException(CATEGORY_NOT_FOUND_BY_ID + id, HttpStatus.NOT_FOUND));
        return convertToResponse(category);
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new CommonException(CATEGORY_NOT_FOUND_BY_SLUG + slug, HttpStatus.NOT_FOUND));
        return convertToResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request, org.springframework.web.multipart.MultipartFile imageFile) {
        // Check if slug already exists
        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new CommonException(CATEGORY_SLUG_EXISTS + request.getSlug() + CATEGORY_SLUG_EXISTS_SUFFIX, HttpStatus.CONFLICT);
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(imageFile);
            category.setImage(imageUrl);
        } else {
            category.setImage(request.getImage());
        }

        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request, org.springframework.web.multipart.MultipartFile imageFile) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CommonException(CATEGORY_NOT_FOUND_BY_ID + id, HttpStatus.NOT_FOUND));

        // Check if slug already exists for another category
        if (categoryRepository.existsBySlugAndIdNot(request.getSlug(), id)) {
            throw new CommonException(CATEGORY_SLUG_EXISTS + request.getSlug() + CATEGORY_SLUG_EXISTS_SUFFIX, HttpStatus.CONFLICT);
        }

        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(imageFile);
            category.setImage(imageUrl);
        } else if (request.getImage() != null && !request.getImage().isEmpty()) {
             category.setImage(request.getImage());
        }

        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CommonException(CATEGORY_NOT_FOUND_BY_ID + id, HttpStatus.NOT_FOUND));

        // Check if category has products - REMOVED strictly to allow cascade delete as requested.
        // if (category.getProducts() != null && !category.getProducts().isEmpty()) {
        //    throw new CommonException(CANNOT_DELETE_CATEGORY_WITH_PRODUCTS, HttpStatus.BAD_REQUEST);
        // }

        categoryRepository.delete(category);
    }

    private CategoryResponse convertToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setSlug(category.getSlug());
        response.setDescription(category.getDescription());
        response.setImage(category.getImage());
        response.setCreatedAt(category.getCreatedAt());
        response.setUpdatedAt(category.getUpdatedAt());
        // Use a separate query to count products to avoid LazyInitializationException
        response.setProductCount(categoryRepository.countProductsByCategoryId(category.getId()));
        return response;
    }
}
