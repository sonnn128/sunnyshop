
package com.sonnguyen.base.controller;

import com.sonnguyen.base.payload.response.DashboardStatsDTO;
import com.sonnguyen.base.payload.response.RecentActivityDTO;
import com.sonnguyen.base.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

	private final DashboardService dashboardService;

	public DashboardController(DashboardService dashboardService) {
		this.dashboardService = dashboardService;
	}

	@GetMapping("/stats")
	public DashboardStatsDTO getDashboardStats() {
		return dashboardService.getDashboardStats();
	}

	@GetMapping("/activities")
	public List<RecentActivityDTO> getRecentActivities() {
		return dashboardService.getRecentActivities();
	}
}
