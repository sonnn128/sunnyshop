package com.chd.base.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, unique = true)
	private String slug;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(nullable = false)
	private BigDecimal price;

	@Column(name = "sale_price")
	private BigDecimal salePrice;

	@Column(name = "cost_price")
	private BigDecimal costPrice;

	@Column(name = "stock_quantity")
	private Integer stockQuantity = 0;

	@Column(name = "sold_count")
	private Integer soldCount = 0;

	@Column(name = "status")
	private String status = "active";

	@Column(name = "is_featured")
	private boolean featured = false;

	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;

	@ManyToOne
	@JoinColumn(name = "brand_id")
	private Brand brand;

	@JsonManagedReference
	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	@OrderBy("sortOrder ASC")
	private List<ProductImage> images = new ArrayList<>();

	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	private LocalDateTime updatedAt;

	public boolean isActive() {
		return "active".equalsIgnoreCase(status);
	}
	public void setImages(List<ProductImage> images) {
		this.images.clear();
		if (images == null) return;
		for (ProductImage image : images) {
			image.setProduct(this);
			this.images.add(image);
		}
	}
}
