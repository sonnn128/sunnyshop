
package com.chd.base.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "chat_conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatConversation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "customer_id", nullable = false)
	private User customer;

	@Column(name = "customer_name", nullable = false)
	private String customerName;

	@Column(name = "customer_email", nullable = false)
	private String customerEmail;

	@ManyToOne
	@JoinColumn(name = "assigned_to")
	private User assignedTo;

	@Enumerated(EnumType.STRING)
	private ConversationStatus status;

	private String lastMessage;

	private Date lastMessageAt;

	private int unreadCount;

	@Enumerated(EnumType.STRING)
	private Priority priority;

}
