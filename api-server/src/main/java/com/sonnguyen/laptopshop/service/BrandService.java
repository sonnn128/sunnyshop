package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.exception.CommonException;
import com.sonnguyen.laptopshop.model.Brand;
import com.sonnguyen.laptopshop.payload.BrandRequest;
import com.sonnguyen.laptopshop.payload.BrandResponse;
import com.sonnguyen.laptopshop.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;
    private final FileStorageService fileStorageService;

    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BrandResponse getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new CommonException("Brand not found", HttpStatus.NOT_FOUND));
        return convertToResponse(brand);
    }

    @Transactional
    public BrandResponse createBrand(BrandRequest request, org.springframework.web.multipart.MultipartFile imageFile) {
        if (brandRepository.existsBySlug(request.getSlug())) {
            throw new CommonException("Brand with slug already exists", HttpStatus.CONFLICT);
        }

        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setSlug(request.getSlug());
        brand.setDescription(request.getDescription());
        brand.setStatus(request.getStatus() != null ? request.getStatus() : "active");
        
        if (imageFile != null && !imageFile.isEmpty()) {
            brand.setImage(fileStorageService.storeFile(imageFile));
        } else {
            brand.setImage(request.getImage());
        }

        return convertToResponse(brandRepository.save(brand));
    }

    @Transactional
    public BrandResponse updateBrand(Long id, BrandRequest request, org.springframework.web.multipart.MultipartFile imageFile) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new CommonException("Brand not found", HttpStatus.NOT_FOUND));

        if (brandRepository.existsBySlugAndIdNot(request.getSlug(), id)) {
            throw new CommonException("Brand with slug already exists", HttpStatus.CONFLICT);
        }

        brand.setName(request.getName());
        brand.setSlug(request.getSlug());
        brand.setDescription(request.getDescription());
        brand.setStatus(request.getStatus() != null ? request.getStatus() : "active");
        
        if (imageFile != null && !imageFile.isEmpty()) {
            brand.setImage(fileStorageService.storeFile(imageFile));
        } else if (request.getImage() != null && !request.getImage().isEmpty()) {
            brand.setImage(request.getImage());
        }

        return convertToResponse(brandRepository.save(brand));
    }

    @Transactional
    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new CommonException("Brand not found", HttpStatus.NOT_FOUND));
        brandRepository.delete(brand);
    }

    private BrandResponse convertToResponse(Brand brand) {
        BrandResponse response = new BrandResponse();
        response.setId(brand.getId());
        response.setName(brand.getName());
        response.setSlug(brand.getSlug());
        response.setDescription(brand.getDescription());
        response.setImage(brand.getImage());
        response.setStatus(brand.getStatus());
        response.setCreatedAt(brand.getCreatedAt());
        response.setUpdatedAt(brand.getUpdatedAt());
        return response;
    }
}
