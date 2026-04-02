package com.sonnguyen.laptopshop.payload.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotEmpty
    private String token;
    @NotEmpty
    private String newPassword;
}
