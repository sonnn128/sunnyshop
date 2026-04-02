package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface ExcelService {
    void save(MultipartFile file);
    ByteArrayInputStream loadTemplate();
    List<Product> getAllProducts();
}
