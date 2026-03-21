package com.chd.base.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "provinces")
public class Province {
	@Id
	private String code;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(name = "name_en", length = 100)
	private String nameEn;

	@OneToMany(mappedBy = "province", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<District> districts;
}
