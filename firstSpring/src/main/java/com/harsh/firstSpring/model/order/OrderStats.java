package com.harsh.firstSpring.model.order;

import lombok.Data;

@Data
public class OrderStats {
    private Long orders;
    private Long ordersPending;
    private Long ordersDelivered;
    private Long ordersCanceled;
}