package com.sonnguyen.base.payload.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AddressRequest {
    private String label;
    private String phone;
    private String ward;
    private String district;
    private String state; // Alias cho district
    private String city;
    private String country;

    @JsonProperty("full_name") private String fullNameSnake;
    private String fullName;

    @JsonProperty("address_line1") private String addressLine1Snake;
    private String addressLine1;

    @JsonProperty("address_line2") private String addressLine2Snake;
    private String addressLine2;

    @JsonProperty("is_default") private Boolean isDefaultSnake;
    private Boolean isDefault;
    private Boolean isDefaultFlag;

    @JsonProperty("province_code") private String provinceCode;
    @JsonProperty("district_code") private String districtCode;
    @JsonProperty("ward_code") private String wardCode;
    @JsonProperty("postal_code") private String postalCode;

    // Helper method để lấy giá trị cuối cùng
    public String getResolvedFullName() { return fullName != null ? fullName : fullNameSnake; }
    public String getResolvedAddress1() { return addressLine1 != null ? addressLine1 : addressLine1Snake; }
    public String getResolvedDistrict() { return district != null ? district : state; }
    public boolean getResolvedIsDefault() {
        if (isDefault != null) return isDefault;
        if (isDefaultSnake != null) return isDefaultSnake;
        return isDefaultFlag != null && isDefaultFlag;
    }
}
