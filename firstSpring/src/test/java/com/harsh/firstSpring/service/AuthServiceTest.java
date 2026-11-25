package com.harsh.firstSpring.service;

import com.harsh.firstSpring.entity.Role;
import com.harsh.firstSpring.entity.User;
import com.harsh.firstSpring.exception.RoleNotFoundException;
import com.harsh.firstSpring.exception.UserAlreadyExistsException;
import com.harsh.firstSpring.model.user.UserDTO;
import com.harsh.firstSpring.model.user.UserResDTO;
import com.harsh.firstSpring.repository.RoleRepo;
import com.harsh.firstSpring.repository.UserRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private RoleRepo roleRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void signUp_shouldReturnUserResDTO_whenSignUpSuccessful() {

        // Request User DTO
        UserDTO dto = new UserDTO();
        dto.setUsername("test");
        dto.setEmail("test@email.com");
        dto.setPassword("password123");

        Role role = new Role();
        role.setName("ROLE_USER");

        // Mock Response DTO
        User savedUser = new User();
        savedUser.setUsername("test");
        savedUser.setEmail("test@email.com");
        savedUser.setPassword("encodedPassword");
        savedUser.setRole(role);

        // Set the behaviour
        when(userRepo.existsByEmail("test@email.com")).thenReturn(false);
        when(roleRepo.findByName("ROLE_USER")).thenReturn(Optional.of(role));
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepo.save(any(User.class))).thenReturn(savedUser);

        // Call the service
        UserResDTO result = authService.signUp(dto);

        // Verify result
        assertNotNull(result);
        assertEquals("test", result.getUsername());
        assertEquals("test@email.com", result.getEmail());
        assertEquals("ROLE_USER", result.getRole());

        verify(passwordEncoder).encode("password123");
        verify(userRepo).save(any(User.class));
    }

    @Test
    void signUp_shouldThrowException_whenUserAlreadyExists() {

        UserDTO dto = new UserDTO();
        dto.setUsername("test");
        dto.setEmail("test@email.com");
        dto.setPassword("password123");

        when(userRepo.existsByEmail("test@email.com")).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> authService.signUp(dto));

        verifyNoInteractions(roleRepo, passwordEncoder);
        verify(userRepo, never()).save(any(User.class));
    }

    @Test
    void signUp_shouldThrowException_whenRoleNotFound() {

        UserDTO dto = new UserDTO();
        dto.setUsername("test");
        dto.setEmail("test@email.com");
        dto.setPassword("password123");

        when(userRepo.existsByEmail("test@email.com")).thenReturn(false);
        when(roleRepo.findByName("ROLE_USER")).thenReturn(Optional.empty());

        assertThrows(RoleNotFoundException.class, () -> authService.signUp(dto));

        verifyNoInteractions(passwordEncoder);
        verify(userRepo, never()).save(any(User.class));
    }
}