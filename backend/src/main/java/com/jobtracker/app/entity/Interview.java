package com.jobtracker.app.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Interview entity - maps to the 'interviews' table.
 * Represents a single interview round for a job application.
 */
@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The job application this interview belongs to.
     * Many interviews can belong to one job application.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_application_id", nullable = false)
    private JobApplication jobApplication;

    // Date and time of the interview
    @Column(name = "interview_date", nullable = false)
    private LocalDateTime interviewDate;

    // Round name, e.g. "Round 1 - Technical", "HR Round"
    @Column(nullable = false, length = 100)
    private String round;

    /**
     * Format of the interview.
     * Possible values: ONLINE, OFFLINE, PHONE
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "interview_type", length = 20)
    private InterviewType interviewType;

    // Google Meet / Zoom / Teams link
    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    // Notes to prepare for this interview
    @Column(name = "preparation_notes", columnDefinition = "TEXT")
    private String preparationNotes;

    /**
     * Current status of this interview.
     * Possible values: SCHEDULED, COMPLETED, CANCELLED
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ─── Enums (inner) ───────────────────────────────────────────────

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
