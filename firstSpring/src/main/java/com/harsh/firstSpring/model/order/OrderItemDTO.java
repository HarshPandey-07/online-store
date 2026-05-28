package com.harsh.firstSpring.model.order;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Integer productId;
    private Integer quantity;
}
