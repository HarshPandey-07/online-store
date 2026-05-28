package com.harsh.firstSpring.service;

import com.harsh.firstSpring.model.*;
import com.harsh.firstSpring.model.user.UserDTO;
import com.harsh.firstSpring.model.user.UserPrincipal;
import com.harsh.firstSpring.model.user.UserResDTO;
import com.harsh.firstSpring.model.user.UserUpdateDTO;
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
    public String signUp(UserDTO dto) {
        User entity = new User();
        String password = passwordEncoder.encode(dto.getPassword());
        Role role = roleRepo.findByName("ROLE_USER")
            .orElseThrow(() -> new RuntimeException("Cannot get role"));

        if(userRepo.existsByEmail(dto.getEmail()))
            return "User already exists";

        entity.setUsername(dto.getUsername());
        entity.setPassword(password);
        entity.setEmail(dto.getEmail());
        entity.setRoles(role);

        userRepo.save(entity);
        return "Sign successful!";
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
        return res;
    }

    @Transactional
    public String changeRole(UserUpdateDTO userDTO) {
        User user = userRepo.findByUsername(userDTO.getUsername());

        if(user == null)
            return "Cannot find user!";

        Role role = roleRepo.findById(userDTO.getRoleId())
                .orElseThrow(() -> new RuntimeException("Cannot find role!"));

        user.setRoles(role);
        return "Role updated!";
    }

    @Transactional
    public String changeUsername(UserPrincipal userPrincipal, ChangeUsernameDTO dto) {
        User entity = userPrincipal.getUser();

        if(dto.getUsername() != null && !dto.getUsername().isBlank())
            entity.setUsername(dto.getUsername());

        return "Username changed!"; // Because of transactional it's auto persisted
    }

    @Transactional
    public String changeEmail(UserPrincipal userPrincipal, ChangeEmailDTO dto) {
        User entity = userPrincipal.getUser();

        if(userRepo.existsByEmailAndIdNot(dto.getEmail(), entity.getId()))
            return "Email is already taken by other user";

        if(dto.getEmail() != null && !dto.getEmail().isBlank())
            entity.setEmail(dto.getEmail());

        return "Email changed!";
    }

    @Transactional
    public String changePassword(UserPrincipal userPrincipal, ChangePasswordDTO dto) {
        User entity = userPrincipal.getUser();

        if(!passwordEncoder.matches(dto.getOldPassword(), entity.getPassword()))
            return "Incorrect old password!";

        entity.setPassword(passwordEncoder.encode(dto.getNewPassword()));

        return "Password changed!"; // Automatically updated user, because of @Transactional
    }
}
