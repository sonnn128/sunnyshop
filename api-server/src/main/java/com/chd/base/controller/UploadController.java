
package com.chd.base.controller;

import com.chd.base.payload.response.ApiResponse;
import com.chd.base.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
public class UploadController {

	private final UploadService uploadService;

	@PostMapping("/image")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
		String imageUrl = uploadService.uploadImage(file);

		Map<String, String> data = new HashMap<>();
		data.put("url", imageUrl);

		return ResponseEntity.ok(ApiResponse.builder()
				.success(true)
				.message("Image uploaded successfully")
				.data(data)
				.build());
	}

	@PostMapping("/images")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
	public ResponseEntity<?> uploadMultipleImages(@RequestParam("files") MultipartFile[] files) {
		java.util.List<String> imageUrls = new java.util.ArrayList<>();

		for (MultipartFile file : files) {
			String imageUrl = uploadService.uploadImage(file);
			imageUrls.add(imageUrl);
		}

		Map<String, Object> data = new HashMap<>();
		data.put("urls", imageUrls);
		data.put("count", imageUrls.size());

		return ResponseEntity.ok(ApiResponse.builder()
				.success(true)
				.message("Images uploaded successfully")
				.data(data)
				.build());
	}
}
