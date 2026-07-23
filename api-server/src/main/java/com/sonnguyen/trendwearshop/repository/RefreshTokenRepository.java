package com.sonnguyen.trendwearshop.repository;

import com.sonnguyen.trendwearshop.model.RefreshToken;
import com.sonnguyen.trendwearshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    void deleteAllByUser(User user);
}
