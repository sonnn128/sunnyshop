
package com.chd.base.service.impl;

import com.chd.base.exception.CommonException;
import com.chd.base.service.UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {

	@Value("${app.upload.dir:uploads}")
	private String uploadDir;

	@Override
	public String uploadImage(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new CommonException("File is empty", HttpStatus.BAD_REQUEST);
		}

		// Validate file type
		String contentType = file.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			throw new CommonException("File must be an image", HttpStatus.BAD_REQUEST);
		}

		// Validate file size (max 10MB)
		long maxSize = 10 * 1024 * 1024; // 10MB
		if (file.getSize() > maxSize) {
			throw new CommonException("File size must not exceed 10MB", HttpStatus.BAD_REQUEST);
		}

		try {
			// Create upload directory if it doesn't exist
			Path uploadPath = Paths.get(uploadDir);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			// Generate unique filename
			String originalFilename = file.getOriginalFilename();
			String fileExtension = originalFilename != null 
				? originalFilename.substring(originalFilename.lastIndexOf(".")) 
				: ".jpg";
			String uniqueFilename = "IMG_" + UUID.randomUUID().toString() + fileExtension;

			// Save file to disk
			Path filePath = uploadPath.resolve(uniqueFilename);
			Files.write(filePath, file.getBytes());

			// Return URL for accessing the image
			String imageUrl = "/uploads/" + uniqueFilename;
			log.info("Image uploaded successfully: {}", imageUrl);
			return imageUrl;

		} catch (IOException e) {
			log.error("Error uploading image", e);
			throw new CommonException("Failed to upload image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
