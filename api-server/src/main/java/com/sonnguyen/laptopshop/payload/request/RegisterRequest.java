package com.sonnguyen.laptopshop.payload.request;

import com.sonnguyen.laptopshop.model.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotEmpty(message = "Username is required")
    @Size(min = 3, message = "Username must be at least 3 characters")
    private String username;

    @NotEmpty(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotEmpty(message = "Email is required")
    @Email(message = "Please enter a valid email")
    private String email;

    @NotEmpty(message = "Full name is required")
    private String fullName;

    @NotEmpty(message = "Phone is required")
    private String phone;

    private String address;

    private String avatar;

    @NotNull(message = "Gender is required")
    private Gender gender;
}
