package com.chd.base.repository;

import com.chd.base.model.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WardRepository extends JpaRepository<Ward, String> {
	List<Ward> findByDistrictCode(String districtCode);
}
