
package com.sonnguyen.base.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityDTO {
	private String id;
	private String type;
	private String title;
	private String description;
	private String time;
	private String icon;
	private String color;

	// Getters and Setters
}
