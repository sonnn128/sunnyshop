package com.sonnguyen.laptopshop.payload.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductRequest {
    @NotNull
    @NotEmpty(message = "Name is required")
    private String name;

    @NotNull
    @DecimalMin(value = "0", inclusive = false, message = "Price must be greater than 0")
    private Double price;

    private String image;

    @NotEmpty(message = "Description is required")
    private String description;

    @NotNull
    @DecimalMin(value = "0", inclusive = false, message = "Quantity must be greater than 0")
    private Long quantity;

    private String factory;
    private String target;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
