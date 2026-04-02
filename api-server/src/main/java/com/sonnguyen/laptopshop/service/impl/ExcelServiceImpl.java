package com.sonnguyen.laptopshop.service.impl;

import com.sonnguyen.laptopshop.model.Product;
import com.sonnguyen.laptopshop.repository.ProductRepository;
import com.sonnguyen.laptopshop.service.ExcelService;
import com.sonnguyen.laptopshop.utils.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelServiceImpl implements ExcelService {

    private final ProductRepository productRepository;
    private final com.sonnguyen.laptopshop.repository.CategoryRepository categoryRepository;

    @Override
    public void save(MultipartFile file) {
        try {
            List<Product> products = ExcelHelper.excelToProducts(file.getInputStream());
            
            // Resolve categories
            for (Product product : products) {
                // Set default sold if null
                if (product.getSold() == null) product.setSold(0L);
                if (product.getImage() == null) product.setImage(""); 

                if (product.getCategory() != null && product.getCategory().getName() != null) {
                    String categoryName = product.getCategory().getName();
                    com.sonnguyen.laptopshop.model.Category category = categoryRepository.findByName(categoryName)
                            .orElseGet(() -> {
                                com.sonnguyen.laptopshop.model.Category newCategory = new com.sonnguyen.laptopshop.model.Category();
                                newCategory.setName(categoryName);
                                newCategory.setDescription("Created via Excel Import"); // Default description
                                // Generate slug roughly
                                newCategory.setSlug(categoryName.toLowerCase().replace(" ", "-") + "-" + System.currentTimeMillis()); // Ensure uniqueness
                                return categoryRepository.save(newCategory);
                            });
                    product.setCategory(category);
                }
            }
            
            productRepository.saveAll(products);
        } catch (IOException e) {
            throw new RuntimeException("fail to store excel data: " + e.getMessage());
        }
    }

    @Override
    public ByteArrayInputStream loadTemplate() {
        return ExcelHelper.productsToExcelTemplate();
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
