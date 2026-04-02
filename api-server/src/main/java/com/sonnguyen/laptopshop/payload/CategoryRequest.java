package com.sonnguyen.laptopshop.payload;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotNull
    @NotEmpty(message = "Category name is required")
    private String name;

    @NotNull
    @NotEmpty(message = "Slug is required")
    private String slug;

    private String description;
    private String image;
}
