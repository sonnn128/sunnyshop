package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.exception.CommonException;
import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.payload.request.AddressRequest;
import com.sonnguyen.laptopshop.payload.response.AddressResponse;
import com.sonnguyen.laptopshop.service.AddressService;
import com.sonnguyen.laptopshop.utils.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses() {
        User user = getCurrentUser();
        return ResponseEntity.ok(addressService.getAllMyAddresses(user));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(@RequestBody AddressRequest request) {
        User user = getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.createAddress(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(@PathVariable Long id, @RequestBody AddressRequest request) {
        User user = getCurrentUser();
        return ResponseEntity.ok(addressService.updateAddress(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        User user = getCurrentUser();
        addressService.deleteAddress(user, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<Void> setDefaultAddress(@PathVariable Long id) {
        User user = getCurrentUser();
        addressService.setDefaultAddress(user, id);
        return ResponseEntity.ok().build();
    }

    private User getCurrentUser() {
        try {
            return SecurityUtils.getCurrentUser();
        } catch (Exception e) {
            throw new CommonException("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
    }
}
