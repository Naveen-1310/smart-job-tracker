package com.jobtracker.app.service;

import com.jobtracker.app.dto.request.ApplicationRequest;
import com.jobtracker.app.dto.response.ApplicationResponse;
import com.jobtracker.app.entity.JobApplication;
import com.jobtracker.app.entity.JobApplication.ApplicationStatus;
import com.jobtracker.app.entity.User;
import com.jobtracker.app.exception.ResourceNotFoundException;
import com.jobtracker.app.exception.UnauthorizedException;
import com.jobtracker.app.repository.JobApplicationRepository;
import com.jobtracker.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for Job Application CRUD operations.
 *
 * IMPORTANT: Every method that fetches or modifies data MUST
 * verify that the resource belongs to the authenticated user.
 */
@Service
public class ApplicationService {

    @Autowired private JobApplicationRepository applicationRepository;
    @Autowired private UserRepository userRepository;

    // ─── Helper: get User entity by email ────────────────────────────

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    // ─── Helper: Convert entity → DTO ────────────────────────────────

    private ApplicationResponse toResponse(JobApplication app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .companyName(app.getCompanyName())
                .jobRole(app.getJobRole())
                .jobDescription(app.getJobDescription())
                .jobLocation(app.getJobLocation())
                .jobType(app.getJobType())
                .applicationDate(app.getApplicationDate())
                .salaryRange(app.getSalaryRange())
                .jobPostingUrl(app.getJobPostingUrl())
                .status(app.getStatus())
                .notes(app.getNotes())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .interviewCount(app.getInterviews() != null ? app.getInterviews().size() : 0)
                .build();
    }

    // ─── Create ───────────────────────────────────────────────────────

    /**
     * Add a new job application for the authenticated user.
     */
    public ApplicationResponse createApplication(ApplicationRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        JobApplication application = JobApplication.builder()
                .user(user)
                .companyName(request.getCompanyName())
                .jobRole(request.getJobRole())
                .jobDescription(request.getJobDescription())
                .jobLocation(request.getJobLocation())
                .jobType(request.getJobType())
                .applicationDate(request.getApplicationDate())
                .salaryRange(request.getSalaryRange())
                .jobPostingUrl(request.getJobPostingUrl())
                .status(request.getStatus() != null ? request.getStatus() : ApplicationStatus.APPLIED)
                .notes(request.getNotes())
                .build();

        return toResponse(applicationRepository.save(application));
    }

    // ─── Read All ─────────────────────────────────────────────────────

    /**
     * Get all applications for the authenticated user.
     * Supports optional search keyword and status filter.
     */
    public List<ApplicationResponse> getAllApplications(
            String userEmail, String keyword, String status) {

        User user = getUserByEmail(userEmail);
        List<JobApplication> apps;

        if (keyword != null && !keyword.isBlank()) {
            // Search by company name or job role
            apps = applicationRepository.searchByKeyword(user.getId(), keyword);
        } else if (status != null && !status.isBlank()) {
            // Filter by status
            ApplicationStatus appStatus = ApplicationStatus.valueOf(status.toUpperCase());
            apps = applicationRepository.findByUserIdAndStatus(user.getId(), appStatus);
        } else {
            // Get all applications
            apps = applicationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        return apps.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ─── Read One ─────────────────────────────────────────────────────

    /**
     * Get a single application by ID.
     * Verifies the application belongs to the authenticated user.
     */
    public ApplicationResponse getApplicationById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);

        JobApplication app = applicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));

        return toResponse(app);
    }

    // ─── Update ───────────────────────────────────────────────────────

    /**
     * Update an existing application.
     * Only the owner can update their own application.
     */
    public ApplicationResponse updateApplication(
            Long id, ApplicationRequest request, String userEmail) {

        User user = getUserByEmail(userEmail);

        JobApplication app = applicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));

        // Update only the fields provided
        app.setCompanyName(request.getCompanyName());
        app.setJobRole(request.getJobRole());
        app.setJobDescription(request.getJobDescription());
        app.setJobLocation(request.getJobLocation());
        app.setJobType(request.getJobType());
        app.setApplicationDate(request.getApplicationDate());
        app.setSalaryRange(request.getSalaryRange());
        app.setJobPostingUrl(request.getJobPostingUrl());
        if (request.getStatus() != null) {
            app.setStatus(request.getStatus());
        }
        app.setNotes(request.getNotes());

        return toResponse(applicationRepository.save(app));
    }

    // ─── Delete ───────────────────────────────────────────────────────

    /**
     * Delete an application.
     * Cascade deletion will also remove all associated interviews.
     */
    public void deleteApplication(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);

        JobApplication app = applicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));

        applicationRepository.delete(app);
    }
}
