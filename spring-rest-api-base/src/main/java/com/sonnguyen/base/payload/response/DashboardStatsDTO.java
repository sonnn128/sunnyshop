
package com.sonnguyen.base.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
	private Stat revenue;
	private Stat orders;
	private Stat customers;
	private InventoryStat inventory;

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Stat {
		private BigDecimal total;
		private BigDecimal current;
		private BigDecimal previous;
		private double changePercent;
		private String changeType;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class InventoryStat {
		private int total;
		private int lowStock;
		private int outOfStock;
	}
}
