package com.sonnguyen.laptopshop.service;

public interface EmailService {
    void sendResetPasswordEmail(String toEmail, String otp);
}
