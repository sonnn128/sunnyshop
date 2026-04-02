package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findByUsername(String username);
    Page<User> findAllByUsernameContaining(String search, Pageable pageable);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findByEmail(String email);
    
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.id = :roleId")
    Page<User> findByRolesId(@Param("roleId") String roleId, Pageable pageable);
    
    @Query("SELECT u FROM User u JOIN u.roles r WHERE u.username LIKE %:keyword% AND r.id = :roleId")
    Page<User> findByUsernameContainingAndRolesId(@Param("keyword") String keyword, @Param("roleId") String roleId, Pageable pageable);
}