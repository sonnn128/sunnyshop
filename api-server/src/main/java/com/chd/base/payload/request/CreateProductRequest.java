package com.chd.base.payload.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class CreateProductRequest {
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    
    @JsonProperty("sale_price")
    @JsonAlias({"original_price"})
    private BigDecimal salePrice;

    @JsonProperty("cost_price")
    @JsonAlias({"costPrice"})
    private BigDecimal costPrice;
    
    @JsonProperty("stock_quantity")
    private Integer stockQuantity;
    
    private String status = "active";
    
    @JsonProperty("is_featured")
    private boolean featured = false;
    
    @JsonProperty("category_id")
    private Long categoryId;
    
    @JsonProperty("brand_id")
    private Long brandId;
    
    private List<Map<String, Object>> images;
}
