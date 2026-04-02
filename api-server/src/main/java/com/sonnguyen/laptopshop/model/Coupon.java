package com.sonnguyen.laptopshop.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String code;

    private Double discountAmount; // Fixed amount discount for simplicity
    
    private Double minOrderAmount;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;

    private boolean active = true;
}
