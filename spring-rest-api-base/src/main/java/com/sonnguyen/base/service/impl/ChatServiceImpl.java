
package com.sonnguyen.base.service.impl;

import com.sonnguyen.base.model.ChatConversation;
import com.sonnguyen.base.model.ChatMessage;
import com.sonnguyen.base.service.ChatService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    @Override
    public List<ChatConversation> getConversations() {
        // TODO: Implement logic
        return Collections.emptyList();
    }

    @Override
    public ChatConversation getCustomerConversation(Long customerId) {
        // TODO: Implement logic
        return null;
    }

    @Override
    public List<ChatMessage> getMessages(Long conversationId) {
        // TODO: Implement logic
        return Collections.emptyList();
    }

    @Override
    public ChatMessage sendMessage(ChatMessage message) {
        // TODO: Implement logic
        return null;
    }

    @Override
    public ChatConversation assignConversation(Long conversationId, Long staffId) {
        // TODO: Implement logic
        return null;
    }

    @Override
    public ChatConversation closeConversation(Long conversationId) {
        // TODO: Implement logic
        return null;
    }

    @Override
    public ChatConversation reopenConversation(Long conversationId) {
        // TODO: Implement logic
        return null;
    }

    @Override
    public void markMessagesAsRead(Long conversationId) {
        // TODO: Implement logic
    }
}
