package com.harsh.firstSpring.controller;

import com.harsh.firstSpring.model.*;
import com.harsh.firstSpring.model.user.*;
import com.harsh.firstSpring.model.user.update.ChangeEmailDTO;
import com.harsh.firstSpring.model.user.update.ChangePasswordDTO;
import com.harsh.firstSpring.model.user.update.ChangeUsernameDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.harsh.firstSpring.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<UserResDTO> login(@RequestBody LoginDTO dto, HttpServletRequest request) {
        return ResponseEntity.ok(authService.login(dto, request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> sendUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(authService.sendUser(userPrincipal));
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody UserDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signUp(dto));
    }

    @PostMapping("/admin/update-role")
    public ResponseEntity<?> updateRole(@RequestBody UserUpdateDTO user) {
        return ResponseEntity.ok(authService.changeRole(user));
    }

    @PostMapping("/user/change-username")
    public String updateUsername(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ChangeUsernameDTO dto) {
        return authService.changeUsername(userPrincipal, dto);
    }

    @PostMapping("/user/change-email")
    public ResponseEntity<?> updateEmail(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ChangeEmailDTO dto) {
        return ResponseEntity.ok(authService.changeEmail(userPrincipal, dto));
    }

    @PostMapping("/user/change-password")
    public String updatePassword(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ChangePasswordDTO dto) {
        return authService.changePassword(userPrincipal, dto);
    }

    @GetMapping("/admin/stats")
    public UserStats userStats() {
        return authService.userStats();
    }
}
