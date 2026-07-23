package com.sonnguyen.trendwearshop.service;

import com.sonnguyen.trendwearshop.exception.CommonException;
import com.sonnguyen.trendwearshop.model.Category;
import com.sonnguyen.trendwearshop.model.Product;
import com.sonnguyen.trendwearshop.payload.request.ProductRequest;
import com.sonnguyen.trendwearshop.payload.response.ProductResponse;
import com.sonnguyen.trendwearshop.repository.CategoryRepository;
import com.sonnguyen.trendwearshop.repository.ProductRepository;
import com.sonnguyen.trendwearshop.repository.ProductSpecification;
import com.sonnguyen.trendwearshop.utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import com.sonnguyen.trendwearshop.repository.ProductVariantRepository;
import com.sonnguyen.trendwearshop.model.ProductVariant;
import com.sonnguyen.trendwearshop.payload.response.ProductVariantResponse;
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
    private final ProductVariantRepository productVariantRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, 
                          FileStorageService fileStorageService, ProductVariantRepository productVariantRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
        this.productVariantRepository = productVariantRepository;
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
                    product.setSizes(request.getSizes());
                    product.setColors(request.getColors());
                    product.setImages(request.getImages());
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
            List<Long> categories,
            Double minPrice,
            Double maxPrice,
            String keyword,
            Pageable pageable) {
        
        Specification<Product> spec = Specification.where(ProductSpecification.hasFactoryIn(factories))
                .and(ProductSpecification.hasTargetIn(targets))
                .and(ProductSpecification.hasCategoryIn(categories))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecification.nameContains(keyword));

        return productRepository.findAll(spec, pageable).map(ModelMapper::toProductResponse);
    }
    public void saveBulk(List<com.sonnguyen.trendwearshop.payload.request.BulkProductRequest> requests) {
        List<Product> products = new java.util.ArrayList<>();
        
        for (com.sonnguyen.trendwearshop.payload.request.BulkProductRequest request : requests) {
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

    @Transactional
    public List<ProductVariantResponse> updateProductVariants(Long productId, List<ProductVariantResponse> variantsRequest) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CommonException("Product not found with id: " + productId, HttpStatus.NOT_FOUND));

        // Delete existing variants
        List<ProductVariant> existing = productVariantRepository.findByProduct(product);
        productVariantRepository.deleteAll(existing);

        // Create new variants
        List<ProductVariant> newVariants = variantsRequest.stream()
                .map(req -> {
                    ProductVariant pv = new ProductVariant();
                    pv.setProduct(product);
                    pv.setSize(req.getSize());
                    pv.setColor(req.getColor());
                    pv.setQuantity(req.getQuantity());
                    return pv;
                })
                .toList();

        List<ProductVariant> saved = productVariantRepository.saveAll(newVariants);
        
        // Update product overall quantity to sum of variants quantities
        long totalQuantity = saved.stream().mapToInt(ProductVariant::getQuantity).sum();
        product.setQuantity(totalQuantity);
        productRepository.save(product);

        return saved.stream()
                .map(variant -> {
                    ProductVariantResponse vr = new ProductVariantResponse();
                    vr.setId(variant.getId());
                    vr.setSize(variant.getSize());
                    vr.setColor(variant.getColor());
                    vr.setQuantity(variant.getQuantity());
                    return vr;
                })
                .toList();
    }

    public List<ProductVariantResponse> getProductVariants(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CommonException("Product not found with id: " + productId, HttpStatus.NOT_FOUND));

        return productVariantRepository.findByProduct(product).stream()
                .map(variant -> {
                    ProductVariantResponse vr = new ProductVariantResponse();
                    vr.setId(variant.getId());
                    vr.setSize(variant.getSize());
                    vr.setColor(variant.getColor());
                    vr.setQuantity(variant.getQuantity());
                    return vr;
                })
                .toList();
    }
}
