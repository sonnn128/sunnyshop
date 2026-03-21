package com.chd.base.service;

import com.chd.base.model.District;
import com.chd.base.model.Province;
import com.chd.base.model.Ward;
import com.chd.base.repository.DistrictRepository;
import com.chd.base.repository.ProvinceRepository;
import com.chd.base.repository.WardRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressDataService {
	private final ProvinceRepository provinceRepository;
	private final DistrictRepository districtRepository;
	private final WardRepository wardRepository;
	private final ObjectMapper objectMapper;

	/**
	 * Load and sync Vietnam provinces/districts/wards data from API to database
	 */
	@Transactional
	public void syncAddressesFromApi() {
		try {
			log.info("Starting to sync Vietnam addresses from API...");
			
			// Fetch data from API
			String apiUrl = "https://provinces.open-api.vn/api/?depth=3";
			URL url = new URL(apiUrl);
			List<Map<String, Object>> provinces = objectMapper.readValue(url, List.class);
			
			if (provinces.isEmpty()) {
				log.warn("No data received from API");
				return;
			}
			
			// Process each province
			for (Map<String, Object> provinceMap : provinces) {
				Object codeObj = provinceMap.get("code");
				String provinceCode = codeObj != null ? String.valueOf(codeObj) : null;
				String provinceName = (String) provinceMap.get("name");
				
				if (provinceCode == null || provinceName == null) {
					log.warn("Skipping province with missing code or name");
					continue;
				}
				
				// Check if province already exists
				Province province = provinceRepository.findById(provinceCode).orElse(null);
				if (province != null) {
					log.debug("Province {} already exists, skipping", provinceName);
					continue;
				}
				
				// Create new province
				province = new Province();
				province.setCode(provinceCode);
				province.setName(provinceName);
				province.setDistricts(new ArrayList<>());
				
				// Process districts
				List<Map<String, Object>> districts = (List<Map<String, Object>>) provinceMap.get("districts");
				if (districts != null) {
					for (Map<String, Object> districtMap : districts) {
						Object districtCodeObj = districtMap.get("code");
						String districtCode = districtCodeObj != null ? String.valueOf(districtCodeObj) : null;
						String districtName = (String) districtMap.get("name");
						
						if (districtCode == null || districtName == null) {
							log.warn("Skipping district with missing code or name");
							continue;
						}
						
						District district = new District();
						district.setCode(districtCode);
						district.setName(districtName);
						district.setProvince(province);
						district.setWards(new ArrayList<>());
						
						// Process wards
						List<Map<String, Object>> wards = (List<Map<String, Object>>) districtMap.get("wards");
						if (wards != null) {
							for (Map<String, Object> wardMap : wards) {
								Object wardCodeObj = wardMap.get("code");
								String wardCode = wardCodeObj != null ? String.valueOf(wardCodeObj) : null;
								String wardName = (String) wardMap.get("name");
								
								if (wardCode == null || wardName == null) {
									log.warn("Skipping ward with missing code or name");
									continue;
								}
								
								Ward ward = new Ward();
								ward.setCode(wardCode);
								ward.setName(wardName);
								ward.setDistrict(district);
								
								district.getWards().add(ward);
							}
						}
						
						province.getDistricts().add(district);
					}
				}
				
				provinceRepository.save(province);
				log.debug("Synced province: {}", provinceName);
			}
			
			log.info("Successfully synced Vietnam addresses to database");
		} catch (Exception e) {
			log.error("Failed to sync Vietnam addresses from API", e);
		}
	}

	/**
	 * Get all provinces
	 */
	public List<Province> getAllProvinces() {
		return provinceRepository.findAll();
	}

	/**
	 * Get all districts for a province
	 */
	public List<District> getDistrictsByProvince(String provinceCode) {
		return districtRepository.findByProvinceCode(provinceCode);
	}

	/**
	 * Get all wards for a district
	 */
	public List<Ward> getWardsByDistrict(String districtCode) {
		return wardRepository.findByDistrictCode(districtCode);
	}

	/**
	 * Get total count of provinces
	 */
	public long getTotalProvinces() {
		return provinceRepository.count();
	}
}
