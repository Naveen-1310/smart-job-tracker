package com.jobtracker.app.controller;

import com.jobtracker.app.dto.request.LoginRequest;
import com.jobtracker.app.dto.request.RegisterRequest;
import com.jobtracker.app.dto.response.AuthResponse;
import com.jobtracker.app.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController — handles user registration and login.
 *
 * These endpoints are PUBLIC (no JWT required).
 * Configured in SecurityConfig to skip authentication.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Register a new user account.
     *
     * @Valid triggers validation annotations on RegisterRequest
     * Returns 201 Created with JWT token on success
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Authenticate a user and return a JWT token.
     *
     * Returns 200 OK with JWT token on success
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
