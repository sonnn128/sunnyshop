package com.sonnguyen.base.controller;

import com.sonnguyen.base.model.Brand;
import com.sonnguyen.base.model.User;
import com.sonnguyen.base.service.BrandService;
import com.sonnguyen.base.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    // Helper kiểm tra role giống Node.js
    private boolean hasManagementAccess() {
        User user = SecurityUtils.getCurrentUser();
        return user.getRoles().stream()
                .anyMatch(r -> Arrays.asList("ROLE_ADMIN", "ROLE_MANAGER", "ROLE_STAFF").contains(r.getId()));
    }

    @GetMapping
    public ResponseEntity<?> list(
        @RequestParam(required = false, defaultValue = "false") boolean active_only,
        @RequestParam(required = false) String search) {
        return ResponseEntity.ok(Map.of("brands", brandService.list(active_only, search)));
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<?> get(@PathVariable String idOrSlug) {
        try {
            return ResponseEntity.ok(Map.of("brand", brandService.getByIdOrSlug(idOrSlug)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Brand brand) {
        if (!hasManagementAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden"));
        }
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("brand", brandService.create(brand)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Brand updates) {
        if (!hasManagementAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden"));
        }
        return ResponseEntity.ok(Map.of("brand", brandService.update(id, updates)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id) {
        User user = SecurityUtils.getCurrentUser();
        boolean hasAccess = user.getRoles().stream()
                .anyMatch(r -> Arrays.asList("ROLE_ADMIN", "ROLE_MANAGER").contains(r.getId()));
        if (!hasAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden"));
        }
        try {
            brandService.remove(id);
            return ResponseEntity.ok(Map.of("ok", true, "message", "Brand deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<?> toggleActive(@PathVariable Long id) {
        if (!hasManagementAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden"));
        }
        return ResponseEntity.ok(Map.of("brand", brandService.toggleActive(id)));
    }
}
