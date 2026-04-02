package com.sonnguyen.laptopshop.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.Instant;

@Data
@Entity
@Table(name = "permissions")
public class Permission implements GrantedAuthority {
    @Id
    private String id;
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Instant updatedAt;

    @Override
    public String getAuthority() {
        return this.getId();
    }

    public SimpleGrantedAuthority toSimpleGrantedAuthority() {
        return new SimpleGrantedAuthority(this.getId());
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}

