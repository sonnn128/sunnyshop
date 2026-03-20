
package com.chd.base.service;

import com.chd.base.model.Product;

import java.util.List;

public interface RecommendationService {
	List<Product> getRecommendations(String userId, Long productId, int limit);
	List<Product> getRelatedProducts(Long productId, int limit);
	List<Product> getPopularProducts(int limit);
	List<Product> getPersonalizedRecommendations(String userId, int limit);
	List<Product> getTrendingProducts(int limit);
}
