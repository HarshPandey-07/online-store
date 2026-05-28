package com.harsh.firstSpring.model.product;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RequestProductDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer categoryId;
    private Integer stock;
}
