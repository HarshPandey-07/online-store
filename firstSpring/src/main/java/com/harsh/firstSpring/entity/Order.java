package com.harsh.firstSpring.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Setter(AccessLevel.NONE)
    private Integer id;

    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private BigDecimal totalPrice;

    @Setter(AccessLevel.NONE)
    private LocalDateTime createdAt;

    private String status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @PrePersist
    protected void createAt() {
        createdAt = LocalDateTime.now();
    }
}
