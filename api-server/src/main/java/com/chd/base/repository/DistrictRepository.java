package com.chd.base.repository;

import com.chd.base.model.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District, String> {
	List<District> findByProvinceCode(String provinceCode);
}
