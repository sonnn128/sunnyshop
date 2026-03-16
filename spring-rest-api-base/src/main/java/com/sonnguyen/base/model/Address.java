package com.sonnguyen.base.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
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

	public Address() {
	}

	public Address(Long id, String userId, String label, String fullName, String phone, String addressLine1,
			String addressLine2, String ward, String district, String city, String postalCode, String country,
			boolean isDefault, boolean isBillingDefault, String provinceCode, String districtCode, String wardCode,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		this.id = id;
		this.userId = userId;
		this.label = label;
		this.fullName = fullName;
		this.phone = phone;
		this.addressLine1 = addressLine1;
		this.addressLine2 = addressLine2;
		this.ward = ward;
		this.district = district;
		this.city = city;
		this.postalCode = postalCode;
		this.country = country;
		this.isDefault = isDefault;
		this.isBillingDefault = isBillingDefault;
		this.provinceCode = provinceCode;
		this.districtCode = districtCode;
		this.wardCode = wardCode;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddressLine1() {
		return addressLine1;
	}
	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}
	public String getAddressLine2() {
		return addressLine2;
	}
	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}
	public String getWard() {
		return ward;
	}
	public void setWard(String ward) {
		this.ward = ward;
	}
	public String getDistrict() {
		return district;
	}
	public void setDistrict(String district) {
		this.district = district;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getPostalCode() {
		return postalCode;
	}
	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public boolean isDefault() {
		return isDefault;
	}
	public void setDefault(boolean isDefault) {
		this.isDefault = isDefault;
	}
	public boolean isBillingDefault() {
		return isBillingDefault;
	}
	public void setBillingDefault(boolean isBillingDefault) {
		this.isBillingDefault = isBillingDefault;
	}
	public String getProvinceCode() {
		return provinceCode;
	}
	public void setProvinceCode(String provinceCode) {
		this.provinceCode = provinceCode;
	}
	public String getDistrictCode() {
		return districtCode;
	}
	public void setDistrictCode(String districtCode) {
		this.districtCode = districtCode;
	}
	public String getWardCode() {
		return wardCode;
	}
	public void setWardCode(String wardCode) {
		this.wardCode = wardCode;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

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
