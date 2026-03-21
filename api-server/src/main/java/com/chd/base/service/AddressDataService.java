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
         * Load and sync newly merged Vietnam provinces data to database
         */
        @Transactional
        public void syncAddressesFromApi() {
                try {
                        log.info("Starting to seed newly merged Vietnam provinces...");

                        List<String> newProvinces = List.of(
                                // Northern
                                "Tuyên Quang", "Lào Cai", "Thái Nguyên", "Phú Thọ", 
                                "Bắc Ninh", "Hưng Yên", "Ninh Bình", "Lạng Sơn", 
                                "Cao Bằng", "Điện Biên", "Lai Châu", "Sơn La",
                                // Central & Highlands
                                "Thành phố Huế", "Thành phố Đà Nẵng", "Quảng Trị", 
                                "Quảng Ngãi", "Gia Lai", "Đắk Lắk", "Khánh Hòa", "Lâm Đồng",
                                // Southern
                                "Thành phố Hồ Chí Minh", "Thành phố Cần Thơ", "Đồng Nai", 
                                "Tây Ninh", "Đồng Tháp", "Vĩnh Long", "An Giang", "Cà Mau"
                        );

                        if (provinceRepository.count() > 0) {
                                log.info("Provinces are already seeded. Skipping...");
                                return;
                        }

                        int codeCounter = 1;
                        for (String provinceName : newProvinces) {
                                Province province = new Province();
                                String code = String.format("%02d", codeCounter++);
                                province.setCode(code);
                                province.setName(provinceName);
                                province.setDistricts(new ArrayList<>());
                                provinceRepository.save(province);
                                log.debug("Synced new province: {}", provinceName);
                        }

                        log.info("Successfully seeded new Vietnam provinces to database");
                } catch (Exception e) {
                        log.error("Failed to seed Vietnam provinces", e);
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
