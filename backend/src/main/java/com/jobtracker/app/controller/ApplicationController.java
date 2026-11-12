package com.jobtracker.app.controller;

import com.jobtracker.app.dto.request.ApplicationRequest;
import com.jobtracker.app.dto.response.ApplicationResponse;
import com.jobtracker.app.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ApplicationController — full CRUD for job applications.
 *
 * All endpoints require JWT authentication.
 * @AuthenticationPrincipal UserDetails is injected automatically by Spring Security.
 * userDetails.getUsername() returns the logged-in user's email.
 */
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    /**
     * POST /api/applications
     * Create a new job application.
     */
    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @Valid @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        ApplicationResponse response = applicationService.createApplication(
                request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/applications
     * Get all applications for the authenticated user.
     *
     * Optional query params:
     * - keyword: search by company name or job role
     * - status:  filter by application status
     */
    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAllApplications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {

        List<ApplicationResponse> applications = applicationService.getAllApplications(
                userDetails.getUsername(), keyword, status);
        return ResponseEntity.ok(applications);
    }

    /**
     * GET /api/applications/{id}
     * Get a specific application by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        ApplicationResponse response = applicationService.getApplicationById(
                id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/applications/{id}
     * Update an existing application.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        ApplicationResponse response = applicationService.updateApplication(
                id, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/applications/{id}/status
     * Quick status update (for Kanban board drag-and-drop / status switcher).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        ApplicationResponse response = applicationService.updateStatus(
                id, status, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/applications/{id}
     * Delete an application (cascades to interviews).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        applicationService.deleteApplication(id, userDetails.getUsername());
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
