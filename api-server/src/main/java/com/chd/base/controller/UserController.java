package com.chd.base.controller;

import com.chd.base.payload.request.CreateUserDtoIn;
import com.chd.base.payload.request.PageRequestDtoIn;
import com.chd.base.payload.response.ApiResponse;
import com.chd.base.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'admin', 'manager')")
public class UserController {

	private final UserService userService;

	@GetMapping
	public ResponseEntity<?> getAllUsers(PageRequestDtoIn pageRequestDtoIn) {
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("Get all users successfully")
				.data(new PagedModel<>(userService.getAllBySearchString(pageRequestDtoIn))).build());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getUserById(@PathVariable String id) {
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("Get user successfully")
				.data(userService.getUserById(id)).build());
	}

	@PostMapping
	public ResponseEntity<?> createUser(@RequestBody CreateUserDtoIn createUserDto,
			@RequestParam(required = false) String role) {
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("User created successfully")
				.data(userService.createUser(createUserDto, role)).build());
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody CreateUserDtoIn updateUserDto,
			@RequestParam(required = false) String role) {
		return ResponseEntity.ok(ApiResponse.builder().success(true).message("User updated successfully")
				.data(userService.updateUser(id, updateUserDto, role)).build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable String id) {
		userService.deleteUser(id);
		return ResponseEntity.ok(
				ApiResponse.builder().success(true).message("User deleted successfully").build());
	}

}
