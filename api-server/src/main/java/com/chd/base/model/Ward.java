package com.chd.base.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "wards", indexes = {@Index(name = "idx_district_code", columnList = "district_code")})
public class Ward {
	@Id
	private String code;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(name = "name_en", length = 100)
	private String nameEn;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "district_code", nullable = false)
	private District district;
}
