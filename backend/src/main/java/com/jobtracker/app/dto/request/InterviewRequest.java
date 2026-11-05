package com.jobtracker.app.dto.request;

import com.jobtracker.app.entity.Interview.InterviewStatus;
import com.jobtracker.app.entity.Interview.InterviewType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for scheduling or updating an interview.
 */
@Data
public class InterviewRequest {

    // The job application this interview belongs to
    @NotNull(message = "Job application ID is required")
    private Long jobApplicationId;

    @NotNull(message = "Interview date is required")
    private LocalDateTime interviewDate;

    @NotBlank(message = "Round name is required")
    private String round;

    private InterviewType interviewType;

    private String meetingLink;

    private String preparationNotes;

    private InterviewStatus status;
}
