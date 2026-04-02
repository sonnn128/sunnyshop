package com.sonnguyen.laptopshop.payload.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class CartResponse {
    private Long id;
    private Integer sum;
    private List<CartDetailResponse> cartDetails;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant updatedAt;
}
