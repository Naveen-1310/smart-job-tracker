package com.jobtracker.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Returned for user profile requests.
 * We exclude the password field for security.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String college;
    private String skills;
    private String linkedinUrl;
    private String githubUrl;
    private LocalDateTime createdAt;
}
