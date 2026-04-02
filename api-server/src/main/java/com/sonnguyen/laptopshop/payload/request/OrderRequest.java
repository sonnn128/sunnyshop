package com.sonnguyen.laptopshop.payload.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotEmpty(message = "Receiver name is required")
    private String receiverName;

    @NotEmpty(message = "Receiver address is required")
    private String receiverAddress;

    @NotEmpty(message = "Receiver phone is required")
    private String receiverPhone;

    @NotNull(message = "Cart items are required")
    private List<CartItemRequest> cartItems;
}
