
package com.chd.base.service.impl;

import com.chd.base.exception.CommonException;
import com.chd.base.service.UploadService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {

	private final Cloudinary cloudinary;

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
			// Generate unique public_id
			String publicId = "product_" + UUID.randomUUID().toString();

			// Upload to cloudinary with options
			Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
					ObjectUtils.asMap(
							"public_id", publicId,
							"folder", "sunny-fashion",
							"resource_type", "image"
					));

			// Return secure URL
			String secureUrl = (String) uploadResult.get("secure_url");
			log.info("Image uploaded successfully: {}", secureUrl);
			return secureUrl;

		} catch (IOException e) {
			log.error("Error uploading image to Cloudinary", e);
			throw new CommonException("Failed to upload image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
