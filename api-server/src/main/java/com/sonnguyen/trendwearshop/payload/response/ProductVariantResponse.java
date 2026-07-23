package com.sonnguyen.trendwearshop.payload.response;

import lombok.Data;

@Data
public class ProductVariantResponse {
    private Long id;
    private String size;
    private String color;
    private Integer quantity;
}
