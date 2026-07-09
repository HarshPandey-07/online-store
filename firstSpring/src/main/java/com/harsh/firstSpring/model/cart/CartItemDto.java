package com.harsh.firstSpring.model.cart;

import lombok.Data;

@Data
public class CartItemDto {
    private Integer productId;
    private Integer quantity;
}
