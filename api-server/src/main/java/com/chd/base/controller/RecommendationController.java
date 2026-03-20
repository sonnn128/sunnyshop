
package com.chd.base.controller;

import com.chd.base.model.Product;
import com.chd.base.service.RecommendationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

	private final RecommendationService recommendationService;

	public RecommendationController(RecommendationService recommendationService) {
		this.recommendationService = recommendationService;
	}

	@GetMapping
	public List<Product> getRecommendations(@RequestParam(required = false) String userId,
			@RequestParam(required = false) Long productId, @RequestParam(defaultValue = "8") int limit) {
		return recommendationService.getRecommendations(userId, productId, limit);
	}

	@GetMapping("/trending")
	public List<Product> getTrendingProducts(@RequestParam(defaultValue = "10") int limit) {
		return recommendationService.getTrendingProducts(limit);
	}
}
