package com.sonnguyen.trendwearshop.controller;

import com.sonnguyen.trendwearshop.payload.request.ChatRequest;
import com.sonnguyen.trendwearshop.payload.response.ApiResponse;
import com.sonnguyen.trendwearshop.service.ChatbotService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chatbot")
@Tag(name = "Chatbot", description = "AI Chatbot Advisor APIs")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> chatWithBot(@RequestBody ChatRequest request) {
        String reply = chatbotService.getChatbotResponse(request);
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("Chatbot responded successfully")
                .data(reply)
                .build();
        return ResponseEntity.ok(response);
    }
}
