package com.sonnguyen.trendwearshop.payload.response;

import com.sonnguyen.trendwearshop.model.User;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String refreshToken;
    private User user;


    public AuthResponse(String token, String refreshToken, User user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}
