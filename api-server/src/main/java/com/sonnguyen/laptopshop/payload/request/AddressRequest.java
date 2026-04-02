package com.sonnguyen.laptopshop.payload.request;

import lombok.Data;

@Data
public class AddressRequest {
    private String receiverName;
    private String phone;
    private String city;
    private String district;
    private String ward;
    private String street;
    private boolean isDefault;
}
