package com.harsh.firstSpring.repository;

import com.harsh.firstSpring.entity.OrderItem;
import com.harsh.firstSpring.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {
    void deleteByProduct(Product product);
}
