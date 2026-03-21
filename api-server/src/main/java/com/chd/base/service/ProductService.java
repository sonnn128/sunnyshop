package com.chd.base.service;

import com.chd.base.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface ProductService {
	Page<Product> searchProducts(String status, Boolean featured, Long categoryId, String search, Pageable pageable);
	Product getById(Long id);
	Product create(Map<String, Object> payload);
	Product update(Long id, Map<String, Object> payload);
	void delete(Long id);
	Map<String, Object> importProducts(List<Map<String, Object>> products);
}
