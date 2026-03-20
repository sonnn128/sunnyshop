
package com.chd.base.service;

import com.chd.base.payload.response.DashboardStatsDTO;
import com.chd.base.payload.response.RecentActivityDTO;

import java.util.List;

public interface DashboardService {
	DashboardStatsDTO getDashboardStats();
	List<RecentActivityDTO> getRecentActivities();
}
