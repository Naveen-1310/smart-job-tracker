package com.jobtracker.app.dto.request;

import lombok.Data;

/**
 * DTO for updating user profile information.
 * Password change is handled by a separate field to be explicit.
 */
@Data
public class UpdateProfileRequest {

    private String name;
    private String phone;
    private String college;
    private String skills;
    private String linkedinUrl;
    private String githubUrl;

    // Optional: provide current password to change to a new one
    private String currentPassword;
    private String newPassword;
}
