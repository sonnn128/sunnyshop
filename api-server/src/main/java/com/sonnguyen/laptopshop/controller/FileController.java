package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.payload.response.ApiResponse;
import com.sonnguyen.laptopshop.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "File management APIs")
public class FileController {

    private final FileStorageService fileStorageService;

    @Operation(summary = "Upload File", description = "Upload a file to Cloudinary")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestPart("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("File uploaded successfully")
                .data(fileUrl)
                .build());
    }
}
