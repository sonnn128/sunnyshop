package com.sonnguyen.laptopshop.payload.response;

import lombok.Data;

@Data
public class AddressResponse {
    private Long id;
    private String receiverName;
    private String phone;
    private String city;
    private String district;
    private String ward;
    private String street;
    private boolean isDefault;
}
