package com.harsh.firstSpring.model.order;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ResOrderItemDTO {
    private Integer id;
    private OrderProductDTO product;
    private Integer quantity;
    private BigDecimal priceAtPurchased;
}
