package com.sonnguyen.laptopshop.payload.request;

import lombok.Data;

@Data
public class BulkProductRequest {
    private String name;
    private double price;
    private String image;
    private String description;
    private long quantity;
    private String factory;
    private String target;
    private long categoryId;
}
