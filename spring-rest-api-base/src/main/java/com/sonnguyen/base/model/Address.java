package com.sonnguyen.base.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "addresses", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_user_default", columnList = "user_id, is_default")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(length = 50)
    private String label = "Nhà riêng";

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    private String ward;
    private String district;
    private String city;

    @Column(name = "postal_code")
    private String postalCode;

    private String country = "Vietnam";

    @Column(name = "is_default")
    private boolean isDefault = false;

    @Column(name = "is_billing_default")
    private boolean isBillingDefault = false;

    @Column(name = "province_code")
    private String provinceCode;

    @Column(name = "district_code")
    private String districtCode;

    @Column(name = "ward_code")
    private String wardCode;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Virtual field tương đương full_address trong JS
    @Transient
    public String getFullAddress() {
        return String.join(", ",
            java.util.stream.Stream.of(addressLine1, addressLine2, ward, district, city, country)
                .filter(s -> s != null && !s.isEmpty())
                .toArray(String[]::new)
        );
    }
}