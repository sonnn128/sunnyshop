package com.chd.base.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityDTO {
	private String id;
	private String type;
	private String description;
	private String userId;
	private String username;
	private LocalDateTime timestamp;
}
