package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ProductSpecification {

    public static Specification<Product> hasFactoryIn(List<String> factories) {
        return (root, query, criteriaBuilder) -> {
            if (factories == null || factories.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return root.get("factory").in(factories);
        };
    }

    public static Specification<Product> hasTargetIn(List<String> targets) {
        return (root, query, criteriaBuilder) -> {
            if (targets == null || targets.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return root.get("target").in(targets);
        };
    }

    public static Specification<Product> hasPriceBetween(Double min, Double max) {
        return (root, query, criteriaBuilder) -> {
            if (min == null && max == null) {
                return criteriaBuilder.conjunction();
            }
            if (min != null && max != null) {
                return criteriaBuilder.between(root.get("price"), min, max);
            }
            if (min != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), min);
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("price"), max);
        };
    }

    public static Specification<Product> nameContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
        };
    }
}
