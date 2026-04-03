package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.payload.TargetRequest;
import com.sonnguyen.laptopshop.payload.TargetResponse;
import com.sonnguyen.laptopshop.service.TargetService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/targets")
@RequiredArgsConstructor
@Tag(name = "Targets")
public class TargetController {

    private final TargetService targetService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<TargetResponse>> getAllTargets() {
        return ResponseEntity.ok(targetService.getAllTargets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TargetResponse> getTargetById(@PathVariable Long id) {
        return ResponseEntity.ok(targetService.getTargetById(id));
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TargetResponse> createTarget(
            @RequestPart("target") String targetStr,
            @RequestPart(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile) throws java.io.IOException {
        TargetRequest request = objectMapper.readValue(targetStr, TargetRequest.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(targetService.createTarget(request, imageFile));
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TargetResponse> createTargetJson(@Valid @RequestBody TargetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(targetService.createTarget(request, null));
    }

    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TargetResponse> updateTarget(
            @PathVariable Long id, 
            @RequestPart("target") String targetStr,
            @RequestPart(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile) throws java.io.IOException {
        TargetRequest request = objectMapper.readValue(targetStr, TargetRequest.class);
        return ResponseEntity.ok(targetService.updateTarget(id, request, imageFile));
    }

    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TargetResponse> updateTargetJson(
            @PathVariable Long id, 
            @Valid @RequestBody TargetRequest request) {
        return ResponseEntity.ok(targetService.updateTarget(id, request, null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.sonnguyen.laptopshop.payload.response.ApiResponse<?>> deleteTarget(@PathVariable Long id) {
        targetService.deleteTarget(id);
        return ResponseEntity.ok(
                com.sonnguyen.laptopshop.payload.response.ApiResponse.builder()
                        .success(true)
                        .message("Target deleted successfully")
                        .build()
        );
    }
}
