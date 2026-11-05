package com.jobtracker.app.controller;

import com.jobtracker.app.dto.request.InterviewRequest;
import com.jobtracker.app.dto.response.InterviewResponse;
import com.jobtracker.app.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * InterviewController — schedule and manage interview rounds.
 */
@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    /**
     * POST /api/interviews
     * Schedule a new interview for a job application.
     */
    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(
            @Valid @RequestBody InterviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        InterviewResponse response = interviewService.scheduleInterview(
                request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/interviews
     * Get all interviews for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getAllInterviews(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                interviewService.getAllInterviews(userDetails.getUsername()));
    }

    /**
     * PUT /api/interviews/{id}
     * Update interview details or status.
     */
    @PutMapping("/{id}")
    public ResponseEntity<InterviewResponse> updateInterview(
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        InterviewResponse response = interviewService.updateInterview(
                id, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/interviews/{id}
     * Delete an interview.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        interviewService.deleteInterview(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
