package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.payload.request.*;
import com.sonnguyen.laptopshop.payload.response.ApiResponse;
import com.sonnguyen.laptopshop.payload.response.AuthResponse;
import com.sonnguyen.laptopshop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and user management APIs")
public class AuthController {
    private final AuthService authService;

    @Operation(summary = "User Login", description = "Authenticate user and return JWT token")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
                AuthResponse authResponse = authService.login(authRequest.getUsername(), authRequest.getPassword());
                return ResponseEntity.ok().body(
                                ApiResponse.builder()
                                                .success(true)
                                                .message("login success")
                                                .data(authResponse)
                                                .build()
                );
    }

        @PostMapping("/refresh")
        public ResponseEntity<?> refresh(@Valid @RequestBody RefreshRequest request) {
                AuthResponse resp = authService.refreshToken(request.getRefreshToken());
                return ResponseEntity.ok(ApiResponse.builder().success(true).data(resp).build());
        }

        @PostMapping("/logout")
        public ResponseEntity<?> logout(Authentication authentication) {
                if (authentication == null) return ResponseEntity.status(401).body(ApiResponse.builder().success(false).message("Authentication required").build());
                authService.logout(authentication.getName());
                return ResponseEntity.ok(ApiResponse.builder().success(true).message("Logged out").build());
        }

        @PostMapping("/change-password")
        public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request, Authentication authentication) {
                if (authentication == null) return ResponseEntity.status(401).body(ApiResponse.builder().success(false).message("Authentication required").build());
                authService.changePassword(authentication.getName(), request.getOldPassword(), request.getNewPassword());
                return ResponseEntity.ok(ApiResponse.builder().success(true).message("Password changed").build());
        }

        @PostMapping("/verify-otp")
        public ResponseEntity<?> verifyOtp(@RequestBody java.util.Map<String, String> request) {
            String otp = request.get("otp");
            String username = request.get("username");
            authService.verifyOtp(otp, username);
            return ResponseEntity.ok(ApiResponse.builder().success(true).message("OTP verified").build());
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
                authService.forgotPassword(request.getEmail());
                return ResponseEntity.ok(ApiResponse.builder().success(true).message("If the email exists, a reset link has been sent").build());
        }

        @PostMapping("/reset-password")
        public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
                authService.resetPassword(request.getToken(), request.getNewPassword());
                return ResponseEntity.ok(ApiResponse.builder().success(true).message("Password has been reset").build());
        }

    @Operation(summary = "User Registration", description = "Register a new user account")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Registration successful",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input or user already exists",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .success(true)
                        .message("register success")
                        .build()
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    ApiResponse.builder()
                            .success(false)
                            .message("Authentication required")
                            .build()
            );
        }
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .success(true)
                        .data(user)
                        .build()
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody RegisterRequest updateRequest, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(
                    ApiResponse.builder()
                            .success(false)
                            .message("Authentication required")
                            .build()
            );
        }
        User user = authService.updateProfile(authentication.getName(), updateRequest);
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .success(true)
                        .message("Profile updated successfully")
                        .data(user)
                        .build()
        );
    }
}
