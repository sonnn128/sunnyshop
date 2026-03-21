package com.chd.base.service.impl;

import com.chd.base.exception.CommonException;
import com.chd.base.model.Category;
import com.chd.base.repository.CategoryRepository;
import com.chd.base.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getById(Long id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new CommonException("Category not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public Category create(Map<String, Object> payload) {
        String name = pickString(payload, "name", "name");
        String slug = pickString(payload, "slug", "slug");

        if (name == null || name.trim().isEmpty() || slug == null || slug.trim().isEmpty()) {
            throw new CommonException("Name and slug are required", HttpStatus.BAD_REQUEST);
        }

        if (categoryRepository.findBySlug(slug.trim()).isPresent()) {
            throw new CommonException("Slug already exists", HttpStatus.BAD_REQUEST);
        }

        Category category = new Category();
        category.setName(name.trim());
        category.setSlug(slug.trim());
        category.setDescription(pickString(payload, "description", "description"));
        category.setImageUrl(pickString(payload, "image_url", "imageUrl"));
        category.setSortOrder(pickInt(payload, "sort_order", "sortOrder", 0));
        category.setActive(pickBoolean(payload, "is_active", "isActive", true));
        category.setFeatured(pickBoolean(payload, "is_featured", "isFeatured", false));

        Long parentId = parseParentId(payload.getOrDefault("parent_id", payload.get("parentId")));
        if (parentId != null) {
            categoryRepository.findById(parentId).ifPresent(category::setParent);
        }

        return categoryRepository.save(category);
    }

    @Override
    public Category update(Long id, Map<String, Object> payload) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new CommonException("Category not found", HttpStatus.NOT_FOUND));

        String name = pickString(payload, "name", "name");
        String slug = pickString(payload, "slug", "slug");

        if (name != null && !name.trim().isEmpty()) {
            category.setName(name.trim());
        }

        if (slug != null && !slug.trim().isEmpty()) {
            Category existed = categoryRepository.findBySlug(slug.trim()).orElse(null);
            if (existed != null && !existed.getId().equals(id)) {
                throw new CommonException("Slug already exists", HttpStatus.BAD_REQUEST);
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

        return categoryRepository.save(category);
    }

    @Override
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new CommonException("Category not found", HttpStatus.NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public String generateSlug(String name, Long excludeId) {
        if (name == null || name.trim().isEmpty()) {
            return "category-" + System.currentTimeMillis();
        }

        // Generate base slug from name
        String baseSlug = name
            .toLowerCase()
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-|-$", "");

        String slug = baseSlug;
        int counter = 1;

        while (categoryRepository.findBySlug(slug).isPresent()) {
            Category existing = categoryRepository.findBySlug(slug).get();
            if (excludeId != null && existing.getId().equals(excludeId)) {
                break;
            }
            slug = baseSlug + "-" + counter;
            counter++;
        }

        return slug;
    }

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

private Boolean pickBoolean(Map<String, Object> payload, String snakeKey, String camelKey, Boolean fallback) {
    Object value = payload.getOrDefault(snakeKey, payload.get(camelKey));
    if (value == null) {
        return fallback;
    }
    if (value instanceof Boolean bool) {
        return bool;
    }
    String raw = value.toString().trim().toLowerCase();
    if ("true".equals(raw) || "1".equals(raw) || "yes".equals(raw)) {
        return true;
    }
    if ("false".equals(raw) || "0".equals(raw) || "no".equals(raw)) {
        return false;
    }
    return fallback;
}
}
