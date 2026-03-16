
package com.sonnguyen.base.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewDTO {
	private Summary summary;
	private List<Timeline> timeline;
	private List<OrderStatusStat> orderStatus;
	private List<PaymentMethodStat> paymentMethods;
	private List<TopProductStat> topProducts;

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Summary {
		private BigDecimal totalRevenue;
		private int totalOrders;
		private BigDecimal avgOrderValue;
		private int uniqueCustomers;
		private int returningCustomers;
		private int newCustomers;
		private double returningRate;
		private double revenueChange;
		private double ordersChange;
		private double aovChange;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Timeline {
		private String key;
		private String label;
		private int year;
		private int month;
		private BigDecimal revenue;
		private int orders;
		private BigDecimal avgOrderValue;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class OrderStatusStat {
		private String status;
		private int count;
		private double percent;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class PaymentMethodStat {
		private String method;
		private int count;
		private BigDecimal revenue;
		private double percent;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class TopProductStat {
		private Long productId;
		private String name;
		private String image;
		private int totalSold;
		private BigDecimal totalRevenue;
		private Integer stock;
		private Integer soldCount;
		private String slug;
		private Long category;
		private String brand;
		private BigDecimal currentPrice;
	}
}
