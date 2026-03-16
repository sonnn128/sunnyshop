
package com.sonnguyen.base.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "wishlist")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wishlist {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	private String notes;

	private Integer priority;

	@Column(name = "notify_on_sale")
	private boolean notifyOnSale;

	@Column(name = "notify_on_restock")
	private boolean notifyOnRestock;

	@Column(name = "price_when_added")
	private BigDecimal priceWhenAdded;

	// Getters and Setters
}
