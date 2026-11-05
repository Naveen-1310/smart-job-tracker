package com.jobtracker.app.controller;

import com.jobtracker.app.dto.response.ApplicationResponse;
import com.jobtracker.app.dto.response.DashboardStatsResponse;
import com.jobtracker.app.dto.response.InterviewResponse;
import com.jobtracker.app.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * DashboardController — provides aggregated data for the dashboard.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * GET /api/dashboard/stats
     * Returns counts for each application status.
     * Used for dashboard summary cards and pie chart.
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                dashboardService.getStats(userDetails.getUsername()));
    }

    /**
     * GET /api/dashboard/recent-applications
     * Returns the 5 most recent applications.
     */
    @GetMapping("/recent-applications")
    public ResponseEntity<List<ApplicationResponse>> getRecentApplications(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                dashboardService.getRecentApplications(userDetails.getUsername()));
    }

    /**
     * GET /api/dashboard/upcoming-interviews
     * Returns upcoming scheduled interviews.
     */
    @GetMapping("/upcoming-interviews")
    public ResponseEntity<List<InterviewResponse>> getUpcomingInterviews(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                dashboardService.getUpcomingInterviews(userDetails.getUsername()));
    }
}
