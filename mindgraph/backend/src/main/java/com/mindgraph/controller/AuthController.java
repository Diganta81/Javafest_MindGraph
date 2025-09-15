package com.mindgraph.controller;

import com.mindgraph.dto.JwtResponseDTO;
import com.mindgraph.dto.LoginRequestDTO;
import com.mindgraph.dto.UserRegistrationDTO;
import com.mindgraph.entity.User;
import com.mindgraph.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            System.out.println("Login attempt for user: " + loginRequest.getUsername());
            JwtResponseDTO response = authService.authenticateUser(loginRequest);
            System.out.println("Login successful for user: " + loginRequest.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login failed for user: " + loginRequest.getUsername() + ", Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDTO signUpRequest) {
        try {
            User user = authService.registerUser(signUpRequest);
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        return ResponseEntity.ok("User logged out successfully!");
    }
}
