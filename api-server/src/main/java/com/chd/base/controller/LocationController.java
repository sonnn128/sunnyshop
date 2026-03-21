package com.chd.base.controller;

import com.chd.base.model.District;
import com.chd.base.model.Province;
import com.chd.base.model.Ward;
import com.chd.base.service.AddressDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/addresses/locations")
@RequiredArgsConstructor
public class LocationController {
	private final AddressDataService addressDataService;

	/**
	 * Get all provinces with nested districts and wards
	 */
	@GetMapping("/provinces")
	@PreAuthorize("permitAll()")
	public ResponseEntity<List<Province>> getAllProvinces() {
		List<Province> provinces = addressDataService.getAllProvinces();
		return ResponseEntity.ok(provinces);
	}

	/**
	 * Get districts by province code
	 */
	@GetMapping("/districts")
	@PreAuthorize("permitAll()")
	public ResponseEntity<List<District>> getDistrictsByProvince(@RequestParam String provinceCode) {
		List<District> districts = addressDataService.getDistrictsByProvince(provinceCode);
		return ResponseEntity.ok(districts);
	}

	/**
	 * Get wards by district code
	 */
	@GetMapping("/wards")
	@PreAuthorize("permitAll()")
	public ResponseEntity<List<Ward>> getWardsByDistrict(@RequestParam String districtCode) {
		List<Ward> wards = addressDataService.getWardsByDistrict(districtCode);
		return ResponseEntity.ok(wards);
	}

	/**
	 * Sync Vietnam provinces/districts/wards from API to database
	 * POST /api/v1/addresses/locations/sync
	 */
	@PostMapping("/sync")
	@PreAuthorize("permitAll()")
	public ResponseEntity<Map<String, Object>> syncAddresses() {
		try {
			addressDataService.syncAddressesFromApi();
			long totalProvinces = addressDataService.getTotalProvinces();
			return ResponseEntity.ok(Map.of(
				"message", "Sync completed successfully",
				"status", "success",
				"totalProvinces", totalProvinces
			));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of(
				"message", "Sync failed: " + e.getMessage(),
				"status", "error"
			));
		}
	}
}
