package com.harsh.firstSpring.repository;

import com.harsh.firstSpring.entity.Cart;
import com.harsh.firstSpring.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepo extends JpaRepository<Cart, Integer> {
    Cart findByUser(User user);
}
