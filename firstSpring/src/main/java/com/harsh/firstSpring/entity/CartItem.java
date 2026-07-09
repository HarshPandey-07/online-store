package com.harsh.firstSpring.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Data
@Entity
public class CartItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Setter(AccessLevel.NONE)
    private Integer id;

    @ManyToOne @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    private Product product;

    private Integer quantity;
}
