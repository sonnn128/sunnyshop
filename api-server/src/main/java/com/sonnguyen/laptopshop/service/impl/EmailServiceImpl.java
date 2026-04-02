package com.sonnguyen.laptopshop.service.impl;

import com.sonnguyen.laptopshop.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@sunnyshop.com}")
    private String fromEmail;

    @Override
    public void sendResetPasswordEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Yêu cầu khôi phục mật khẩu - Sunny Shop");
        message.setText("Chào bạn,\n\nMã OTP để lấy lại mật khẩu của bạn là: " + otp 
                + "\n\nMã này sẽ hết hạn sau 10 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\nTrân trọng,\nSunny Shop");
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ". Error: " + e.getMessage());
            // In a real scenario, you probably want to throw custom exception here.
            // For dev environment, if SMTP isn't configured, we just log it instead of breaking the entire app immediately.
            throw new RuntimeException("Gửi email thất bại. Vui lòng kiểm tra lại cấu hình SMTP.");
        }
    }
}
