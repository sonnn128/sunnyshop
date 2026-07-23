package com.sonnguyen.trendwearshop.service.impl;

import com.sonnguyen.trendwearshop.model.Address;
import com.sonnguyen.trendwearshop.model.User;
import com.sonnguyen.trendwearshop.payload.request.AddressRequest;
import com.sonnguyen.trendwearshop.payload.response.AddressResponse;
import com.sonnguyen.trendwearshop.repository.AddressRepository;
import com.sonnguyen.trendwearshop.service.AddressService;
import com.sonnguyen.trendwearshop.utils.ModelMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;

    @Override
    public List<AddressResponse> getAllMyAddresses(User user) {
        List<Address> addresses = addressRepository.findByUserId(user.getId());
        return addresses.stream()
                .map(ModelMapper::toAddressResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressResponse createAddress(User user, AddressRequest request) {
        if (request.isDefault()) {
            unsetCurrentDefault(user);
        }

        Address address = ModelMapper.toAddress(request);
        address.setUser(user);
        
        // If this is the first address, make it default automatically if not specified
        if (!request.isDefault()) {
            List<Address> existing = addressRepository.findByUserId(user.getId());
            if (existing.isEmpty()) {
                address.setDefault(true);
            }
        }

        Address savedAddress = addressRepository.save(address);
        return ModelMapper.toAddressResponse(savedAddress);
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(User user, Long id, AddressRequest request) {
        Address address = getAddressByIdAndUser(id, user);

        if (request.isDefault() && !address.isDefault()) {
            unsetCurrentDefault(user);
        }

        address.setReceiverName(request.getReceiverName());
        address.setPhone(request.getPhone());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setStreet(request.getStreet());
        address.setDefault(request.isDefault());

        Address savedAddress = addressRepository.save(address);
        return ModelMapper.toAddressResponse(savedAddress);
    }

    @Override
    @Transactional
    public void deleteAddress(User user, Long id) {
        Address address = getAddressByIdAndUser(id, user);
        addressRepository.delete(address);
    }

    @Override
    @Transactional
    public void setDefaultAddress(User user, Long id) {
        Address address = getAddressByIdAndUser(id, user);
        if (address.isDefault()) return;

        unsetCurrentDefault(user);
        address.setDefault(true);
        addressRepository.save(address);
    }

    private Address getAddressByIdAndUser(Long id, User user) {
        return addressRepository.findById(id)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Address not found or not authorized"));
    }

    private void unsetCurrentDefault(User user) {
        List<Address> addresses = addressRepository.findByUserId(user.getId());
        for (Address addr : addresses) {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        }
    }
}
