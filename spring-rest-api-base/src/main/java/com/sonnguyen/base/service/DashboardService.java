
package com.sonnguyen.base.service;

import com.sonnguyen.base.payload.response.DashboardStatsDTO;
import com.sonnguyen.base.payload.response.RecentActivityDTO;

import java.util.List;

public interface DashboardService {
	DashboardStatsDTO getDashboardStats();
	List<RecentActivityDTO> getRecentActivities();
}
