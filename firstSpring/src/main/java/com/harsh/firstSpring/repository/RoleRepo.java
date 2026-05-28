package com.harsh.firstSpring.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.harsh.firstSpring.entity.Role;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(String name);
}
