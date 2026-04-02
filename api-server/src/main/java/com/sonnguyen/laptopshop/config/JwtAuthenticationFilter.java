package com.sonnguyen.laptopshop.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsServiceImpl;
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        
        // Skip JWT processing for Swagger and public endpoints
        if (isPublicEndpoint(requestURI) || isPublicGetEndpoint(requestURI, request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
        
        log.info("Request: uri = {}, method = {}, authHeader = {}", requestURI, request.getMethod(), request.getHeader("Authorization"));
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }
        jwt = authHeader.substring(7);
        username = jwtService.extractUsername(jwt);
        if(username != null){
            UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);
            if(jwtService.isTokenValid(jwt, userDetails)){
                // Extract authorities from token instead of userDetails
                Collection<? extends GrantedAuthority> authorities = jwtService.extractAuthorities(jwt);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        authorities
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.info("Authentication set for user: {}", username);
            } else {
                log.warn("Invalid token for user: {}", username);
            }
        } else {
            log.warn("Could not extract username from token");
        }
        filterChain.doFilter(request, response);
    }
    
    private boolean isPublicEndpoint(String requestURI) {
        return requestURI.startsWith("/swagger-ui") ||
               requestURI.startsWith("/v3/api-docs") ||
               requestURI.startsWith("/api-docs") ||
               requestURI.startsWith("/swagger-resources") ||
               requestURI.startsWith("/webjars") ||
               requestURI.startsWith("/actuator") ||
               requestURI.equals("/swagger-ui.html") ||
               requestURI.equals("/error") ||
               requestURI.equals("/api/v1/auth/login") ||
               requestURI.equals("/api/v1/auth/register");
    }
    
    private boolean isPublicGetEndpoint(String requestURI, String method) {
        return "GET".equals(method) && (
               requestURI.startsWith("/api/v1/products") ||
               requestURI.startsWith("/api/v1/categories")
        );
    }
}
