
package com.chd.base.service;

import com.chd.base.model.ChatConversation;
import com.chd.base.model.ChatMessage;

import java.util.List;

public interface ChatService {
	List<ChatConversation> getConversations();
	ChatConversation getCustomerConversation(String customerId);
	List<ChatMessage> getMessages(Long conversationId);
	ChatMessage sendMessage(ChatMessage message);
	ChatConversation assignConversation(Long conversationId, String staffId);
	ChatConversation closeConversation(Long conversationId);
	ChatConversation reopenConversation(Long conversationId);
	void markMessagesAsRead(Long conversationId);
}
