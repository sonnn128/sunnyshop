package com.chd.base.exception;

import org.springframework.http.HttpStatus;

public class CommonException extends RuntimeException {
	private String message;
	private HttpStatus httpStatus;

	public CommonException(String message, HttpStatus httpStatus) {
		this.message = message;
		this.httpStatus = httpStatus;
	}

	public String getMessage() {
		return message;
	}

	public HttpStatus getHttpStatus() {
		return httpStatus;
	}
}
