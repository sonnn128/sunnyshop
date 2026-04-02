package com.sonnguyen.laptopshop.service;

import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendResetPasswordEmail(String to, String otpCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            
            Context context = new Context();
            context.setVariable("otpCode", otpCode);
            String html = templateEngine.process("email/reset-password", context);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Reset Your Password - Laptop Shop");
            helper.setText(html, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
