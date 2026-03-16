package com.sonnguyen.base.payload.response;


import com.sonnguyen.base.model.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    
    @JsonProperty("accessToken")
    public String getAccessToken() {
        return token;
    }

    @JsonProperty("refreshToken")
    public String getRefreshToken() {
        return token; // For now, use the same token as refresh token
    }

    private User user;
}
