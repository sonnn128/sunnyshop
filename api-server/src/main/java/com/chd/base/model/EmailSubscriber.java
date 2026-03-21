
package com.chd.base.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "email_subscribers")
@Getter
@Setter
@NoArgsConstructor
public class EmailSubscriber {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String email;

	private String name;

	private boolean isActive;

	private Date subscribedAt;

	private Date unsubscribedAt;

	// Preferences can be a separate entity or a JSONB column

	@Enumerated(EnumType.STRING)
	private Source source;
}
