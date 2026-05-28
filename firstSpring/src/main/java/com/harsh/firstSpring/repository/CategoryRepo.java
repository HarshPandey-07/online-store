package com.harsh.firstSpring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harsh.firstSpring.entity.Category;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Integer> {
}