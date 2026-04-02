package com.sonnguyen.laptopshop.payload.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private Double totalPrice;
    private String receiverName;
    private String receiverAddress;
    private String receiverPhone;
    private String status;
    private List<OrderDetailResponse> orderDetails;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant orderDate;

    private UserResponse user;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT")
    private Instant updatedAt;
}
