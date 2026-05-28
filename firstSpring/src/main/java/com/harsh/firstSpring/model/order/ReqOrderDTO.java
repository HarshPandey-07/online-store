package com.harsh.firstSpring.model.order;

import lombok.Data;

import java.util.List;

@Data
public class ReqOrderDTO {
    private List<OrderItemDTO> items;
}
