package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.exception.CommonException;
import com.sonnguyen.laptopshop.model.Role;
import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.payload.request.UserRequest;
import com.sonnguyen.laptopshop.payload.response.UserResponse;
import com.sonnguyen.laptopshop.repository.RoleRepository;
import com.sonnguyen.laptopshop.repository.UserRepository;
import com.sonnguyen.laptopshop.utils.ModelMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.HashSet;
import com.sonnguyen.laptopshop.model.Gender;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String USER_NOT_FOUND = "User not found with id: ";
    private static final String USERNAME_EXISTS = "Username already exists: ";
    private static final String EMAIL_EXISTS = "Email already exists: ";
    private static final String ROLE_NOT_FOUND = "Role not found with id: ";

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(ModelMapper::toUserResponse);
    }

    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CommonException(USER_NOT_FOUND + id, HttpStatus.NOT_FOUND));
        return convertToResponse(user);
    }

    public UserResponse createUser(UserRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new CommonException(USERNAME_EXISTS + request.getUsername(), HttpStatus.CONFLICT);
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CommonException(EMAIL_EXISTS + request.getEmail(), HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
               user.setGender(request.getGender() != null ? Gender.valueOf(request.getGender().toUpperCase()) : null);

        // Set roles
        List<Role> roles = roleRepository.findAllById(request.getRoleIds());
        if (roles.size() != request.getRoleIds().size()) {
            throw new CommonException("One or more roles not found", HttpStatus.BAD_REQUEST);
        }
               user.setRoles(new HashSet<>(roles));

        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }

    public UserResponse updateUser(UUID id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CommonException(USER_NOT_FOUND + id, HttpStatus.NOT_FOUND));

        // Check if username already exists for another user
        if (!user.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new CommonException(USERNAME_EXISTS + request.getUsername(), HttpStatus.CONFLICT);
        }

        // Check if email already exists for another user
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new CommonException(EMAIL_EXISTS + request.getEmail(), HttpStatus.CONFLICT);
        }

        user.setUsername(request.getUsername());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
               user.setGender(request.getGender() != null ? Gender.valueOf(request.getGender().toUpperCase()) : null);

        // Update roles
        List<Role> roles = roleRepository.findAllById(request.getRoleIds());
        if (roles.size() != request.getRoleIds().size()) {
            throw new CommonException("One or more roles not found", HttpStatus.BAD_REQUEST);
        }
               user.setRoles(new HashSet<>(roles));

        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }

    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CommonException(USER_NOT_FOUND + id, HttpStatus.NOT_FOUND));
        userRepository.delete(user);
    }

    public Page<UserResponse> searchUsers(String keyword, String role, Pageable pageable) {
        Page<User> users;
        if (keyword != null && !keyword.isEmpty() && role != null && !role.isEmpty()) {
            users = userRepository.findByUsernameContainingAndRolesId(keyword, role, pageable);
        } else if (keyword != null && !keyword.isEmpty()) {
                   users = userRepository.findAllByUsernameContaining(keyword, pageable);
        } else if (role != null && !role.isEmpty()) {
            users = userRepository.findByRolesId(role, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(ModelMapper::toUserResponse);
    }

    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setAddress(user.getAddress());
        response.setGender(user.getGender());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        // Convert roles
        List<UserResponse.RoleInfo> roleInfos = user.getRoles().stream()
                .map(role -> {
                    UserResponse.RoleInfo roleInfo = new UserResponse.RoleInfo();
                    roleInfo.setId(role.getId());
                    roleInfo.setAuthority(role.getAuthority());
                    roleInfo.setPermissions(role.getPermissions().stream()
                            .map(permission -> permission.getDescription())
                            .collect(Collectors.toList()));
                    return roleInfo;
                })
                .collect(Collectors.toList());
        response.setRoles(roleInfos);

        return response;
    }
}