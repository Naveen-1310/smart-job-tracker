package com.jobtracker.app.controller;

import com.jobtracker.app.dto.request.UpdateProfileRequest;
import com.jobtracker.app.dto.response.UserProfileResponse;
import com.jobtracker.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * UserController — user profile management.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * GET /api/users/profile
     * Get the authenticated user's profile.
     */
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                userService.getProfile(userDetails.getUsername()));
    }

    /**
     * PUT /api/users/profile
     * Update user profile and optionally change password.
     */
    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                userService.updateProfile(request, userDetails.getUsername()));
    }
}
