package com.sonnguyen.trendwearshop.payload.request;

import com.sonnguyen.trendwearshop.model.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    @Email(message = "Email không hợp lệ")
    private String email;

    private String phone;

    private String address;

    private String avatar;

    private Gender gender;
}
