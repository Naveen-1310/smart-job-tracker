package com.jobtracker.app.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * JobApplication entity - maps to the 'job_applications' table.
 * Represents one job a user has applied for.
 */
@Entity
@Table(name = "job_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who created this application
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @Column(name = "job_role", nullable = false, length = 200)
    private String jobRole;

    @Column(name = "job_description", columnDefinition = "TEXT")
    private String jobDescription;

    @Column(name = "job_location", length = 200)
    private String jobLocation;

    /**
     * Job type stored as a string enum in the database.
     * Possible values: FULL_TIME, INTERNSHIP, REMOTE
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", length = 20)
    private JobType jobType;

    @Column(name = "application_date", nullable = false)
    private LocalDate applicationDate;

    @Column(name = "salary_range", length = 100)
    private String salaryRange;

    @Column(name = "job_posting_url", length = 500)
    private String jobPostingUrl;

    /**
     * Current status of the application.
     * Possible values: APPLIED, ASSESSMENT, INTERVIEW_SCHEDULED, SELECTED, REJECTED
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    // Personal notes about this application
    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * One job application can have many interview rounds.
     */
    @OneToMany(mappedBy = "jobApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Interview> interviews = new ArrayList<>();

    // ─── Enums (inner) ───────────────────────────────────────────────

    public enum JobType {
        FULL_TIME,
        INTERNSHIP,
        REMOTE
    }

    public enum ApplicationStatus {
        APPLIED,
        ASSESSMENT,
        INTERVIEW_SCHEDULED,
        SELECTED,
        REJECTED
    }
}
