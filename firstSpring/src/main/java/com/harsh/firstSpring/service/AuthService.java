package com.harsh.firstSpring.service;

import com.harsh.firstSpring.exception.RoleNotFoundException;
import com.harsh.firstSpring.exception.UserAlreadyExistsException;
import com.harsh.firstSpring.exception.UserNotFoundException;
import com.harsh.firstSpring.model.*;
import com.harsh.firstSpring.model.user.*;
import com.harsh.firstSpring.model.user.update.ChangeEmailDTO;
import com.harsh.firstSpring.model.user.update.ChangePasswordDTO;
import com.harsh.firstSpring.model.user.update.ChangeUsernameDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import com.harsh.firstSpring.entity.Role;
import com.harsh.firstSpring.entity.User;
import com.harsh.firstSpring.repository.RoleRepo;
import com.harsh.firstSpring.repository.UserRepo;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManger;

    public AuthService(UserRepo userRepo, RoleRepo roleRepo, PasswordEncoder passwordEncoder, AuthenticationManager authManger) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
        this.authManger = authManger;
    }

    @Transactional
    public UserResDTO signUp(UserDTO dto) {
        if(userRepo.existsByEmail(dto.getEmail()))
            throw new UserAlreadyExistsException(dto.getEmail() + ": already exists!");

        Role role = roleRepo.findByName("ROLE_USER")
            .orElseThrow(() -> new RoleNotFoundException("Cannot get role: ROLE_USER!"));

        User entity = new User();
        entity.setUsername(dto.getUsername());
        entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        entity.setEmail(dto.getEmail());
        entity.setRole(role);

        User savedUser = userRepo.save(entity);
        var returnUser = new UserResDTO();

        returnUser.setUsername(savedUser.getUsername());
        returnUser.setEmail(savedUser.getEmail());
        returnUser.setRole(savedUser.getRole().getName());

        return returnUser;
    }

    @Transactional
    public String login(LoginDTO dto, HttpServletRequest request) {
        Authentication auth = authManger.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getUsername(),
                        dto.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        request.getSession(true)
                .setAttribute(
                        HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                        SecurityContextHolder.getContext()
                );
        return "Login successful!";
    }

    public UserResDTO sendUser(UserPrincipal userPrincipal) {
        UserResDTO res = new UserResDTO();

        if(userPrincipal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        res.setUsername(userPrincipal.getUsername());
        res.setRole(userPrincipal.getRole().replace("ROLE_", "").toLowerCase());
        res.setEmail(userPrincipal.getEmail());
        return res;
    }

    @Transactional
    public UserResDTO changeRole(UserUpdateDTO userDTO) {
        User user = userRepo.findByUsername(userDTO.getUsername());

        if(user == null)
            throw new UserNotFoundException("Cannot find user!");

        Role role = roleRepo.findById(userDTO.getRoleId())
                .orElseThrow(() -> new RoleNotFoundException("Cannot find role!"));

        user.setRole(role);

        UserResDTO response = new UserResDTO();
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(role.getName());

        return response;
    }

    @Transactional
    public String changeUsername(UserPrincipal userPrincipal, ChangeUsernameDTO dto) {
        User entity = userPrincipal.getUser();

        if(dto.getUsername() != null && !dto.getUsername().isBlank())
            entity.setUsername(dto.getUsername());

        return "Username changed!"; // Because of transactional it's auto persisted
    }

    @Transactional
    public UserResDTO changeEmail(UserPrincipal userPrincipal, ChangeEmailDTO dto) {
        User entity = userPrincipal.getUser();

        if (dto.getEmail() == null || dto.getEmail().isBlank())
            throw new IllegalArgumentException("Email cannot be empty");

        if(userRepo.existsByEmailAndIdNot(dto.getEmail(), entity.getId()))
            throw new UserAlreadyExistsException("Email is already taken");

        entity.setEmail(dto.getEmail());

        UserResDTO response = new UserResDTO();
        response.setUsername(entity.getUsername());
        response.setEmail(entity.getEmail());
        response.setRole(entity.getRole().getName());

        return response;
    }

    @Transactional
    public String changePassword(UserPrincipal userPrincipal, ChangePasswordDTO dto) {
        User entity = userPrincipal.getUser();

        if(!passwordEncoder.matches(dto.getOldPassword(), entity.getPassword()))
            return "Incorrect old password!";

        entity.setPassword(passwordEncoder.encode(dto.getNewPassword()));

        return "Password changed!"; // Automatically updated user, because of @Transactional
    }

    public UserStats userStats() {
        UserStats stats = new UserStats();

        stats.setTotalUser(userRepo.count());
        stats.setAdmin(userRepo.countByRole_Name("ROLE_ADMIN"));
        stats.setUser(userRepo.countByRole_Name("ROLE_USER"));

        return stats;
    }
}
