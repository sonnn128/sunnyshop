package com.chd.base.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
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
