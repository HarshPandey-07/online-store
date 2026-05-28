package com.harsh.firstSpring.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.math.BigDecimal;

@Data
@Entity
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Setter(AccessLevel.NONE)
    private Integer id;

    @ManyToOne @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    private Product product;

    private Integer quantity;

    private BigDecimal priceAtPurchase;
}
