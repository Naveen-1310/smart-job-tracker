package com.jobtracker.app.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * User entity - maps to the 'users' table in MySQL.
 * Each user has their own set of job applications.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User's full name
    @Column(nullable = false, length = 100)
    private String name;

    // Email used for login - must be unique
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    // BCrypt hashed password - NEVER store plain text
    @Column(nullable = false)
    private String password;

    // Optional profile details
    @Column(length = 20)
    private String phone;

    @Column(length = 200)
    private String college;

    // Skills as comma-separated string (e.g. "Java, Spring Boot, React")
    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    // Automatically set when the record is created
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Automatically updated whenever the record changes
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * One user can have many job applications.
     * cascade = ALL: if user is deleted, their applications are also deleted.
     * orphanRemoval = true: removes applications not linked to any user.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobApplication> jobApplications = new ArrayList<>();
}
