package com.jobtracker.app.dto.response;

import com.jobtracker.app.entity.Interview.InterviewStatus;
import com.jobtracker.app.entity.Interview.InterviewType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Returned when reading interview data.
 * Includes basic info about the parent job application.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private Long id;
    private Long jobApplicationId;
    private String companyName;  // from parent job application
    private String jobRole;      // from parent job application
    private LocalDateTime interviewDate;
    private String round;
    private InterviewType interviewType;
    private String meetingLink;
    private String preparationNotes;
    private InterviewStatus status;
    private LocalDateTime createdAt;
}
