package com.chd.base.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewDTO {
	private Map<String, Object> overview;
	private Map<String, Object> charts;
	private Map<String, Object> trends;
}
