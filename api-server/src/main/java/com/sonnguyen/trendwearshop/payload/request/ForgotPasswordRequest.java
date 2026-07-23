package com.sonnguyen.trendwearshop.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @NotEmpty
    private String email;
}
