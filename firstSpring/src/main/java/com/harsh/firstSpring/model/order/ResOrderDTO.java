package com.harsh.firstSpring.model.order;

import com.harsh.firstSpring.util.OrderStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ResOrderDTO {
    private Integer id;
    private ResUserOrderDTO user;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
    private OrderStatus status;
    private List<ResOrderItemDTO> orderItems;
}
