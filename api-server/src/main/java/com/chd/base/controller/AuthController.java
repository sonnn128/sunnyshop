package com.chd.base.controller;

import com.chd.base.payload.request.AuthRequest;
import com.chd.base.payload.response.ApiResponse;
import com.chd.base.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
	
	private final AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
		return ResponseEntity.ok().body(ApiResponse.builder().success(true).message("login success")
				.data(authService.login(authRequest.getUsername(), authRequest.getPassword())).build());
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody AuthRequest authRequest) {
		authService.register(authRequest.getUsername(), authRequest.getPassword());
		return ResponseEntity.ok().body(ApiResponse.builder().success(true).message("register success").build());
	}

	@PostMapping("/token")
	public ResponseEntity<?> token(@Valid @RequestBody AuthRequest authRequest) {
		return ResponseEntity.ok()
				.body(authService.login(authRequest.getUsername(), authRequest.getPassword()).getToken());
	}
}
