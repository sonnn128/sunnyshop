package com.sonnguyen.trendwearshop.service;

import com.sonnguyen.trendwearshop.model.User;
import com.sonnguyen.trendwearshop.payload.request.AddressRequest;
import com.sonnguyen.trendwearshop.payload.response.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getAllMyAddresses(User user);
    AddressResponse createAddress(User user, AddressRequest request);
    AddressResponse updateAddress(User user, Long id, AddressRequest request);
    void deleteAddress(User user, Long id);
    void setDefaultAddress(User user, Long id);
}
