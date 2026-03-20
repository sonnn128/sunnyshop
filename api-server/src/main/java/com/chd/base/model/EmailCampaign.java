
package com.chd.base.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "email_campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailCampaign {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	private String subject;

	@Lob
	private String content;

	@Enumerated(EnumType.STRING)
	private CampaignType type;

	@Enumerated(EnumType.STRING)
	private CampaignStatus status;

	private Date scheduledAt;

	private Date sentAt;

	// TargetAudience and Statistics can be separate entities or JSONB columns

	@ManyToOne
	@JoinColumn(name = "created_by", nullable = false)
	private User createdBy;

	// Getters and Setters
}
