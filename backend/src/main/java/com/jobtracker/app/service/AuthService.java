package com.jobtracker.app.service;

import com.jobtracker.app.dto.request.LoginRequest;
import com.jobtracker.app.dto.request.RegisterRequest;
import com.jobtracker.app.dto.response.AuthResponse;
import com.jobtracker.app.entity.User;
import com.jobtracker.app.repository.UserRepository;
import com.jobtracker.app.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Handles user registration and login business logic.
 */
@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserDetailsService userDetailsService;

    /**
     * Register a new user.
     *
     * Steps:
     * 1. Check if email is already taken.
     * 2. Hash the password with BCrypt.
     * 3. Save user to database.
     * 4. Generate JWT token.
     * 5. Return token + user info.
     */
    public AuthResponse register(RegisterRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email is already registered: " + request.getEmail());
        }

        // Build and save the user entity
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // BCrypt hash
                .build();

        userRepository.save(user);

        // Generate JWT for the new user
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    /**
     * Authenticate an existing user.
     *
     * Steps:
     * 1. Use AuthenticationManager to verify email + password.
     *    (Internally uses UserDetailsService + BCrypt comparison)
     * 2. Generate JWT token.
     * 3. Return token + user info.
     */
    public AuthResponse login(LoginRequest request) {
        // This will throw BadCredentialsException if wrong credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Load user details and generate token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        // Fetch user for name/id info
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
