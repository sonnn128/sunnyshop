package com.sonnguyen.base.service;

import com.sonnguyen.base.model.Address;
import com.sonnguyen.base.payload.request.AddressRequest;
import com.sonnguyen.base.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;

    public List<Address> list(String userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
    }

    public Address get(Long id, String userId) {
        return addressRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new RuntimeException("Address not found"));
    }

    @Transactional
    public Address create(String userId, AddressRequest req) {
        // Validation cơ bản
        if (req.getResolvedFullName() == null || req.getPhone() == null) {
            throw new IllegalArgumentException("Missing required fields");
        }

        boolean isDefault = req.getResolvedIsDefault();
        long count = addressRepository.countByUserId(userId);

        if (isDefault || count == 0) {
            addressRepository.unsetDefaultsByUserId(userId);
            isDefault = true;
        }

        Address address = Address.builder()
            .userId(userId)
            .label(req.getLabel() != null ? req.getLabel() : "Địa chỉ mới")
            .fullName(req.getResolvedFullName())
            .phone(req.getPhone())
            .addressLine1(req.getResolvedAddress1())
            .addressLine2(req.getAddressLine2() != null ? req.getAddressLine2() : req.getAddressLine2Snake())
            .ward(req.getWard())
            .district(req.getResolvedDistrict())
            .city(req.getCity())
            .country(req.getCountry() != null ? req.getCountry() : "Vietnam")
            .isDefault(isDefault)
            .provinceCode(req.getProvinceCode())
            .districtCode(req.getDistrictCode())
            .wardCode(req.getWardCode())
            .build();

        return addressRepository.save(address);
    }

    @Transactional
    public Address update(Long id, String userId, AddressRequest req) {
        Address address = get(id, userId);

        if (req.getResolvedFullName() != null) address.setFullName(req.getResolvedFullName());
        if (req.getPhone() != null) address.setPhone(req.getPhone());
        if (req.getResolvedAddress1() != null) address.setAddressLine1(req.getResolvedAddress1());
        if (req.getResolvedDistrict() != null) address.setDistrict(req.getResolvedDistrict());

        if (req.getResolvedIsDefault()) {
            addressRepository.unsetOtherDefaults(userId, id);
            address.setDefault(true);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public void remove(Long id, String userId) {
        Address address = get(id, userId);
        boolean wasDefault = address.isDefault();

        addressRepository.delete(address);

        if (wasDefault) {
            addressRepository.findFirstByUserIdOrderByCreatedAtAsc(userId).ifPresent(next -> {
                next.setDefault(true);
                addressRepository.save(next);
            });
        }
    }

    @Transactional
    public Address setDefault(Long id, String userId) {
        Address address = get(id, userId);
        addressRepository.unsetDefaultsByUserId(userId);
        address.setDefault(true);
        return addressRepository.save(address);
    }

    public Address getDefault(String userId) {
        return addressRepository.findByUserIdAndIsDefaultTrue(userId).orElse(null);
    }
}