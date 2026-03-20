
package com.chd.base.controller;

import com.chd.base.payload.response.DashboardStatsDTO;
import com.chd.base.payload.response.RecentActivityDTO;
import com.chd.base.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF')")
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
