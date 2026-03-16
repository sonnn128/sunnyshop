
package com.sonnguyen.base.controller;

import com.sonnguyen.base.model.ChatConversation;
import com.sonnguyen.base.model.ChatMessage;
import com.sonnguyen.base.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
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
    public ChatConversation getCustomerConversation(@PathVariable Long customerId) {
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
    public ChatConversation assignConversation(@PathVariable Long conversationId, @RequestBody Long staffId) {
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
