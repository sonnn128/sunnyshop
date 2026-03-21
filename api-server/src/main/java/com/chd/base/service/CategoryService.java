package com.chd.base.service;

import com.chd.base.model.Category;

import java.util.List;
import java.util.Map;

public interface CategoryService {
	List<Category> getAll();
	Category getById(Long id);
	Category create(Map<String, Object> payload);
	Category update(Long id, Map<String, Object> payload);
	void delete(Long id);
}
