
package com.chd.base.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String code;

	private String name;

	private String description;

	@Enumerated(EnumType.STRING)
	private CouponType type;

	private BigDecimal value;

	@Column(name = "minimum_order_amount")
	private BigDecimal minimumOrderAmount;

	@Column(name = "maximum_discount_amount")
	private BigDecimal maximumDiscountAmount;

	@Column(name = "usage_limit")
	private Integer usageLimit;

	@Column(name = "usage_count")
	private Integer usageCount = 0;

	@Column(name = "user_limit")
	private Integer userLimit = 1;

	@Column(name = "is_active")
	private boolean isActive = true;

	@Column(name = "starts_at")
	private Date startsAt;

	@Column(name = "expires_at")
	private Date expiresAt;

	@ManyToOne
	@JoinColumn(name = "created_by")
	private User createdBy;

	// Getters and Setters
}
