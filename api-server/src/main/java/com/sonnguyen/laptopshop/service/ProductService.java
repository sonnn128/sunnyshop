package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.exception.CommonException;
import com.sonnguyen.laptopshop.model.Category;
import com.sonnguyen.laptopshop.model.Product;
import com.sonnguyen.laptopshop.payload.request.ProductRequest;
import com.sonnguyen.laptopshop.payload.response.ProductResponse;
import com.sonnguyen.laptopshop.repository.CategoryRepository;
import com.sonnguyen.laptopshop.repository.ProductRepository;
import com.sonnguyen.laptopshop.repository.ProductSpecification;
import com.sonnguyen.laptopshop.utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, FileStorageService fileStorageService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
    }

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(ModelMapper::toProductResponse);
    }

    public Optional<ProductResponse> getProductById(Long id) {
        return productRepository.findById(id)
                .map(ModelMapper::toProductResponse);
    }

    public ProductResponse createProduct(ProductRequest request, org.springframework.web.multipart.MultipartFile imageFile) {
        // Find category by ID
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CommonException("Category not found with id: " + request.getCategoryId(), HttpStatus.NOT_FOUND));
        
        Product product = ModelMapper.toProduct(request);
        
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(imageFile);
            product.setImage(imageUrl);
        }

        product.setCategory(category);
        Product savedProduct = productRepository.save(product);
        return ModelMapper.toProductResponse(savedProduct);
    }

    public Optional<ProductResponse> updateProduct(Long id, ProductRequest request, org.springframework.web.multipart.MultipartFile imageFile) {
        return productRepository.findById(id)
                .map(product -> {
                    // Find category by ID
                    Category category = categoryRepository.findById(request.getCategoryId())
                            .orElseThrow(() -> new CommonException("Category not found with id: " + request.getCategoryId(), HttpStatus.NOT_FOUND));
                    
                    product.setName(request.getName());
                    product.setPrice(request.getPrice());
                    
                    if (imageFile != null && !imageFile.isEmpty()) {
                         String imageUrl = fileStorageService.storeFile(imageFile);
                         product.setImage(imageUrl);
                    } else if (request.getImage() != null && !request.getImage().isEmpty()) {
                        // Keep content if just updating other fields and image URL is passed (e.g. existing url)
                        product.setImage(request.getImage());
                    }
                    
                    product.setDescription(request.getDescription());
                    product.setQuantity(request.getQuantity());
                    product.setFactory(request.getFactory());
                    product.setTarget(request.getTarget());
                    product.setCategory(category);
                    return productRepository.save(product);
                })
                .map(ModelMapper::toProductResponse);
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.findByKeyword(keyword, pageable);
        return products.map(ModelMapper::toProductResponse);
    }

    public Page<ProductResponse> getProductsByFactory(String factory, Pageable pageable) {
        Page<Product> products = productRepository.findByFactory(factory, pageable);
        return products.map(ModelMapper::toProductResponse);
    }

    public Page<ProductResponse> getProductsByPriceRange(Double minPrice, Double maxPrice, Pageable pageable) {
        Page<Product> products = productRepository.findByPriceRange(minPrice, maxPrice, pageable);
        return products.map(ModelMapper::toProductResponse);
    }

    public List<String> getAllFactories() {
        return productRepository.findAllFactories();
    }

    public Page<ProductResponse> getAvailableProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAvailableProducts(pageable);
        return products.map(ModelMapper::toProductResponse);
    }

    public Page<ProductResponse> getTopSellingProducts(Pageable pageable) {
        Page<Product> products = productRepository.findTopSellingProducts(pageable);
        return products.map(ModelMapper::toProductResponse);
    }

    public Page<ProductResponse> getProductsWithFilters(
            List<String> factories,
            List<String> targets,
            Double minPrice,
            Double maxPrice,
            String keyword,
            Pageable pageable) {
        
        Specification<Product> spec = Specification.where(ProductSpecification.hasFactoryIn(factories))
                .and(ProductSpecification.hasTargetIn(targets))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecification.nameContains(keyword));

        return productRepository.findAll(spec, pageable).map(ModelMapper::toProductResponse);
    }
    public void saveBulk(List<com.sonnguyen.laptopshop.payload.request.BulkProductRequest> requests) {
        List<Product> products = new java.util.ArrayList<>();
        
        for (com.sonnguyen.laptopshop.payload.request.BulkProductRequest request : requests) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CommonException("Category not found with id: " + request.getCategoryId(), HttpStatus.BAD_REQUEST));
            
            Product product = new Product();
            product.setName(request.getName());
            product.setPrice(request.getPrice());
            product.setImage(request.getImage());
            product.setDescription(request.getDescription());
            product.setQuantity(request.getQuantity());
            product.setFactory(request.getFactory());
            product.setTarget(request.getTarget());
            product.setCategory(category);
            
            // Default values
            product.setSold(0L); 
            
            products.add(product);
        }
        
        productRepository.saveAll(products);
    }

    public void deleteProducts(List<Long> ids) {
        productRepository.deleteAllById(ids);
    }
}
