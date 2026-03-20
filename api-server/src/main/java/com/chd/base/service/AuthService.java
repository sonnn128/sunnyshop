package com.chd.base.service;

import com.chd.base.payload.response.AuthResponse;

public interface AuthService {
	AuthResponse login(String username, String password);
	void register(String username, String password);
}
