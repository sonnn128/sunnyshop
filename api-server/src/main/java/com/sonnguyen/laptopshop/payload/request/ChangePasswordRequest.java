package com.sonnguyen.laptopshop.payload.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotEmpty
    private String oldPassword;
    @NotEmpty
    private String newPassword;
}
