package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.model.Permission;
import com.sonnguyen.laptopshop.service.PermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionService.getAllPermissions());
    }

    @PostMapping
    public ResponseEntity<Permission> createPermission(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String description = payload.get("description");
        return ResponseEntity.ok(permissionService.createPermission(name, description));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable String id) {
        permissionService.deletePermission(id);
        return ResponseEntity.ok().build();
    }
}
