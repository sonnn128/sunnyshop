package com.sonnguyen.base.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "categories")
public class Category {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 191)
	private String slug;

	@Column(nullable = false, length = 191)
	private String name;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	private Category parent;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "image_url")
	private String imageUrl;

	@Column(name = "is_active")
	private Boolean active = Boolean.TRUE;

	@Column(name = "is_featured")
	private Boolean featured = Boolean.FALSE;

	@Column(name = "sort_order")
	private Integer sortOrder = 0;

	@Column(name = "meta_title")
	private String metaTitle;

	@Column(name = "meta_description", columnDefinition = "TEXT")
	private String metaDescription;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;
}
