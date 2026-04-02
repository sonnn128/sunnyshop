package com.sonnguyen.laptopshop.config;

import com.sonnguyen.laptopshop.model.Role;
import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.repository.RoleRepository;
import com.sonnguyen.laptopshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting data initialization...");
        
        // Create roles
        createRoles();
        
        // Create admin user
        createAdminUser();
        
        log.info("Data initialization completed!");
    }

    private void createRoles() {
        // Create USER role
        if (!roleRepository.existsById("USER")) {
            Role userRole = new Role();
            userRole.setId("USER");
            roleRepository.save(userRole);
            log.info("Created USER role");
        }

        // Create ADMIN role
        if (!roleRepository.existsById("ADMIN")) {
            Role adminRole = new Role();
            adminRole.setId("ADMIN");
            roleRepository.save(adminRole);
            log.info("Created ADMIN role");
        }
    }

    private void createAdminUser() {
        String adminUsername = "admin";
        String adminEmail = "admin@laptopshop.com";
        
        if (!userRepository.existsByUsername(adminUsername)) {
            // Get ADMIN role
            Role adminRole = roleRepository.findById("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            // Create admin user
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setFullName("System Administrator");
            admin.setPassword(passwordEncoder.encode("admin123"));

            // Set roles
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
            log.info("Created admin user: {}", adminUsername);
        } else {
            log.info("Admin user already exists");
        }
    }
}
