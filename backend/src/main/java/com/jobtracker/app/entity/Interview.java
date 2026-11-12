package com.jobtracker.app.entity;

import lombok.*;
import java.time.LocalDateTime;

/**
 * Interview POJO — plain Java object, NO Hibernate annotations.
 * Maps to the 'interviews' table via JdbcTemplate queries.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    private Long id;
    private Long jobApplicationId;  // FK to job_applications.id
    private LocalDateTime interviewDate;
    private String round;
    private InterviewType interviewType;
    private String meetingLink;
    private String preparationNotes;
    private InterviewStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ─── Enums ───────────────────────────────────────────────────────

    public enum InterviewType {
        ONLINE,
        OFFLINE,
        PHONE
    }

    public enum InterviewStatus {
        SCHEDULED,
        COMPLETED,
        CANCELLED
    }
}
