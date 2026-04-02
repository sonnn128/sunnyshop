package com.sonnguyen.laptopshop.payload.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import com.sonnguyen.laptopshop.model.Gender;

@Data
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private Gender gender;
    private List<RoleInfo> roles;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant updatedAt;

    @Data
    public static class RoleInfo {
        private String id;
        private String authority;
        private List<String> permissions;
    }
}
