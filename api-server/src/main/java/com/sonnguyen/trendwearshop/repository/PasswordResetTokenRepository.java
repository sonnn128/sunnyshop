package com.sonnguyen.trendwearshop.repository;

import com.sonnguyen.trendwearshop.model.PasswordResetToken;
import com.sonnguyen.trendwearshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteAllByUser(User user);
}
