package com.harsh.firstSpring.repository;

import com.harsh.firstSpring.entity.Order;
import com.harsh.firstSpring.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {
    Page<Order> findAllByUser(User user, Pageable pageable);
}
