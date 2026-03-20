
package com.chd.base.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "order_id", nullable = false)
	private Order order;

	@ManyToOne
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@Column(name = "product_name", nullable = false)
	private String productName;

	@Column(name = "product_sku")
	private String productSku;

	@Column(name = "unit_price", nullable = false)
	private BigDecimal unitPrice;

	private BigDecimal subtotal;

	@Column(name = "image_url")
	private String imageUrl;

	@Column(name = "variant_name")
	private String variantName;

	private Integer quantity;

	@Column(name = "discount_amount")
	private BigDecimal discountAmount;

	// Getters and Setters
}
