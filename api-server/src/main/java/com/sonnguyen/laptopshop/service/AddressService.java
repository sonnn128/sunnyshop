package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.payload.request.AddressRequest;
import com.sonnguyen.laptopshop.payload.response.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getAllMyAddresses(User user);
    AddressResponse createAddress(User user, AddressRequest request);
    AddressResponse updateAddress(User user, Long id, AddressRequest request);
    void deleteAddress(User user, Long id);
    void setDefaultAddress(User user, Long id);
}
