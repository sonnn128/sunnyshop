
package com.sonnguyen.base.service.impl;

import com.sonnguyen.base.payload.response.DashboardStatsDTO;
import com.sonnguyen.base.payload.response.RecentActivityDTO;
import com.sonnguyen.base.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Override
    public DashboardStatsDTO getDashboardStats() {
        // TODO: Implement logic to fetch and calculate dashboard stats
        return new DashboardStatsDTO();
    }

    @Override
    public List<RecentActivityDTO> getRecentActivities() {
        // TODO: Implement logic to fetch recent activities
        return Collections.emptyList();
    }
}
