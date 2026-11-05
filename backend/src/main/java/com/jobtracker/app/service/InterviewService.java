package com.jobtracker.app.service;

import com.jobtracker.app.dto.request.InterviewRequest;
import com.jobtracker.app.dto.response.InterviewResponse;
import com.jobtracker.app.entity.Interview;
import com.jobtracker.app.entity.Interview.InterviewStatus;
import com.jobtracker.app.entity.JobApplication;
import com.jobtracker.app.entity.User;
import com.jobtracker.app.exception.ResourceNotFoundException;
import com.jobtracker.app.exception.UnauthorizedException;
import com.jobtracker.app.repository.InterviewRepository;
import com.jobtracker.app.repository.JobApplicationRepository;
import com.jobtracker.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for Interview management.
 */
@Service
public class InterviewService {

    @Autowired private InterviewRepository interviewRepository;
    @Autowired private JobApplicationRepository applicationRepository;
    @Autowired private UserRepository userRepository;

    // ─── Helper methods ───────────────────────────────────────────────

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private InterviewResponse toResponse(Interview interview) {
        return InterviewResponse.builder()
                .id(interview.getId())
                .jobApplicationId(interview.getJobApplication().getId())
                .companyName(interview.getJobApplication().getCompanyName())
                .jobRole(interview.getJobApplication().getJobRole())
                .interviewDate(interview.getInterviewDate())
                .round(interview.getRound())
                .interviewType(interview.getInterviewType())
                .meetingLink(interview.getMeetingLink())
                .preparationNotes(interview.getPreparationNotes())
                .status(interview.getStatus())
                .createdAt(interview.getCreatedAt())
                .build();
    }

    // ─── Create ───────────────────────────────────────────────────────

    /**
     * Schedule a new interview for a job application.
     * Verifies the job application belongs to the authenticated user.
     */
    public InterviewResponse scheduleInterview(InterviewRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        // Get the job application and verify ownership
        JobApplication application = applicationRepository
                .findByIdAndUserId(request.getJobApplicationId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job Application", request.getJobApplicationId()));

        Interview interview = Interview.builder()
                .jobApplication(application)
                .interviewDate(request.getInterviewDate())
                .round(request.getRound())
                .interviewType(request.getInterviewType())
                .meetingLink(request.getMeetingLink())
                .preparationNotes(request.getPreparationNotes())
                .status(request.getStatus() != null ? request.getStatus() : InterviewStatus.SCHEDULED)
                .build();

        return toResponse(interviewRepository.save(interview));
    }

    // ─── Read All ─────────────────────────────────────────────────────

    /**
     * Get all interviews for the authenticated user.
     */
    public List<InterviewResponse> getAllInterviews(String userEmail) {
        User user = getUserByEmail(userEmail);
        return interviewRepository.findAllByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Get upcoming scheduled interviews (for dashboard widget).
     */
    public List<InterviewResponse> getUpcomingInterviews(String userEmail) {
        User user = getUserByEmail(userEmail);
        return interviewRepository.findUpcomingByUserId(user.getId(), LocalDateTime.now())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ─── Update ───────────────────────────────────────────────────────

    /**
     * Update an interview (e.g. reschedule, add notes, mark completed).
     */
    public InterviewResponse updateInterview(
            Long id, InterviewRequest request, String userEmail) {

        User user = getUserByEmail(userEmail);

        Interview interview = interviewRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview", id));

        interview.setInterviewDate(request.getInterviewDate());
        interview.setRound(request.getRound());
        interview.setInterviewType(request.getInterviewType());
        interview.setMeetingLink(request.getMeetingLink());
        interview.setPreparationNotes(request.getPreparationNotes());
        if (request.getStatus() != null) {
            interview.setStatus(request.getStatus());
        }

        return toResponse(interviewRepository.save(interview));
    }

    // ─── Delete ───────────────────────────────────────────────────────

    public void deleteInterview(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);

        Interview interview = interviewRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview", id));

        interviewRepository.delete(interview);
    }
}
