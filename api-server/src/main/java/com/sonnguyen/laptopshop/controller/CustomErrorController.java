package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.payload.response.ApiResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<ApiResponse> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        
        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());
            
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.builder()
                                .success(false)
                                .message("Endpoint not found")
                                .build());
            } else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApiResponse.builder()
                                .success(false)
                                .message("Internal server error")
                                .build());
            }
        }
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.builder()
                        .success(false)
                        .message("Bad request")
                        .build());
    }
}
