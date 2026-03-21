package com.chd.base.controller;

import com.chd.base.payload.request.AddressRequest;
import com.chd.base.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chd.base.model.Address;
import com.chd.base.model.User;
import com.chd.base.utils.SecurityUtils;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {

	private final AddressService addressService;

	private String getCurrentUserId() {
		User user = SecurityUtils.getCurrentUser();
		return user.getId();
	}

	@GetMapping
	public ResponseEntity<?> list() {
		try {
			return ResponseEntity.ok(Map.of("addresses", addressService.list(getCurrentUserId())));
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> get(@PathVariable Long id) {
		try {
			Address address = addressService.get(id, getCurrentUserId());
			return ResponseEntity.ok(Map.of("address", address));
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
		}
	}

	@PostMapping
	public ResponseEntity<?> create(@RequestBody AddressRequest req) {
		try {
			Address address = addressService.create(getCurrentUserId(), req);
			return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("address", address));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AddressRequest req) {
		try {
			Address address = addressService.update(id, getCurrentUserId(), req);
			return ResponseEntity.ok(Map.of("address", address));
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> remove(@PathVariable Long id) {
		try {
			addressService.remove(id, getCurrentUserId());
			return ResponseEntity.ok(Map.of("ok", true, "message", "Address deleted successfully"));
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
		}
	}

	@PatchMapping("/{id}/set-default")
	public ResponseEntity<?> setDefault(@PathVariable Long id) {
		try {
			Address address = addressService.setDefault(id, getCurrentUserId());
			return ResponseEntity.ok(Map.of("address", address));
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
		}
	}

	@GetMapping("/default")
	public ResponseEntity<?> getDefault() {
		Address address = addressService.getDefault(getCurrentUserId());
		return ResponseEntity.ok(Map.of("address", address != null ? address : "null"));
	}
}
