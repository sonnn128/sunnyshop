package com.sonnguyen.trendwearshop.payload.request;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long productId;
    private int rating;
    private String comment;
}
