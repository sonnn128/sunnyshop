package com.sonnguyen.trendwearshop.service;

import com.sonnguyen.trendwearshop.exception.CommonException;
import com.sonnguyen.trendwearshop.model.Role;
import com.sonnguyen.trendwearshop.model.User;
import com.sonnguyen.trendwearshop.payload.request.UserRequest;
import com.sonnguyen.trendwearshop.payload.response.UserResponse;
import com.sonnguyen.trendwearshop.repository.AddressRepository;
import com.sonnguyen.trendwearshop.repository.CartDetailRepository;
import com.sonnguyen.trendwearshop.repository.CartRepository;
import com.sonnguyen.trendwearshop.repository.OrderDetailRepository;
import com.sonnguyen.trendwearshop.repository.OrderRepository;
import com.sonnguyen.trendwearshop.repository.PasswordResetTokenRepository;
import com.sonnguyen.trendwearshop.repository.RefreshTokenRepository;
import com.sonnguyen.trendwearshop.repository.ReviewRepository;
import com.sonnguyen.trendwearshop.repository.RoleRepository;
import com.sonnguyen.trendwearshop.repository.UserRepository;
import com.sonnguyen.trendwearshop.repository.WishlistRepository;
import com.sonnguyen.trendwearshop.utils.ModelMapper;
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
import com.sonnguyen.trendwearshop.model.Gender;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final WishlistRepository wishlistRepository;
    private final AddressRepository addressRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    private static final String USER_NOT_FOUND = "User not found with id: ";
    private static final String USERNAME_EXISTS = "Username already exists: ";
    private static final String EMAIL_EXISTS = "Email already exists: ";
    private static final String ROLE_NOT_FOUND = "Role not found with id: ";

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(this::convertToResponse);
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
        orderRepository.findByUserId(id).forEach(order -> {
            orderDetailRepository.deleteByOrder(order);
            orderRepository.delete(order);
        });
        cartRepository.findByUser(user).ifPresent(cart -> {
            cartDetailRepository.deleteByCart(cart);
            cartRepository.delete(cart);
        });
        wishlistRepository.deleteByUserId(id);
        addressRepository.deleteByUserId(id);
        refreshTokenRepository.deleteAllByUser(user);
        passwordResetTokenRepository.deleteAllByUser(user);
        reviewRepository.deleteByUserId(id);
        userRepository.delete(user);
    }

    public UserResponse toggleUserLock(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CommonException(USER_NOT_FOUND + id, HttpStatus.NOT_FOUND));
        
        user.setIsLocked(user.getIsLocked() == null ? true : !user.getIsLocked());
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
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
        return users.map(this::convertToResponse);
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
        response.setIsLocked(user.getIsLocked() != null ? user.getIsLocked() : false);
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        // Convert roles
        if (user.getRoles() != null) {
            List<UserResponse.RoleInfo> roleInfos = user.getRoles().stream()
                    .map(role -> {
                        UserResponse.RoleInfo roleInfo = new UserResponse.RoleInfo();
                        roleInfo.setId(role.getId());
                        roleInfo.setAuthority(role.getAuthority());
                        roleInfo.setPermissions(role.getPermissions() != null ?
                                role.getPermissions().stream()
                                        .map(permission -> permission.getDescription())
                                        .collect(Collectors.toList()) : List.of());
                        return roleInfo;
                    })
                    .collect(Collectors.toList());
            response.setRoles(roleInfos);
        }

        // Calculate purchase stats
        if (user.getId() != null) {
            Long totalOrders = orderRepository.countByUserId(user.getId());
            Double totalSpent = orderRepository.sumSpentByUserId(user.getId());
            Long totalProductsPurchased = orderDetailRepository.sumQuantityPurchasedByUserId(user.getId());
            response.setTotalOrders(totalOrders != null ? totalOrders : 0L);
            response.setTotalSpent(totalSpent != null ? totalSpent : 0.0);
            response.setTotalProductsPurchased(totalProductsPurchased != null ? totalProductsPurchased : 0L);
        } else {
            response.setTotalOrders(0L);
            response.setTotalSpent(0.0);
            response.setTotalProductsPurchased(0L);
        }

        return response;
    }
}