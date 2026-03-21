package com.chd.base.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
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
	@JsonAlias({ "logo_url", "logoUrl" })
	private String logoUrl;

	@Column(columnDefinition = "TEXT")
	private String description;

	@JsonAlias({ "website", "web_site" })
	private String website;

	@Column(name = "sort_order")
	@JsonAlias({ "sort_order", "sortOrder" })
	private Integer sortOrder = 0;

	@Column(name = "is_active")
	@JsonAlias({ "is_active", "isActive" })
	@JsonProperty("is_active")
	private boolean isActive = true;

	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	private LocalDateTime updatedAt;

}
