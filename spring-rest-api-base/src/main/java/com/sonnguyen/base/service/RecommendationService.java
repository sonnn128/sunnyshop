
package com.sonnguyen.base.service;

import com.sonnguyen.base.model.Product;

import java.util.List;

public interface RecommendationService {
    List<Product> getRecommendations(Long userId, Long productId, int limit);
    List<Product> getRelatedProducts(Long productId, int limit);
    List<Product> getPopularProducts(int limit);
    List<Product> getPersonalizedRecommendations(Long userId, int limit);
    List<Product> getTrendingProducts(int limit);
}
