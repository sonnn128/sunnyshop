package com.chd.base.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewDTO {
	private Map<String, Object> overview;
	private Map<String, Object> charts;
	private Map<String, Object> trends;
}
