package com.jobtracker.app.service;

import com.jobtracker.app.dto.response.ApplicationResponse;
import com.jobtracker.app.dto.response.DashboardStatsResponse;
import com.jobtracker.app.dto.response.DashboardStatsResponse.MonthlyData;
import com.jobtracker.app.dto.response.InterviewResponse;
import com.jobtracker.app.entity.Interview;
import com.jobtracker.app.entity.JobApplication;
import com.jobtracker.app.entity.JobApplication.ApplicationStatus;
import com.jobtracker.app.entity.User;
import com.jobtracker.app.exception.ResourceNotFoundException;
import com.jobtracker.app.repository.InterviewRepository;
import com.jobtracker.app.repository.JobApplicationRepository;
import com.jobtracker.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    @Autowired private InterviewService interviewService;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public DashboardStatsResponse getStats(String userEmail) {
        User user = getUserByEmail(userEmail);
        Long userId = user.getId();

        long total = applicationRepository.countByUserId(userId);
        long applied = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.APPLIED);
        long assessment = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.ASSESSMENT);
        long interviewScheduled = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.INTERVIEW_SCHEDULED);
        long selected = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.SELECTED);
        long rejected = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.REJECTED);

        // Monthly data for bar chart
        List<Object[]> rawMonthly = applicationRepository.countByMonthForUser(userId);
        List<MonthlyData> monthlyData = new ArrayList<>();
        for (Object[] row : rawMonthly) {
            int monthNum = ((Number) row[0]).intValue();
            long count = ((Number) row[1]).longValue();
            String monthName = Month.of(monthNum).name().substring(0, 3);
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

    public List<InterviewResponse> getUpcomingInterviews(String userEmail) {
        return interviewService.getUpcomingInterviews(userEmail);
    }

    /**
     * Loads 6 realistic applications and 3 interview rounds for live demo.
     */
    public void loadDemoData(String userEmail) {
        User user = getUserByEmail(userEmail);
        Long userId = user.getId();

        // 1. Google
        JobApplication app1 = applicationRepository.save(JobApplication.builder()
                .userId(userId)
                .companyName("Google")
                .jobRole("Software Engineer (Backend)")
                .jobDescription("Develop large-scale distributed systems in Java, microservices, gRPC, and cloud architectures.")
                .jobLocation("Bangalore, India")
                .jobType(JobApplication.JobType.FULL_TIME)
                .applicationDate(LocalDate.now().minusDays(15))
                .salaryRange("28 - 35 LPA")
                .jobPostingUrl("https://careers.google.com")
                .status(ApplicationStatus.APPLIED)
                .notes("Referred by college senior. High priority application.")
                .build());

        // 2. Amazon
        JobApplication app2 = applicationRepository.save(JobApplication.builder()
                .userId(userId)
                .companyName("Amazon")
                .jobRole("SDE 1 (AWS Team)")
                .jobDescription("Core Java, multi-threading, Spring Boot, DynamoDB, AWS services, algorithm design.")
                .jobLocation("Hyderabad, India")
                .jobType(JobApplication.JobType.FULL_TIME)
                .applicationDate(LocalDate.now().minusDays(10))
                .salaryRange("22 - 28 LPA")
                .jobPostingUrl("https://amazon.jobs")
                .status(ApplicationStatus.ASSESSMENT)
                .notes("Online assessment link received on Hackerrank. Complete within 5 days.")
                .build());

        // 3. Microsoft
        JobApplication app3 = applicationRepository.save(JobApplication.builder()
                .userId(userId)
                .companyName("Microsoft")
                .jobRole("Software Engineer (Azure Cloud)")
                .jobDescription("Building enterprise Azure backend microservices, SQL databases, high availability APIs.")
                .jobLocation("Hyderabad, India")
                .jobType(JobApplication.JobType.FULL_TIME)
                .applicationDate(LocalDate.now().minusDays(8))
                .salaryRange("24 - 30 LPA")
                .jobPostingUrl("https://careers.microsoft.com")
                .status(ApplicationStatus.INTERVIEW_SCHEDULED)
                .notes("DSA round scheduled. Practice trees, graphs, and dynamic programming.")
                .build());

        // 4. Swiggy
        JobApplication app4 = applicationRepository.save(JobApplication.builder()
                .userId(userId)
                .companyName("Swiggy")
                .jobRole("Backend Developer - Platform")
                .jobDescription("High throughput order dispatch platform, Spring Boot, MySQL, Redis, Kafka messaging.")
                .jobLocation("Bangalore, India")
                .jobType(JobApplication.JobType.FULL_TIME)
                .applicationDate(LocalDate.now().minusDays(6))
                .salaryRange("16 - 22 LPA")
                .jobPostingUrl("https://careers.swiggy.com")
                .status(ApplicationStatus.INTERVIEW_SCHEDULED)
                .notes("Technical interview round 2 focused on Spring Boot architecture.")
                .build());

        // 5. TCS Digital
        JobApplication app5 = applicationRepository.save(JobApplication.builder()
                .userId(userId)
                .companyName("TCS Digital")
                .jobRole("Systems Engineer (Java Full Stack)")
                .jobDescription("Full stack development using React, Spring Boot, MySQL for global banking clients.")
                .jobLocation("Chennai, India")
                .jobType(JobApplication.JobType.FULL_TIME)
                .applicationDate(LocalDate.now().minusDays(20))
                .salaryRange("7.5 - 9.0 LPA")
                .jobPostingUrl("https://www.tcs.com/careers")
                .status(ApplicationStatus.SELECTED)
                .notes("Offer letter received! Document verification in progress.")
                .build());

        // 6. Meta
        JobApplication app6 = applicationRepository.save(JobApplication.builder()
                .userId(userId)
                .companyName("Meta")
                .jobRole("Production Engineer")
                .jobDescription("Systems engineering, Linux internals, network automation, Python & C++.")
                .jobLocation("Remote")
                .jobType(JobApplication.JobType.FULL_TIME)
                .applicationDate(LocalDate.now().minusDays(25))
                .salaryRange("35 - 45 LPA")
                .jobPostingUrl("https://metacareers.com")
                .status(ApplicationStatus.REJECTED)
                .notes("Rejected after screening. Need to strengthen Linux kernel concepts.")
                .build());

        // Interviews
        interviewRepository.save(Interview.builder()
                .jobApplicationId(app3.getId())
                .round("Technical Round 1: DSA & Problem Solving")
                .interviewDate(LocalDateTime.now().plusDays(2).withHour(11).withMinute(0))
                .interviewType(Interview.InterviewType.ONLINE)
                .meetingLink("https://teams.microsoft.com/l/meetup-join/demo-meeting-link")
                .preparationNotes("Revise Binary Search, Sliding Window, Graph BFS/DFS, and Big-O complexity.")
                .status(Interview.InterviewStatus.SCHEDULED)
                .build());

        interviewRepository.save(Interview.builder()
                .jobApplicationId(app4.getId())
                .round("Technical Round 2: Spring Boot & Database Design")
                .interviewDate(LocalDateTime.now().plusDays(5).withHour(15).withMinute(30))
                .interviewType(Interview.InterviewType.ONLINE)
                .meetingLink("https://meet.google.com/demo-swiggy-interview")
                .preparationNotes("Prepare JdbcTemplate vs Hibernate tradeoffs, indexing, Redis caching, REST API status codes.")
                .status(Interview.InterviewStatus.SCHEDULED)
                .build());

        interviewRepository.save(Interview.builder()
                .jobApplicationId(app5.getId())
                .round("Managerial & HR Discussion")
                .interviewDate(LocalDateTime.now().minusDays(3).withHour(14).withMinute(0))
                .interviewType(Interview.InterviewType.ONLINE)
                .meetingLink("https://tcs.webex.com/meet/demo-hr-round")
                .preparationNotes("Discussed relocation, project details, and salary negotiation. Cleared!")
                .status(Interview.InterviewStatus.COMPLETED)
                .build());
    }
}
