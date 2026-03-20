package com.chd.base.payload.request;

import lombok.Data;

@Data
public class AddressRequest {
	private String label;
	private String recipientName;
	private String phoneNumber;
	private String addressLine1;
	private String addressLine2;
	private String ward;
	private String district;
	private String city;
	private String province;
	private String postalCode;
	private String country;
	private Boolean isDefault;
	private String provinceCode;
	private String districtCode;
	private String wardCode;

	// Getters for resolved values - compatibility layer
	public String getResolvedFullName() {
		return recipientName;
	}

	public String getPhone() {
		return phoneNumber;
	}

	public Boolean getResolvedIsDefault() {
		return isDefault != null && isDefault;
	}

	public String getLabel() {
		return label;
	}

	public String getResolvedAddress1() {
		return addressLine1;
	}

	public String getAddressLine2() {
		return addressLine2;
	}

	public String getAddressLine2Snake() {
		return addressLine2;
	}

	public String getResolvedDistrict() {
		return district;
	}

	public String getCity() {
		return city;
	}

	public String getCountry() {
		return country;
	}

	public String getProvinceCode() {
		return provinceCode;
	}

	public String getDistrictCode() {
		return districtCode;
	}

	public String getWardCode() {
		return wardCode;
	}
}
