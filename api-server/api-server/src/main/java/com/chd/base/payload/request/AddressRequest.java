package com.chd.base.payload.request;

import lombok.Data;

@Data
public class AddressRequest {
	private String recipientName;
	private String phone;
	private String addressLine;
	private String ward;
	private String district;
	private String province;
	private String postalCode;
	private Boolean isDefault;
}
