package com.chd.base.payload.request;

import lombok.Data;

@Data
public class CreateUserDtoIn {
	private String username;
	private String password;
}
