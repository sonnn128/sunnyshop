package com.sonnguyen.laptopshop.payload.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.Instant;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private Double price;
    private String image;
    private String description;
    private Long quantity;
    private Long sold;
    private String factory;
    private String target;
    private Long categoryId;
    private String categoryName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant updatedAt;
}
