package com.jobtracker.app.dto.response;

import com.jobtracker.app.entity.JobApplication.ApplicationStatus;
import com.jobtracker.app.entity.JobApplication.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Returned when reading job application data.
 * We never return the entity directly; we transform it to a DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    private Long id;
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
    private int interviewCount; // How many interviews are scheduled
}
