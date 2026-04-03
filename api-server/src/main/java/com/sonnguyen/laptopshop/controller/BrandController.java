package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.payload.BrandRequest;
import com.sonnguyen.laptopshop.payload.BrandResponse;
import com.sonnguyen.laptopshop.service.BrandService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/brands")
@RequiredArgsConstructor
@Tag(name = "Brands")
public class BrandController {

    private final BrandService brandService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<BrandResponse>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BrandResponse> getBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.getBrandById(id));
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandResponse> createBrand(
            @RequestPart("brand") String brandStr,
            @RequestPart(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile) throws java.io.IOException {
        BrandRequest request = objectMapper.readValue(brandStr, BrandRequest.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(brandService.createBrand(request, imageFile));
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandResponse> createBrandJson(@Valid @RequestBody BrandRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(brandService.createBrand(request, null));
    }

    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandResponse> updateBrand(
            @PathVariable Long id, 
            @RequestPart("brand") String brandStr,
            @RequestPart(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile) throws java.io.IOException {
        BrandRequest request = objectMapper.readValue(brandStr, BrandRequest.class);
        return ResponseEntity.ok(brandService.updateBrand(id, request, imageFile));
    }

    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandResponse> updateBrandJson(
            @PathVariable Long id, 
            @Valid @RequestBody BrandRequest request) {
        return ResponseEntity.ok(brandService.updateBrand(id, request, null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.sonnguyen.laptopshop.payload.response.ApiResponse<?>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(
                com.sonnguyen.laptopshop.payload.response.ApiResponse.builder()
                        .success(true)
                        .message("Brand deleted successfully")
                        .build()
        );
    }
}
