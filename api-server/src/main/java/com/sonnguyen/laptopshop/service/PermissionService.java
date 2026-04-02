package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.model.Permission;
import com.sonnguyen.laptopshop.repository.PermissionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PermissionService {
    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    public Permission createPermission(String id, String description) {
        if (permissionRepository.existsById(id)) {
            throw new RuntimeException("Permission already exists");
        }
        Permission permission = new Permission();
        permission.setId(id);
        permission.setDescription(description);
        return permissionRepository.save(permission);
    }

    public void deletePermission(String id) {
        permissionRepository.deleteById(id);
    }
}
