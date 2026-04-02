package com.sonnguyen.laptopshop.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String token;

    private Instant expiresAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
