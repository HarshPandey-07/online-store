package com.harsh.firstSpring.controller;

import com.harsh.firstSpring.model.*;
import com.harsh.firstSpring.model.user.UserDTO;
import com.harsh.firstSpring.model.user.UserPrincipal;
import com.harsh.firstSpring.model.user.UserResDTO;
import com.harsh.firstSpring.model.user.UserUpdateDTO;
import com.harsh.firstSpring.model.user.update.ChangeEmailDTO;
import com.harsh.firstSpring.model.user.update.ChangePasswordDTO;
import com.harsh.firstSpring.model.user.update.ChangeUsernameDTO;
import jakarta.servlet.http.HttpServletRequest;
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
    public String login(@RequestBody LoginDTO dto, HttpServletRequest request) {
        return authService.login(dto, request);
    }

    @GetMapping("/me")
    public UserResDTO sendUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return authService.sendUser(userPrincipal);
    }

    @PostMapping("/sign-up")
    public String signUp(@RequestBody UserDTO dto) {
        return authService.signUp(dto);
    }

    @PostMapping("/admin/update-role")
    public String updateRole(@RequestBody UserUpdateDTO user) {
        return authService.changeRole(user);
    }

    @PostMapping("/user/change-username")
    public String updateUsername(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ChangeUsernameDTO dto) {
        return authService.changeUsername(userPrincipal, dto);
    }

    @PostMapping("/user/change-email")
    public String updateEmail(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ChangeEmailDTO dto) {
        return authService.changeEmail(userPrincipal, dto);
    }

    @PostMapping("/user/change-password")
    public String updatePassword(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ChangePasswordDTO dto) {
        return authService.changePassword(userPrincipal, dto);
    }
}
