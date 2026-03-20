package com.chd.base.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
	private Long totalRevenue;
	private Long totalOrders;
	private Long totalCustomers;
	private Long totalProducts;
	private Map<String, Object> revenueChart;
	private Map<String, Object> orderStats;
}
