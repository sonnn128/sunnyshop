package com.chd.base.service.impl;

import com.chd.base.exception.CommonException;
import com.chd.base.model.Product;
import com.chd.base.model.ProductImage;
import com.chd.base.repository.BrandRepository;
import com.chd.base.repository.CategoryRepository;
import com.chd.base.repository.ProductRepository;
import com.chd.base.service.ProductService;
import com.chd.base.utils.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;
	private final BrandRepository brandRepository;

	@Override
	public Page<Product> searchProducts(String status, Boolean featured, Long categoryId, String search, Pageable pageable) {
		return productRepository.searchProducts(status, featured, categoryId, search, pageable);
	}

	@Override
	public Product getById(Long id) {
		return productRepository.findById(id)
				.orElseThrow(() -> new CommonException("Product not found", HttpStatus.NOT_FOUND));
	}

	@Override
	public Product create(Map<String, Object> payload) {
		String name = pickString(payload, "name", "name");
		String slug = pickString(payload, "slug", "slug");
		BigDecimal price = pickBigDecimal(payload, "price", "price", BigDecimal.ZERO);

		if (name == null || name.trim().isEmpty()) {
			throw new CommonException("Name is required", HttpStatus.BAD_REQUEST);
		}
		if (slug == null || slug.trim().isEmpty()) {
			throw new CommonException("Slug is required", HttpStatus.BAD_REQUEST);
		}
		if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
			throw new CommonException("Price must be greater than 0", HttpStatus.BAD_REQUEST);
		}
		if (productRepository.existsBySlugIgnoreCase(slug.trim())) {
			throw new CommonException("Slug already exists", HttpStatus.BAD_REQUEST);
		}

		Product product = new Product();
		product.setName(name.trim());
		product.setSlug(slug.trim());
		// Ensure new products default to "active" status if not explicitly set
		String status = pickString(payload, "status", "status");
		if (status == null || status.trim().isEmpty()) {
			product.setStatus("active");
		}
		applyPayload(product, payload, price);

		List<ProductImage> images = parseImages(payload.get("images"));
		if (!images.isEmpty()) {
			product.setImages(images);
		}

		return productRepository.save(product);
	}

	@Override
	public Product update(Long id, Map<String, Object> payload) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new CommonException("Product not found", HttpStatus.NOT_FOUND));

		String name = pickString(payload, "name", "name");
		String slug = pickString(payload, "slug", "slug");
		if (name != null && !name.trim().isEmpty()) {
			product.setName(name.trim());
		}
		if (slug != null && !slug.trim().isEmpty()) {
			Product existing = productRepository.findBySlugIgnoreCase(slug.trim()).orElse(null);
			if (existing != null && !existing.getId().equals(id)) {
				throw new CommonException("Slug already exists", HttpStatus.BAD_REQUEST);
			}
			product.setSlug(slug.trim());
		}

		applyPayload(product, payload, null);

		if (payload.containsKey("images")) {
			List<ProductImage> images = parseImages(payload.get("images"));
			product.setImages(images);
		}

		return productRepository.save(product);
	}

	@Override
	public void delete(Long id) {
		if (!productRepository.existsById(id)) {
			throw new CommonException("Product not found", HttpStatus.NOT_FOUND);
		}
		productRepository.deleteById(id);
	}

	@Override
	public Map<String, Object> importProducts(List<Map<String, Object>> products) {
		int success = 0;
		int failed = 0;
		List<String> errors = new ArrayList<>();

		if (products == null || products.isEmpty()) {
			throw new CommonException("Products payload is empty", HttpStatus.BAD_REQUEST);
		}

		int index = 0;
		for (Map<String, Object> payload : products) {
			try {
				Product product = createFromImport(payload);
				productRepository.save(product);
				success += 1;
			} catch (CommonException ex) {
				failed += 1;
				errors.add("Row " + (index + 1) + ": " + ex.getMessage());
			} catch (Exception ex) {
				failed += 1;
				errors.add("Row " + (index + 1) + ": Import failed");
			}
			index += 1;
		}

		Map<String, Object> result = new HashMap<>();
		result.put("success", success);
		result.put("failed", failed);
		result.put("errors", errors);
		return result;
	}

	private void applyPayload(Product product, Map<String, Object> payload, BigDecimal fallbackPrice) {
		product.setDescription(pickString(payload, "description", "description"));
		BigDecimal price = pickBigDecimal(payload, "price", "price", fallbackPrice != null ? fallbackPrice : product.getPrice());
		if (price != null) {
			product.setPrice(price);
		}
		product.setSalePrice(pickBigDecimal(payload, "sale_price", "salePrice",
				pickBigDecimal(payload, "original_price", "originalPrice", product.getSalePrice())));
		product.setCostPrice(pickBigDecimal(payload, "cost_price", "costPrice", product.getCostPrice()));
		if (payload.containsKey("stock_quantity") || payload.containsKey("stockQuantity")) {
			product.setStockQuantity(pickInt(payload, "stock_quantity", "stockQuantity", product.getStockQuantity()));
		}
		if (payload.containsKey("status")) {
			String status = pickString(payload, "status", "status");
			product.setStatus(status == null || status.trim().isEmpty() ? product.getStatus() : status.trim());
		}
		if (payload.containsKey("is_featured") || payload.containsKey("isFeatured")) {
			product.setFeatured(pickBoolean(payload, "is_featured", "isFeatured", product.isFeatured()));
		}

		Long categoryId = pickLong(payload, "category_id", "categoryId");
		if (payload.containsKey("category_id") || payload.containsKey("categoryId")) {
			if (categoryId == null) {
				product.setCategory(null);
			} else {
				categoryRepository.findById(categoryId).ifPresent(product::setCategory);
			}
		}

		Long brandId = pickLong(payload, "brand_id", "brandId");
		if (payload.containsKey("brand_id") || payload.containsKey("brandId")) {
			if (brandId == null) {
				product.setBrand(null);
			} else {
				brandRepository.findById(brandId).ifPresent(product::setBrand);
			}
		}
	}

	private Product createFromImport(Map<String, Object> payload) {
		String name = pickString(payload, "name", "name");
		if (name == null || name.trim().isEmpty()) {
			throw new CommonException("Name is required", HttpStatus.BAD_REQUEST);
		}
		String slug = pickString(payload, "slug", "slug");
		if (slug == null || slug.trim().isEmpty()) {
			slug = SlugUtils.generateSlug(name);
		}
		if (slug == null || slug.trim().isEmpty()) {
			throw new CommonException("Slug is required", HttpStatus.BAD_REQUEST);
		}

		slug = ensureUniqueSlug(slug.trim());

		BigDecimal price = pickBigDecimal(payload, "price", "price", BigDecimal.ZERO);
		if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
			throw new CommonException("Price must be greater than 0", HttpStatus.BAD_REQUEST);
		}

		Product product = new Product();
		product.setName(name.trim());
		product.setSlug(slug);
		applyPayload(product, payload, price);

		List<ProductImage> images = parseImages(payload.get("images"));
		if (!images.isEmpty()) {
			product.setImages(images);
		}

		return product;
	}

	private String ensureUniqueSlug(String slug) {
		if (!productRepository.existsBySlugIgnoreCase(slug)) {
			return slug;
		}
		int counter = 2;
		String candidate = slug + "-" + counter;
		while (productRepository.existsBySlugIgnoreCase(candidate)) {
			counter += 1;
			candidate = slug + "-" + counter;
		}
		return candidate;
	}

	private String pickString(Map<String, Object> payload, String snakeKey, String camelKey) {
		Object value = payload.getOrDefault(snakeKey, payload.get(camelKey));
		return value == null ? null : value.toString();
	}

	private String pickStringFromAny(Map<String, Object> payload, String... keys) {
		for (String key : keys) {
			if (payload.containsKey(key)) {
				Object value = payload.get(key);
				return value == null ? null : value.toString();
			}
		}
		return null;
	}

	private Long pickLong(Map<String, Object> payload, String snakeKey, String camelKey) {
		Object value = payload.getOrDefault(snakeKey, payload.get(camelKey));
		if (value == null) return null;
		if (value instanceof Number number) return number.longValue();
		String raw = value.toString().trim();
		if (raw.isEmpty()) return null;
		try {
			return Long.parseLong(raw);
		} catch (Exception ex) {
			return null;
		}
	}

	private Integer pickInt(Map<String, Object> payload, String snakeKey, String camelKey, Integer fallback) {
		Object value = payload.getOrDefault(snakeKey, payload.get(camelKey));
		if (value == null) return fallback;
		if (value instanceof Number number) return number.intValue();
		try {
			return Integer.parseInt(value.toString().trim());
		} catch (Exception ex) {
			return fallback;
		}
	}

	private Boolean pickBoolean(Map<String, Object> payload, String snakeKey, String camelKey, Boolean fallback) {
		Object value = payload.getOrDefault(snakeKey, payload.get(camelKey));
		if (value == null) return fallback;
		if (value instanceof Boolean bool) return bool;
		String raw = value.toString().trim().toLowerCase();
		if ("true".equals(raw) || "1".equals(raw) || "yes".equals(raw)) return true;
		if ("false".equals(raw) || "0".equals(raw) || "no".equals(raw)) return false;
		return fallback;
	}

	private BigDecimal pickBigDecimal(Map<String, Object> payload, String snakeKey, String camelKey, BigDecimal fallback) {
		Object value = payload.getOrDefault(snakeKey, payload.get(camelKey));
		if (value == null) return fallback;
		if (value instanceof Number number) return BigDecimal.valueOf(number.doubleValue());
		try {
			return new BigDecimal(value.toString().trim());
		} catch (Exception ex) {
			return fallback;
		}
	}

	private List<ProductImage> parseImages(Object imagesPayload) {
		if (!(imagesPayload instanceof Iterable<?> iterable)) return List.of();
		List<ProductImage> images = new ArrayList<>();
		int index = 0;
		for (Object item : iterable) {
			if (!(item instanceof Map<?, ?> raw)) {
				index += 1;
				continue;
			}
			@SuppressWarnings("unchecked")
			Map<String, Object> map = (Map<String, Object>) raw;
			String url = pickStringFromAny(map, "image_url", "imageUrl", "url");
			if (url == null || url.trim().isEmpty()) {
				index += 1;
				continue;
			}
			ProductImage image = new ProductImage();
			image.setImageUrl(url.trim());
			image.setAltText(pickStringFromAny(map, "alt_text", "altText", "alt"));
			Integer sortOrder = pickInt(map, "sort_order", "sortOrder", index);
			image.setSortOrder(sortOrder == null ? index : sortOrder);
			image.setPrimary(pickBoolean(map, "is_primary", "isPrimary", index == 0));
			images.add(image);
			index += 1;
		}
		return images;
	}
}
