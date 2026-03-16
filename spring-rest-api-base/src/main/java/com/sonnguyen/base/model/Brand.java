package com.sonnguyen.base.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "brands", indexes = {@Index(name = "idx_brand_slug", columnList = "slug", unique = true),
		@Index(name = "idx_brand_active", columnList = "is_active"),
		@Index(name = "idx_brand_sort", columnList = "sort_order")})
public class Brand {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String name;

	@Column(nullable = false, unique = true)
	private String slug;

	@Column(name = "logo_url")
	private String logoUrl;

	@Column(columnDefinition = "TEXT")
	private String description;

	private String website;

	@Column(name = "sort_order")
	private Integer sortOrder = 0;

	@Column(name = "is_active")
	private boolean isActive = true;

	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	private LocalDateTime updatedAt;

	public Brand() {
	}

	public Brand(Long id, String name, String slug, String logoUrl, String description, String website,
			Integer sortOrder, boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt) {
		this.id = id;
		this.name = name;
		this.slug = slug;
		this.logoUrl = logoUrl;
		this.description = description;
		this.website = website;
		this.sortOrder = sortOrder;
		this.isActive = isActive;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSlug() {
		return slug;
	}
	public void setSlug(String slug) {
		this.slug = slug;
	}
	public String getLogoUrl() {
		return logoUrl;
	}
	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getWebsite() {
		return website;
	}
	public void setWebsite(String website) {
		this.website = website;
	}
	public Integer getSortOrder() {
		return sortOrder;
	}
	public void setSortOrder(Integer sortOrder) {
		this.sortOrder = sortOrder;
	}
	public boolean isActive() {
		return isActive;
	}
	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
}
