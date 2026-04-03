package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.exception.CommonException;
import com.sonnguyen.laptopshop.model.Target;
import com.sonnguyen.laptopshop.payload.TargetRequest;
import com.sonnguyen.laptopshop.payload.TargetResponse;
import com.sonnguyen.laptopshop.repository.TargetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TargetService {

    private final TargetRepository targetRepository;
    private final FileStorageService fileStorageService;

    public List<TargetResponse> getAllTargets() {
        return targetRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TargetResponse getTargetById(Long id) {
        Target target = targetRepository.findById(id)
                .orElseThrow(() -> new CommonException("Target not found", HttpStatus.NOT_FOUND));
        return convertToResponse(target);
    }

    @Transactional
    public TargetResponse createTarget(TargetRequest request, org.springframework.web.multipart.MultipartFile imageFile) {
        if (targetRepository.existsBySlug(request.getSlug())) {
            throw new CommonException("Target with slug already exists", HttpStatus.CONFLICT);
        }

        Target target = new Target();
        target.setName(request.getName());
        target.setSlug(request.getSlug());
        target.setDescription(request.getDescription());
        target.setStatus(request.getStatus() != null ? request.getStatus() : "active");
        
        if (imageFile != null && !imageFile.isEmpty()) {
            target.setImage(fileStorageService.storeFile(imageFile));
        } else {
            target.setImage(request.getImage());
        }

        return convertToResponse(targetRepository.save(target));
    }

    @Transactional
    public TargetResponse updateTarget(Long id, TargetRequest request, org.springframework.web.multipart.MultipartFile imageFile) {
        Target target = targetRepository.findById(id)
                .orElseThrow(() -> new CommonException("Target not found", HttpStatus.NOT_FOUND));

        if (targetRepository.existsBySlugAndIdNot(request.getSlug(), id)) {
            throw new CommonException("Target with slug already exists", HttpStatus.CONFLICT);
        }

        target.setName(request.getName());
        target.setSlug(request.getSlug());
        target.setDescription(request.getDescription());
        target.setStatus(request.getStatus() != null ? request.getStatus() : "active");
        
        if (imageFile != null && !imageFile.isEmpty()) {
            target.setImage(fileStorageService.storeFile(imageFile));
        } else if (request.getImage() != null && !request.getImage().isEmpty()) {
            target.setImage(request.getImage());
        }

        return convertToResponse(targetRepository.save(target));
    }

    @Transactional
    public void deleteTarget(Long id) {
        Target target = targetRepository.findById(id)
                .orElseThrow(() -> new CommonException("Target not found", HttpStatus.NOT_FOUND));
        targetRepository.delete(target);
    }

    private TargetResponse convertToResponse(Target target) {
        TargetResponse response = new TargetResponse();
        response.setId(target.getId());
        response.setName(target.getName());
        response.setSlug(target.getSlug());
        response.setDescription(target.getDescription());
        response.setImage(target.getImage());
        response.setStatus(target.getStatus());
        response.setCreatedAt(target.getCreatedAt());
        response.setUpdatedAt(target.getUpdatedAt());
        return response;
    }
}
