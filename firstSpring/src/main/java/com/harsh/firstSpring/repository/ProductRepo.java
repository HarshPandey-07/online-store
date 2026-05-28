package com.harsh.firstSpring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.harsh.firstSpring.entity.Product;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

    @Query("""
        SELECT p FROM Product p
        WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    List<Product> searchItems(@Param("keyword") String keyword);
}