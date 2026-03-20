
package com.chd.base.controller;

import com.chd.base.payload.response.AnalyticsOverviewDTO;
import com.chd.base.service.AnalyticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF')")
public class AnalyticsController {

	private final AnalyticsService analyticsService;

	public AnalyticsController(AnalyticsService analyticsService) {
		this.analyticsService = analyticsService;
	}

	@GetMapping("/overview")
	public AnalyticsOverviewDTO getAnalyticsOverview() {
		return analyticsService.getAnalyticsOverview();
	}
}
