package com.sonnguyen.laptopshop.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends CommonException {
    public NotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
