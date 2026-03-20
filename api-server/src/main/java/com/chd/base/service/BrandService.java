package com.chd.base.service;

import com.chd.base.model.Brand;
import com.chd.base.repository.BrandRepository;
import com.chd.base.utils.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {
	private final BrandRepository brandRepository;
	// private final ProductRepository productRepository; // Để check trước khi xóa

	public List<Brand> list(boolean activeOnly, String search) {
		return brandRepository.findAllFiltered(activeOnly, search);
	}

	public Brand getByIdOrSlug(String idOrSlug) {
		if (idOrSlug.matches("^\\d+$")) {
			return brandRepository.findById(Long.parseLong(idOrSlug))
					.orElseThrow(() -> new RuntimeException("Brand not found"));
		}
		return brandRepository.findBySlug(idOrSlug).orElseThrow(() -> new RuntimeException("Brand not found"));
	}

	@Transactional
	public Brand create(Brand brandReq) {
		if (brandRepository.existsByNameIgnoreCase(brandReq.getName())) {
			throw new IllegalArgumentException("Brand name already exists");
		}

		String slug = SlugUtils.generateSlug(brandReq.getName());
		if (brandRepository.existsBySlug(slug)) {
			slug = slug + "-" + System.currentTimeMillis() % 1000;
		}

		brandReq.setSlug(slug);
		brandReq.setActive(true);
		return brandRepository.save(brandReq);
	}

	@Transactional
	public Brand update(Long id, Brand updates) {
		Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found"));

		if (updates.getName() != null && !updates.getName().equals(brand.getName())) {
			brand.setName(updates.getName());
			brand.setSlug(SlugUtils.generateSlug(updates.getName()));
		}

		if (updates.getLogoUrl() != null)
			brand.setLogoUrl(updates.getLogoUrl());
		if (updates.getDescription() != null)
			brand.setDescription(updates.getDescription());
		if (updates.getWebsite() != null)
			brand.setWebsite(updates.getWebsite());
		brand.setSortOrder(updates.getSortOrder());
		brand.setActive(updates.isActive());

		return brandRepository.save(brand);
	}

	@Transactional
	public void remove(Long id) {
		// Giả sử có ProductRepository để kiểm tra
		// long count = productRepository.countByBrandId(id);
		// if (count > 0) throw new RuntimeException("Cannot delete brand. It is used by
		// products.");

		brandRepository.deleteById(id);
	}

	@Transactional
	public Brand toggleActive(Long id) {
		Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found"));
		brand.setActive(!brand.isActive());
		return brandRepository.save(brand);
	}
}
