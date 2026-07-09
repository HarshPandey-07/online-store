package com.harsh.firstSpring.model.cart;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ResCartItemDto {
    private String productName;
    private BigDecimal price;
    private Integer quantity;
}
