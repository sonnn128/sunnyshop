package com.chd.base.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "cart_items", uniqueConstraints = {
		@UniqueConstraint(name = "uk_user_product_variant", columnNames = {"user_id", "product_id", "variant_id"})})
public class CartItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// User sở hữu giỏ hàng
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	// Có thể thêm sessionId nếu bạn muốn hỗ trợ guest-cart
	@Column(name = "session_id")
	private String sessionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	// Nếu sau này bạn có bảng ProductVariant thì map @ManyToOne vào đây
	@Column(name = "variant_id")
	private Long variantId;

	@Column(nullable = false)
	private Integer quantity = 1;

	// Giá snapshot tại thời điểm thêm vào giỏ
	@Column(name = "price_at_add", precision = 15, scale = 2)
	private BigDecimal priceAtAdd;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;
}
