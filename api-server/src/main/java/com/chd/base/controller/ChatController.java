
package com.chd.base.controller;

import com.chd.base.model.ChatConversation;
import com.chd.base.model.ChatMessage;
import com.chd.base.service.ChatService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'STAFF')")
public class ChatController {

	private final ChatService chatService;

	public ChatController(ChatService chatService) {
		this.chatService = chatService;
	}

	@GetMapping("/conversations")
	public List<ChatConversation> getConversations() {
		return chatService.getConversations();
	}

	@GetMapping("/conversation/{customerId}")
	public ChatConversation getCustomerConversation(@PathVariable String customerId) {
		return chatService.getCustomerConversation(customerId);
	}

	@GetMapping("/messages/{conversationId}")
	public List<ChatMessage> getMessages(@PathVariable Long conversationId) {
		return chatService.getMessages(conversationId);
	}

	@PostMapping("/messages")
	public ChatMessage sendMessage(@RequestBody ChatMessage message) {
		return chatService.sendMessage(message);
	}

	@PostMapping("/assign/{conversationId}")
	public ChatConversation assignConversation(@PathVariable Long conversationId, @RequestBody String staffId) {
		return chatService.assignConversation(conversationId, staffId);
	}

	@PostMapping("/close/{conversationId}")
	public ChatConversation closeConversation(@PathVariable Long conversationId) {
		return chatService.closeConversation(conversationId);
	}

	@PostMapping("/reopen/{conversationId}")
	public ChatConversation reopenConversation(@PathVariable Long conversationId) {
		return chatService.reopenConversation(conversationId);
	}

	@PostMapping("/mark-read/{conversationId}")
	public void markMessagesAsRead(@PathVariable Long conversationId) {
		chatService.markMessagesAsRead(conversationId);
	}
}
