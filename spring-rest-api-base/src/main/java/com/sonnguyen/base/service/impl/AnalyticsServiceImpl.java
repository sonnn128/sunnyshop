
package com.sonnguyen.base.service.impl;

import com.sonnguyen.base.payload.response.AnalyticsOverviewDTO;
import com.sonnguyen.base.service.AnalyticsService;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Override
    public AnalyticsOverviewDTO getAnalyticsOverview() {
        // TODO: Implement logic to fetch and calculate analytics overview
        return new AnalyticsOverviewDTO();
    }
}
