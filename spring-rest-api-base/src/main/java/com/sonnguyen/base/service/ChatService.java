
package com.sonnguyen.base.service;

import com.sonnguyen.base.model.ChatConversation;
import com.sonnguyen.base.model.ChatMessage;

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
