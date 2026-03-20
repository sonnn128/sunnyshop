package com.chd.base.config;

import com.chd.base.model.Role;
import com.chd.base.model.User;
import com.chd.base.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

/**
 * Initializes application data on startup.
 * Creates default ADMIN role and administrative user if not exists.
 */
@Component
public class DataInitializer implements ApplicationListener<ContextRefreshedEvent> {

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	@Transactional
	public void onApplicationEvent(ContextRefreshedEvent event) {
		// Create ADMIN role if not exists
		Role adminRole = roleRepository.findById("ADMIN").orElse(null);
		if (adminRole == null) {
			adminRole = new Role();
			adminRole.setId("ADMIN");
			adminRole.setPermissions(new HashSet<>());
			roleRepository.save(adminRole);
		}

		// Create default admin user if not exists
		// Note: Uncomment when UserRepository is available
		// User existingUser = userRepository.findByUsername("admin").orElse(null);
		// if (existingUser == null) {
		//     User adminUser = new User();
		//     adminUser.setUsername("admin");
		//     adminUser.setPassword(passwordEncoder.encode("admin"));
		//     Set<Role> roles = new HashSet<>();
		//     roles.add(adminRole);
		//     adminUser.setRoles(roles);
		//     userRepository.save(adminUser);
		// }
	}
}
