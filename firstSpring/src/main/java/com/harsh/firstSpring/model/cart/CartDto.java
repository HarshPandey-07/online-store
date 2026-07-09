package com.harsh.firstSpring.model.cart;

import lombok.Data;

import java.util.List;

@Data
public class CartDto <T> {
    private List<T> items;
}
