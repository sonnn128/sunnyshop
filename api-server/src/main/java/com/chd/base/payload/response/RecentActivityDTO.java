package com.chd.base.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
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
