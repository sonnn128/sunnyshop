package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.RefreshToken;
import com.sonnguyen.laptopshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    void deleteAllByUser(User user);
}
