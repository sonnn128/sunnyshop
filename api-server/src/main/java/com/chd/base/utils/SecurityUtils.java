package com.chd.base.utils;
import com.chd.base.model.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {

	public static User getCurrentUser() {
		if (!isAuthenticated()) {
			return null;
		}
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof com.chd.base.model.CustomUserDetails) {
			return ((com.chd.base.model.CustomUserDetails) principal).getUser();
		}
		if (principal instanceof User) {
			return (User) principal;
		}
		return null;
	}

	public static boolean isAuthenticated() {
		return SecurityContextHolder.getContext().getAuthentication() != null
				&& SecurityContextHolder.getContext().getAuthentication().isAuthenticated()
				&& !(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof String
					&& "anonymousUser".equals(SecurityContextHolder.getContext().getAuthentication().getPrincipal()));
	}
}
