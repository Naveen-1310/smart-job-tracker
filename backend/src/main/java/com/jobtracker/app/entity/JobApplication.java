package com.jobtracker.app.entity;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JobApplication POJO — plain Java object, NO Hibernate annotations.
 * Maps to the 'job_applications' table via JdbcTemplate queries.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    private Long id;
    private Long userId;           // FK to users.id
    private String companyName;
    private String jobRole;
    private String jobDescription;
    private String jobLocation;
    private JobType jobType;
    private LocalDate applicationDate;
    private String salaryRange;
    private String jobPostingUrl;
    private ApplicationStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ─── Enums ───────────────────────────────────────────────────────

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
