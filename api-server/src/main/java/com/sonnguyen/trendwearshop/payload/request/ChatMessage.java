package com.sonnguyen.trendwearshop.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String role; // "user" hoặc "model"
    private String content; // nội dung tin nhắn
}
