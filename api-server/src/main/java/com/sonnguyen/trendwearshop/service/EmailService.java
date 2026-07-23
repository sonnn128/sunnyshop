package com.sonnguyen.trendwearshop.service;

public interface EmailService {
    void sendResetPasswordEmail(String toEmail, String otp);
}
