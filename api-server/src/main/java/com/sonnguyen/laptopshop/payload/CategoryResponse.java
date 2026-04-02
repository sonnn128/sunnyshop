package com.sonnguyen.laptopshop.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.Instant;

@Data
public class CategoryResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String image;
    private Long productCount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant updatedAt;
}
