package com.sonnguyen.base.payload.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AddressRequest {
	private String label;
	private String phone;
	private String ward;
	private String district;
	private String state; // Alias cho district
	private String city;
	private String country;

	@JsonProperty("full_name")
	private String fullNameSnake;
	private String fullName;

	@JsonProperty("address_line1")
	private String addressLine1Snake;
	private String addressLine1;

	@JsonProperty("address_line2")
	private String addressLine2Snake;
	private String addressLine2;

	@JsonProperty("is_default")
	private Boolean isDefaultSnake;
	private Boolean isDefault;
	private Boolean isDefaultFlag;

	@JsonProperty("province_code")
	private String provinceCode;
	@JsonProperty("district_code")
	private String districtCode;
	@JsonProperty("ward_code")
	private String wardCode;
	@JsonProperty("postal_code")
	private String postalCode;

	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getWard() {
		return ward;
	}
	public void setWard(String ward) {
		this.ward = ward;
	}
	public String getDistrict() {
		return district;
	}
	public void setDistrict(String district) {
		this.district = district;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getFullNameSnake() {
		return fullNameSnake;
	}
	public void setFullNameSnake(String fullNameSnake) {
		this.fullNameSnake = fullNameSnake;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getAddressLine1Snake() {
		return addressLine1Snake;
	}
	public void setAddressLine1Snake(String addressLine1Snake) {
		this.addressLine1Snake = addressLine1Snake;
	}
	public String getAddressLine1() {
		return addressLine1;
	}
	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}
	public String getAddressLine2Snake() {
		return addressLine2Snake;
	}
	public void setAddressLine2Snake(String addressLine2Snake) {
		this.addressLine2Snake = addressLine2Snake;
	}
	public String getAddressLine2() {
		return addressLine2;
	}
	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}
	public Boolean getIsDefaultSnake() {
		return isDefaultSnake;
	}
	public void setIsDefaultSnake(Boolean isDefaultSnake) {
		this.isDefaultSnake = isDefaultSnake;
	}
	public Boolean getIsDefault() {
		return isDefault;
	}
	public void setIsDefault(Boolean isDefault) {
		this.isDefault = isDefault;
	}
	public Boolean getIsDefaultFlag() {
		return isDefaultFlag;
	}
	public void setIsDefaultFlag(Boolean isDefaultFlag) {
		this.isDefaultFlag = isDefaultFlag;
	}
	public String getProvinceCode() {
		return provinceCode;
	}
	public void setProvinceCode(String provinceCode) {
		this.provinceCode = provinceCode;
	}
	public String getDistrictCode() {
		return districtCode;
	}
	public void setDistrictCode(String districtCode) {
		this.districtCode = districtCode;
	}
	public String getWardCode() {
		return wardCode;
	}
	public void setWardCode(String wardCode) {
		this.wardCode = wardCode;
	}
	public String getPostalCode() {
		return postalCode;
	}
	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	// Helper method để lấy giá trị cuối cùng
	public String getResolvedFullName() {
		return fullName != null ? fullName : fullNameSnake;
	}
	public String getResolvedAddress1() {
		return addressLine1 != null ? addressLine1 : addressLine1Snake;
	}
	public String getResolvedDistrict() {
		return district != null ? district : state;
	}
	public boolean getResolvedIsDefault() {
		if (isDefault != null)
			return isDefault;
		if (isDefaultSnake != null)
			return isDefaultSnake;
		return isDefaultFlag != null && isDefaultFlag;
	}
}
