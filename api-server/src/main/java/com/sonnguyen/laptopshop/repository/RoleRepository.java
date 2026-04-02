package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findById(String id);
    boolean existsById(String id);
}
