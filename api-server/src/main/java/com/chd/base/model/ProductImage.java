package com.chd.base.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "product_images")
public class ProductImage {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
	private String imageUrl;

	@Column(name = "alt_text")
	private String altText;

	@Column(name = "sort_order")
	private Integer sortOrder = 0;

	@Column(name = "is_primary")
	@Getter(AccessLevel.NONE)
	@Setter(AccessLevel.NONE)
	private boolean primaryImage = false;

	@JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id")
	private Product product;

	public boolean isPrimary() {
		return primaryImage;
	}

	public void setPrimary(boolean primaryImage) {
		this.primaryImage = primaryImage;
	}

}
