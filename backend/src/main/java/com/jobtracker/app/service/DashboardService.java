package com.jobtracker.app.service;

import com.jobtracker.app.dto.response.ApplicationResponse;
import com.jobtracker.app.dto.response.DashboardStatsResponse;
import com.jobtracker.app.dto.response.DashboardStatsResponse.MonthlyData;
import com.jobtracker.app.dto.response.InterviewResponse;
import com.jobtracker.app.entity.JobApplication.ApplicationStatus;
import com.jobtracker.app.entity.User;
import com.jobtracker.app.exception.ResourceNotFoundException;
import com.jobtracker.app.repository.InterviewRepository;
import com.jobtracker.app.repository.JobApplicationRepository;
import com.jobtracker.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Provides aggregated data for the dashboard page.
 */
@Service
public class DashboardService {

    @Autowired private UserRepository userRepository;
    @Autowired private JobApplicationRepository applicationRepository;
    @Autowired private InterviewRepository interviewRepository;
    @Autowired private ApplicationService applicationService;
    @Autowired private InterviewService interviewService;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    /**
     * Get summary statistics for the dashboard cards.
     * Also includes monthly data for the bar chart.
     */
    public DashboardStatsResponse getStats(String userEmail) {
        User user = getUserByEmail(userEmail);
        Long userId = user.getId();

        // Count each application status
        long total = applicationRepository.countByUserId(userId);
        long applied = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.APPLIED);
        long assessment = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.ASSESSMENT);
        long interviewScheduled = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.INTERVIEW_SCHEDULED);
        long selected = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.SELECTED);
        long rejected = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.REJECTED);

        // Build monthly data for bar chart
        List<Object[]> rawMonthly = applicationRepository.countByMonthForUser(userId);
        List<MonthlyData> monthlyData = new ArrayList<>();
        for (Object[] row : rawMonthly) {
            int monthNum = ((Number) row[0]).intValue();
            long count = ((Number) row[1]).longValue();
            String monthName = Month.of(monthNum).name().substring(0, 3); // "JAN", "FEB", etc.
            monthlyData.add(new MonthlyData(monthName, count));
        }

        return DashboardStatsResponse.builder()
                .totalApplications(total)
                .appliedCount(applied)
                .assessmentCount(assessment)
                .interviewScheduledCount(interviewScheduled)
                .selectedCount(selected)
                .rejectedCount(rejected)
                .monthlyData(monthlyData)
                .build();
    }

    /**
     * Get the 5 most recent applications (for the dashboard table).
     */
    public List<ApplicationResponse> getRecentApplications(String userEmail) {
        User user = getUserByEmail(userEmail);
        return applicationRepository.findTop5ByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(app -> ApplicationResponse.builder()
                        .id(app.getId())
                        .companyName(app.getCompanyName())
                        .jobRole(app.getJobRole())
                        .applicationDate(app.getApplicationDate())
                        .status(app.getStatus())
                        .jobLocation(app.getJobLocation())
                        .createdAt(app.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming interviews (for the dashboard reminder widget).
     */
    public List<InterviewResponse> getUpcomingInterviews(String userEmail) {
        return interviewService.getUpcomingInterviews(userEmail);
    }
}
