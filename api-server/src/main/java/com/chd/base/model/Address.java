package com.chd.base.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "addresses", indexes = {@Index(name = "idx_user_id", columnList = "user_id"),
		@Index(name = "idx_user_default", columnList = "user_id, is_default")})
public class Address {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "user_id", nullable = false)
	private String userId;

	@Column(length = 50)
	private String label = "Nhà riêng";

	@Column(name = "full_name", length = 100)
	private String fullName;

	@Column(length = 20)
	private String phone;

	@Column(name = "address_line1")
	private String addressLine1;

	@Column(name = "address_line2")
	private String addressLine2;

	private String ward;
	private String district;
	private String city;

	@Column(name = "postal_code")
	private String postalCode;

	private String country = "Vietnam";

	@Column(name = "is_default")
	private boolean isDefault = false;

	@Column(name = "is_billing_default")
	private boolean isBillingDefault = false;

	@Column(name = "province_code")
	private String provinceCode;

	@Column(name = "district_code")
	private String districtCode;

	@Column(name = "ward_code")
	private String wardCode;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	// Virtual field tương đương full_address trong JS
	@Transient
	public String getFullAddress() {
		return String.join(", ", java.util.stream.Stream.of(addressLine1, addressLine2, ward, district, city, country)
				.filter(s -> s != null && !s.isEmpty()).toArray(String[]::new));
	}

	public static AddressBuilder builder() {
		return new AddressBuilder();
	}

	public static class AddressBuilder {
		private Long id;
		private String userId;
		private String label;
		private String fullName;
		private String phone;
		private String addressLine1;
		private String addressLine2;
		private String ward;
		private String district;
		private String city;
		private String postalCode;
		private String country;
		private boolean isDefault;
		private boolean isBillingDefault;
		private String provinceCode;
		private String districtCode;
		private String wardCode;

		public AddressBuilder id(Long id) {
			this.id = id;
			return this;
		}
		public AddressBuilder userId(String userId) {
			this.userId = userId;
			return this;
		}
		public AddressBuilder label(String label) {
			this.label = label;
			return this;
		}
		public AddressBuilder fullName(String fullName) {
			this.fullName = fullName;
			return this;
		}
		public AddressBuilder phone(String phone) {
			this.phone = phone;
			return this;
		}
		public AddressBuilder addressLine1(String addressLine1) {
			this.addressLine1 = addressLine1;
			return this;
		}
		public AddressBuilder addressLine2(String addressLine2) {
			this.addressLine2 = addressLine2;
			return this;
		}
		public AddressBuilder ward(String ward) {
			this.ward = ward;
			return this;
		}
		public AddressBuilder district(String district) {
			this.district = district;
			return this;
		}
		public AddressBuilder city(String city) {
			this.city = city;
			return this;
		}
		public AddressBuilder postalCode(String postalCode) {
			this.postalCode = postalCode;
			return this;
		}
		public AddressBuilder country(String country) {
			this.country = country;
			return this;
		}
		public AddressBuilder isDefault(boolean isDefault) {
			this.isDefault = isDefault;
			return this;
		}
		public AddressBuilder isBillingDefault(boolean isBillingDefault) {
			this.isBillingDefault = isBillingDefault;
			return this;
		}
		public AddressBuilder provinceCode(String provinceCode) {
			this.provinceCode = provinceCode;
			return this;
		}
		public AddressBuilder districtCode(String districtCode) {
			this.districtCode = districtCode;
			return this;
		}
		public AddressBuilder wardCode(String wardCode) {
			this.wardCode = wardCode;
			return this;
		}

		public Address build() {
			return new Address(id, userId, label, fullName, phone, addressLine1, addressLine2, ward, district, city,
					postalCode, country, isDefault, isBillingDefault, provinceCode, districtCode, wardCode, null, null);
		}
	}
}
