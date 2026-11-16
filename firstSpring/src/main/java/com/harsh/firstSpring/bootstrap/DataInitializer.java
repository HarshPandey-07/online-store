package com.harsh.firstSpring.bootstrap;

import com.harsh.firstSpring.config.AdminProperties;
import com.harsh.firstSpring.entity.Category;
import com.harsh.firstSpring.entity.Role;
import com.harsh.firstSpring.entity.User;
import com.harsh.firstSpring.repository.CategoryRepo;
import com.harsh.firstSpring.repository.RoleRepo;
import com.harsh.firstSpring.repository.UserRepo;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataInitializer implements ApplicationRunner {
    private final AdminProperties adminProperties;
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final CategoryRepo categoryRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminProperties adminProperties, UserRepo userRepo, RoleRepo roleRepo, CategoryRepo categoryRepo, PasswordEncoder passwordEncoder) {
        this.adminProperties = adminProperties;
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.categoryRepo = categoryRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        initializeRoles();
        initializeCategories();
        initializeAdmin();
    }

    private void initializeRoles() {
        List<String> roles = List.of("ROLE_ADMIN", "ROLE_USER");

        for (String roleName : roles) {
            if (!roleRepo.existsByName(roleName)) {
                Role role = new Role();
                role.setName(roleName);

                roleRepo.save(role);
            }
        }
    }

    private void initializeCategories() {
        List<String> categories = List.of(
                "Electronics",
                "Clothing",
                "Books",
                "Home & Kitchen",
                "Sports"
        );

        for (String categoryName : categories) {
            if (!categoryRepo.existsByName(categoryName)) {
                Category category = new Category();
                category.setName(categoryName);

                categoryRepo.save(category);
            }
        }
    }

    private void initializeAdmin() {
        User admin = userRepo.findByEmail(adminProperties.getEmail());
        Role role = roleRepo.findByName("ROLE_ADMIN").orElseThrow();

        if (admin == null) {
            admin = new User();

            admin.setUsername(adminProperties.getUsername());
            admin.setEmail(adminProperties.getEmail());
            admin.setPassword(passwordEncoder.encode(adminProperties.getPassword()));
            admin.setRole(role);

            userRepo.save(admin);
        } else if (!admin.getRole().getId().equals(role.getId())) {
            admin.setRole(role);
        }
    }
}
