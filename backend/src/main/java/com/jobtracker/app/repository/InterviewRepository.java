package com.jobtracker.app.repository;

import com.jobtracker.app.entity.Interview;
import com.jobtracker.app.entity.Interview.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Interview entity.
 */
@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    /**
     * Get all interviews for a specific job application.
     */
    List<Interview> findByJobApplicationIdOrderByInterviewDateAsc(Long jobApplicationId);

    /**
     * Get all interviews for a user (via their job applications).
     * Joins through jobApplication → user.
     */
    @Query("SELECT i FROM Interview i WHERE i.jobApplication.user.id = :userId " +
           "ORDER BY i.interviewDate ASC")
    List<Interview> findAllByUserId(@Param("userId") Long userId);

    /**
     * Get upcoming SCHEDULED interviews for a user (from now onward).
     * Used for the dashboard reminder widget.
     */
    @Query("SELECT i FROM Interview i WHERE i.jobApplication.user.id = :userId " +
           "AND i.status = 'SCHEDULED' " +
           "AND i.interviewDate >= :now " +
           "ORDER BY i.interviewDate ASC")
    List<Interview> findUpcomingByUserId(@Param("userId") Long userId,
                                         @Param("now") LocalDateTime now);

    /**
     * Find a specific interview, ensuring it belongs to the user.
     */
    @Query("SELECT i FROM Interview i WHERE i.id = :interviewId " +
           "AND i.jobApplication.user.id = :userId")
    Optional<Interview> findByIdAndUserId(@Param("interviewId") Long interviewId,
                                           @Param("userId") Long userId);
}
