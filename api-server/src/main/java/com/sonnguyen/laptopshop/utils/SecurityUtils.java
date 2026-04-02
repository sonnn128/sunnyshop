package com.sonnguyen.laptopshop.utils;
import com.sonnguyen.laptopshop.model.CustomUserDetails;
import com.sonnguyen.laptopshop.model.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {

    public static User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUser();
        }
        throw new IllegalStateException("No authenticated user found");
    }

    public static boolean isAuthenticated() {
        return SecurityContextHolder.getContext().getAuthentication() != null &&
                SecurityContextHolder.getContext().getAuthentication().isAuthenticated();
    }
}
