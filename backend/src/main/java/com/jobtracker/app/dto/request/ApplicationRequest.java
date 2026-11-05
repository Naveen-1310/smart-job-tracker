package com.jobtracker.app.dto.request;

import com.jobtracker.app.entity.JobApplication.ApplicationStatus;
import com.jobtracker.app.entity.JobApplication.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for creating or updating a job application.
 * We use this instead of the entity directly to keep the API clean.
 */
@Data
public class ApplicationRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    private String jobDescription;

    private String jobLocation;

    private JobType jobType;

    @NotNull(message = "Application date is required")
    private LocalDate applicationDate;

    private String salaryRange;

    private String jobPostingUrl;

    private ApplicationStatus status;

    private String notes;
}
