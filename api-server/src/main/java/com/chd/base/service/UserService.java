// UserService.java
package com.chd.base.service;

import com.chd.base.exception.CommonException;
import com.chd.base.model.Role;
import com.chd.base.model.User;
import com.chd.base.payload.request.CreateUserDtoIn;
import com.chd.base.payload.request.PageRequestDtoIn;
import com.chd.base.repository.RoleRepository;
import com.chd.base.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;

	public Page<User> getAllBySearchString(PageRequestDtoIn pageRequestDtoIn) {
		Sort sort = Sort.by(pageRequestDtoIn.getSortBy());
		if (pageRequestDtoIn.getOrder().equals("acs")) {
			sort = sort.descending();
		}
		Pageable pageable = PageRequest.of(pageRequestDtoIn.getPage() - 1, pageRequestDtoIn.getSize(), sort);
		return userRepository.findAllByUsernameContaining(pageRequestDtoIn.getSearch(), pageable);
	}

	public User getUserById(String id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new CommonException("User not found with id: " + id, HttpStatus.NOT_FOUND));
	}

	public User createUser(CreateUserDtoIn createUserDto, String roleName) {
		// Check if username already exists
		User existingUser = userRepository.findByUsername(createUserDto.getUsername());
		if (existingUser != null) {
			throw new CommonException("Username already exists", HttpStatus.CONFLICT);
		}

		User user = new User();
		user.setUsername(createUserDto.getUsername());
		user.setPassword(passwordEncoder.encode(createUserDto.getPassword()));

		// Assign role
		if (roleName != null && !roleName.isEmpty()) {
			Role role = roleRepository.findById(roleName.toUpperCase())
					.orElseThrow(() -> new CommonException("Role not found: " + roleName, HttpStatus.NOT_FOUND));
			Set<Role> roles = new HashSet<>();
			roles.add(role);
			user.setRoles(roles);
		}

		return userRepository.save(user);
	}

	public User updateUser(String id, CreateUserDtoIn updateUserDto, String roleName) {
		User user = getUserById(id);

		// Update username if provided and different
		if (updateUserDto.getUsername() != null && !updateUserDto.getUsername().equals(user.getUsername())) {
			User existingUser = userRepository.findByUsername(updateUserDto.getUsername());
			if (existingUser != null && !existingUser.getId().equals(id)) {
				throw new CommonException("Username already exists", HttpStatus.CONFLICT);
			}
			user.setUsername(updateUserDto.getUsername());
		}

		// Update password if provided
		if (updateUserDto.getPassword() != null && !updateUserDto.getPassword().isEmpty()) {
			user.setPassword(passwordEncoder.encode(updateUserDto.getPassword()));
		}

		// Update role if provided
		if (roleName != null && !roleName.isEmpty()) {
			Role role = roleRepository.findById(roleName.toUpperCase())
					.orElseThrow(() -> new CommonException("Role not found: " + roleName, HttpStatus.NOT_FOUND));
			Set<Role> roles = new HashSet<>();
			roles.add(role);
			user.setRoles(roles);
		}

		return userRepository.save(user);
	}

	public void deleteUser(String id) {
		User user = getUserById(id);
		userRepository.delete(user);
	}
}
