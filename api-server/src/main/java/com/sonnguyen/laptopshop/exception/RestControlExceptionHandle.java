package com.sonnguyen.laptopshop.exception;

import com.sonnguyen.laptopshop.payload.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class RestControlExceptionHandle {
    @ExceptionHandler({CommonException.class})
    @ResponseBody
    public ResponseEntity<ApiResponse<?>> resolveCommonException(CommonException e) {
        return ResponseEntity
                .status(e.getHttpStatus())
                .body(ApiResponse.builder()
                        .message(e.getMessage())
                        .success(false)
                        .build());
    }

    @ExceptionHandler({NotFoundException.class})
    @ResponseBody
    public ResponseEntity<ApiResponse<?>> resolveNotFoundException(NotFoundException e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.builder()
                        .message(e.getMessage())
                        .success(false)
                        .build());
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    @ResponseBody
    public ResponseEntity<ApiResponse<?>> resolveInvalidException(MethodArgumentNotValidException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.builder()
                .message(e.getAllErrors().get(0).getDefaultMessage())
                .success(false)
                .build());
    }

    @ExceptionHandler({AuthenticationException.class})
    @ResponseBody
    public ResponseEntity<ApiResponse<?>> resolveAuthenticationException(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.builder()
                        .message(e.getMessage())
                        .success(false)
                        .build()
        );
    }

    @ExceptionHandler({AccessDeniedException.class})
    @ResponseBody
    public ResponseEntity<ApiResponse<?>> resolveAccessDeniedException(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                ApiResponse.builder()
                        .message("Access denied")
                        .success(false)
                        .build()
        );
    }

    @ExceptionHandler({Exception.class})
    @ResponseBody
    public ResponseEntity<ApiResponse<?>> resolveAccessDeniedException(Exception e) {
    // Log full stacktrace for unexpected exceptions to aid debugging
    e.printStackTrace();
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
        ApiResponse.builder()
            .message("Internal server error: " + e.getMessage())
            .success(false)
            .build()
    );
    }
}
