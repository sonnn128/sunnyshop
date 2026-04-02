package com.sonnguyen.laptopshop.payload.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthRequest {
    @NotEmpty(message = "username can not empty")
    @Size(min = 4, message = "Username must be at least 4 characters")
    @Size(max = 20, message = "Username must be at most 20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9@._-]*$", message = "Username contains invalid characters")
    private String username;

    @NotEmpty(message = "password can not empty")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Size(max = 20, message = "Password must be at most 20 characters")
    @Pattern(regexp = "^\\S*$", message = "Password contains whitespace")
    private String password;
}


