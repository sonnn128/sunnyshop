package com.sonnguyen.laptopshop.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UserRequest {
    @NotNull
    @NotEmpty(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotNull
    @NotEmpty(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull
    @NotEmpty(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotNull
    @NotEmpty(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    private String phone;
    private String address;
    private String gender;

    @NotNull
    @NotEmpty(message = "At least one role is required")
    private List<String> roleIds;
}

