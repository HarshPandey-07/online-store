package com.harsh.firstSpring.model.product;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ResponseProductDTO {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private String categoryName;
    private Integer stock;
}
