package com.harsh.firstSpring.repository;

import com.harsh.firstSpring.entity.Order;
import com.harsh.firstSpring.entity.User;
import com.harsh.firstSpring.util.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {
    Page<Order> findAllByUser(User user, Pageable pageable);
    Optional<Order> findTopByUserIdOrderByCreatedAtDesc(Integer user);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Long countByStatus(OrderStatus status);
}
