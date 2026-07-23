package com.sonnguyen.trendwearshop.service;

import com.sonnguyen.trendwearshop.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface ExcelService {
    void save(MultipartFile file);
    ByteArrayInputStream loadTemplate();
    List<Product> getAllProducts();
}
