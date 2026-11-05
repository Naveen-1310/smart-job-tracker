package com.jobtracker.app.repository;

import com.jobtracker.app.entity.JobApplication;
import com.jobtracker.app.entity.JobApplication.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for JobApplication entity.
 * All queries are scoped to a specific user (userId) to ensure data isolation.
 */
@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    /**
     * Get all applications for a user, sorted newest first.
     */
    List<JobApplication> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Find a specific application belonging to a specific user.
     * Prevents one user from accessing another user's data.
     */
    Optional<JobApplication> findByIdAndUserId(Long id, Long userId);

    /**
     * Count applications by status for a user.
     * Used for dashboard stat cards.
     */
    long countByUserIdAndStatus(Long userId, ApplicationStatus status);

    /**
     * Count total applications for a user.
     */
    long countByUserId(Long userId);

    /**
     * Get the 5 most recent applications for a user.
     * Used for "Recent Applications" section on dashboard.
     */
    List<JobApplication> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Search applications by company name or job role (case-insensitive).
     * Used for the search feature.
     */
    @Query("SELECT j FROM JobApplication j WHERE j.user.id = :userId " +
           "AND (LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(j.jobRole) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<JobApplication> searchByKeyword(@Param("userId") Long userId, @Param("keyword") String keyword);

    /**
     * Filter applications by status for a user.
     */
    List<JobApplication> findByUserIdAndStatus(Long userId, ApplicationStatus status);

    /**
     * Count applications per month for the last 6 months (for bar chart).
     */
    @Query("SELECT FUNCTION('MONTH', j.applicationDate) as month, COUNT(j) as count " +
           "FROM JobApplication j WHERE j.user.id = :userId " +
           "GROUP BY FUNCTION('MONTH', j.applicationDate) " +
           "ORDER BY FUNCTION('MONTH', j.applicationDate)")
    List<Object[]> countByMonthForUser(@Param("userId") Long userId);
}
