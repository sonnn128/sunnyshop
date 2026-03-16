package com.sonnguyen.base.controller;

import com.sonnguyen.base.payload.request.AuthRequest;
import com.sonnguyen.base.payload.response.ApiResponse;
import com.sonnguyen.base.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LegacyAuthAliasController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .success(true)
                        .message("login success")
                        .data(authService.login(authRequest.getUsername(), authRequest.getPassword()))
                        .build()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest authRequest) {
        authService.register(authRequest.getUsername(), authRequest.getPassword());
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .success(true)
                        .message("register success")
                        .build()
        );
    }
}

