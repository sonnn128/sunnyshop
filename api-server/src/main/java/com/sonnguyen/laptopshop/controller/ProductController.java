package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.payload.request.ProductRequest;
import com.sonnguyen.laptopshop.payload.response.ProductResponse;
import com.sonnguyen.laptopshop.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
// 
@Tag(name = "Products", description = "Product management APIs")
public class ProductController {

    private final ProductService productService;
    private final com.sonnguyen.laptopshop.service.ExcelService excelService;

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public ProductController(ProductService productService, com.sonnguyen.laptopshop.service.ExcelService excelService, com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.productService = productService;
        this.excelService = excelService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ProductResponse> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(product -> ResponseEntity.ok(product))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(
            @RequestPart("product") String productStr,
            @RequestPart(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile) throws java.io.IOException {
        ProductRequest request = objectMapper.readValue(productStr, ProductRequest.class);
        ProductResponse product = productService.createProduct(request, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> createProductJson(@Valid @RequestBody ProductRequest productRequest) {
        ProductResponse product = productService.createProduct(productRequest, null);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id, 
            @RequestPart("product") String productStr,
            @RequestPart(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile) throws java.io.IOException {
        ProductRequest request = objectMapper.readValue(productStr, ProductRequest.class);
        return productService.updateProduct(id, request, imageFile)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> updateProductJson(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest productRequest) {
        return productService.updateProduct(id, productRequest, null)
                .map(product -> ResponseEntity.ok(product))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.sonnguyen.laptopshop.payload.response.ApiResponse> deleteProduct(@PathVariable Long id) {
        if (productService.deleteProduct(id)) {
            return ResponseEntity.ok(
                    com.sonnguyen.laptopshop.payload.response.ApiResponse.builder()
                            .success(true)
                            .message("Product deleted successfully")
                            .build()
            );
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                com.sonnguyen.laptopshop.payload.response.ApiResponse.builder()
                        .success(false)
                        .message("Product not found")
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.searchProducts(keyword, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/factory/{factory}")
    public ResponseEntity<Page<ProductResponse>> getProductsByFactory(
            @PathVariable String factory,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getProductsByFactory(factory, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/price-range")
    public ResponseEntity<Page<ProductResponse>> getProductsByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/factories")
    public ResponseEntity<List<String>> getAllFactories() {
        List<String> factories = productService.getAllFactories();
        return ResponseEntity.ok(factories);
    }

    @GetMapping("/available")
    public ResponseEntity<Page<ProductResponse>> getAvailableProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getAvailableProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/top-selling")
    public ResponseEntity<Page<ProductResponse>> getTopSellingProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getTopSellingProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<ProductResponse>> filterProducts(
            @RequestParam(required = false) List<String> factory,
            @RequestParam(required = false) List<String> target,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductResponse> products = productService.getProductsWithFilters(factory, target, minPrice, maxPrice, keyword, pageable);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/bulk")
    public ResponseEntity<String> bulkCreate(@RequestBody List<com.sonnguyen.laptopshop.payload.request.BulkProductRequest> products) {
        try {
            this.productService.saveBulk(products);
            return ResponseEntity.ok("Imported " + products.size() + " products successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to import: " + e.getMessage());
        }
    }
    @DeleteMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> bulkDelete(@RequestBody List<Long> ids) {
        this.productService.deleteProducts(ids);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/upload", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadFile(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        if (com.sonnguyen.laptopshop.utils.ExcelHelper.hasExcelFormat(file)) {
            try {
                excelService.save(file);
                return ResponseEntity.status(HttpStatus.OK).body("Uploaded the file successfully: " + file.getOriginalFilename());
            } catch (Exception e) {
                e.printStackTrace(); // Log to server console
                return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Fail to upload file: " + e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload an excel file!");
    }

    @GetMapping("/template")
    public ResponseEntity<org.springframework.core.io.Resource> getTemplate() {
        String filename = "products_template.xlsx";
        org.springframework.core.io.InputStreamResource file = new org.springframework.core.io.InputStreamResource(excelService.loadTemplate());

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }
}
