package com.sonnguyen.laptopshop.service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

public interface FileStorageService {
    String storeFile(MultipartFile file);
    Resource loadFileAsResource(String fileName);
}
