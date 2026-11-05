package com.jobtracker.app.service;

import com.jobtracker.app.dto.request.UpdateProfileRequest;
import com.jobtracker.app.dto.response.UserProfileResponse;
import com.jobtracker.app.entity.User;
import com.jobtracker.app.exception.ResourceNotFoundException;
import com.jobtracker.app.exception.UnauthorizedException;
import com.jobtracker.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Handles user profile read and update operations.
 */
@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private UserProfileResponse toResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .college(user.getCollege())
                .skills(user.getSkills())
                .linkedinUrl(user.getLinkedinUrl())
                .githubUrl(user.getGithubUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }

    /**
     * Get the profile for the authenticated user.
     */
    public UserProfileResponse getProfile(String userEmail) {
        return toResponse(getUserByEmail(userEmail));
    }

    /**
     * Update profile fields and optionally change password.
     */
    public UserProfileResponse updateProfile(UpdateProfileRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        // Update optional fields if provided
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getCollege() != null) user.setCollege(request.getCollege());
        if (request.getSkills() != null) user.setSkills(request.getSkills());
        if (request.getLinkedinUrl() != null) user.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getGithubUrl() != null) user.setGithubUrl(request.getGithubUrl());

        // Handle password change
        if (request.getCurrentPassword() != null && request.getNewPassword() != null) {
            // Verify current password before allowing change
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new UnauthorizedException("Current password is incorrect");
            }
            if (request.getNewPassword().length() < 6) {
                throw new IllegalArgumentException("New password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        return toResponse(userRepository.save(user));
    }
}
