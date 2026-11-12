package com.jobtracker.app.entity;

import lombok.*;
import java.time.LocalDateTime;

/**
 * User POJO — plain Java object, NO Hibernate annotations.
 * Maps to the 'users' table via JdbcTemplate queries.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    private Long id;
    private String name;
    private String email;
    private String password;    // BCrypt hashed
    private String phone;
    private String college;
    private String skills;
    private String linkedinUrl;
    private String githubUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
