package com.sonnguyen.laptopshop.service.impl;

import com.sonnguyen.laptopshop.config.JwtService;
import com.sonnguyen.laptopshop.model.RefreshToken;
import com.sonnguyen.laptopshop.model.PasswordResetToken;
import com.sonnguyen.laptopshop.model.CustomUserDetails;
import com.sonnguyen.laptopshop.repository.RefreshTokenRepository;
import com.sonnguyen.laptopshop.repository.PasswordResetTokenRepository;
import com.sonnguyen.laptopshop.exception.CommonException;
import com.sonnguyen.laptopshop.exception.NotFoundException;
import com.sonnguyen.laptopshop.model.Role;
import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.payload.request.RegisterRequest;
import com.sonnguyen.laptopshop.payload.response.AuthResponse;
import com.sonnguyen.laptopshop.repository.RoleRepository;
import com.sonnguyen.laptopshop.repository.UserRepository;
import com.sonnguyen.laptopshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Value("${jwt.EXPIRATION_TIME:3600000}")
    private int JWT_EXPIRATION_TIME;
    @Value("${jwt.EXPIRATION_TIME_REMEMBER_ME:3600000}")
    private int JWT_EXPIRATION_TIME_REMEMBER_ME;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final com.sonnguyen.laptopshop.service.EmailService emailService;


    @Override
    public AuthResponse login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtService.generateToken((UserDetails) authentication.getPrincipal(), JWT_EXPIRATION_TIME);
        User user = userRepository.findByUsername(username);
        // create refresh token
        RefreshToken refresh = new RefreshToken();
        refresh.setToken(UUID.randomUUID().toString());
        refresh.setUser(user);
        refresh.setExpiresAt(Instant.now().plusMillis(1000L * 60 * 60 * 24 * 30)); // 30 days
        refreshTokenRepository.save(refresh);

        // attach refresh token string in response user? We'll include via a header-like field on AuthResponse if needed
        return new AuthResponse(token, refresh.getToken(), user);
    }

    @Override
    @Transactional
    public void register(RegisterRequest registerRequest) {
        User existingUser = userRepository.findByUsername(registerRequest.getUsername());
        if (existingUser != null) {
            throw new CommonException("username exist", HttpStatus.CONFLICT);
        }
        
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());
        user.setGender(registerRequest.getGender());
        
        // Assign USER role by default
        Role userRole = roleRepository.findById("USER")
                .orElseThrow(() -> new CommonException("USER role not found", HttpStatus.INTERNAL_SERVER_ERROR));
        user.setRoles(Set.of(userRole));
        
        userRepository.save(user);
    }

    @Override
    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional
    public User updateProfile(String username, RegisterRequest updateRequest) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new CommonException("User not found", HttpStatus.NOT_FOUND);
        }
        
        user.setEmail(updateRequest.getEmail());
        user.setFullName(updateRequest.getFullName());
        user.setPhone(updateRequest.getPhone());
        user.setAddress(updateRequest.getAddress());
        user.setGender(updateRequest.getGender());
        user.setAvatar(updateRequest.getAvatar());
        
        return userRepository.save(user);
    }

    @Override
    public void logout(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            refreshTokenRepository.deleteAllByUser(user);
        }
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new CommonException("Invalid refresh token", HttpStatus.UNAUTHORIZED));
        if (token.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new CommonException("Refresh token expired", HttpStatus.UNAUTHORIZED);
        }
        User user = token.getUser();
        UserDetails userDetails = new CustomUserDetails(user);
        String newJwt = jwtService.generateToken(userDetails, JWT_EXPIRATION_TIME);
    return new AuthResponse(newJwt, token.getToken(), user);
    }

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
        User user = userRepository.findByUsername(username);
        if (user == null) throw new CommonException("User not found", HttpStatus.NOT_FOUND);
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new CommonException("Old password is incorrect", HttpStatus.BAD_REQUEST);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        // invalidate refresh tokens
        refreshTokenRepository.deleteAllByUser(user);
    }

    @Override
    public void forgotPassword(String emailOrUsername) {
        User user = userRepository.findByEmail(emailOrUsername);
        if (user == null) {
             user = userRepository.findByUsername(emailOrUsername);
        }
        if (user == null) {
            // To prevent username enumeration, we might want to return silently.
            // But for this assignment/request, we throw generic error or proceed.
            throw new NotFoundException("User not found with identifier: " + emailOrUsername);
        }

        // Generate 6 digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));

        // Save OTP
        // First delete existing valid tokens for this user? Or just add new one?
        // Let's create new.
        PasswordResetToken prt = new PasswordResetToken();
        prt.setToken(otp); // Saving the raw OTP as the token
        prt.setUser(user);
        prt.setExpiresAt(Instant.now().plusMillis(1000L * 60 * 15)); // 15 minutes
        passwordResetTokenRepository.save(prt);

        // Send Email
        emailService.sendResetPasswordEmail(user.getEmail(), otp);
    }

    @Override
    public void verifyOtp(String otp, String username) {
        // Find by token
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(otp)
                .orElseThrow(() -> new CommonException("Invalid OTP", HttpStatus.BAD_REQUEST));
        
        // Verify user matches
        if (!prt.getUser().getUsername().equals(username) && !prt.getUser().getEmail().equals(username)) {
             // In case username param is username, check match.
             // If username param is actually email (from FE state), check email.
             // Simplest: Check if the token belongs to the user found by username.
             User user = userRepository.findByUsername(username);
             if (user == null) user = userRepository.findByEmail(username);
             
             if (user == null || !prt.getUser().getId().equals(user.getId())) {
                 throw new CommonException("Invalid OTP for this user", HttpStatus.BAD_REQUEST);
             }
        }

        if (prt.getExpiresAt().isBefore(Instant.now())) {
            // passwordResetTokenRepository.delete(prt); // Maybe keep for logs? Or delete.
            throw new CommonException("OTP expired", HttpStatus.BAD_REQUEST);
        }
        // Valid. Return. Frontend proceeds to next step.
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new CommonException("Invalid OTP", HttpStatus.BAD_REQUEST));
        
        if (prt.getExpiresAt().isBefore(Instant.now())) {
            throw new CommonException("OTP expired", HttpStatus.BAD_REQUEST);
        }
        
        User user = prt.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Consume the token
        passwordResetTokenRepository.delete(prt);
        // invalidate refresh tokens
        refreshTokenRepository.deleteAllByUser(user);
    }
}

