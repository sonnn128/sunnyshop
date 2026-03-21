package com.chd.base.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final JwtAuthenticationFilter jwtAuthFilter;
	private final ExceptionHandlerFilter exceptionHandlerFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(Customizer.withDefaults()).csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(authorizeHttpRequest -> authorizeHttpRequest
						// Public endpoints
						.requestMatchers("/api/v1/auth/register", 
							"/api/v1/auth/login", 
							"/api/v1/auth/token",
							"/api/v1/docs/**", 
							"/api/auth/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/v1/brands/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/v1/recommendations/**").permitAll()
						// Cart endpoints - allow both authenticated and guest users
						.requestMatchers("/api/v1/cart/**").permitAll()
						// User authenticated endpoints (no special role required)
						.requestMatchers("/api/v1/auth/me").authenticated()
						.requestMatchers("/api/v1/wishlist/**").authenticated()
						.requestMatchers("/api/v1/orders/user**").authenticated()
						.requestMatchers("/api/v1/user/orders**").authenticated()
						// Protected endpoints - @PreAuthorize annotations handle specific role/authority checks
						.requestMatchers("/api/v1/dashboard/**").authenticated()
						.requestMatchers("/api/v1/chat/**").authenticated()
						.requestMatchers("/api/v1/analytics/**").authenticated()
						.requestMatchers("/api/v1/users/**").authenticated()
						// All other requests require authentication
						.anyRequest().authenticated())
				.sessionManagement(
						sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
				.addFilterBefore(exceptionHandlerFilter, JwtAuthenticationFilter.class);
		return http.build();
	}
}
