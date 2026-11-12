package com.jobtracker.app.repository;

import com.jobtracker.app.entity.JobApplication;
import com.jobtracker.app.entity.JobApplication.ApplicationStatus;
import com.jobtracker.app.entity.JobApplication.JobType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;
import java.util.Optional;

/**
 * JobApplicationRepository — pure SQL with JdbcTemplate.
 * Every query is written by hand — no Hibernate magic.
 */
@Repository
public class JobApplicationRepository {

    @Autowired
    private JdbcTemplate jdbc;

    // ─── RowMapper: converts SQL row → JobApplication object ─────────

    private static class ApplicationRowMapper implements RowMapper<JobApplication> {
        @Override
        public JobApplication mapRow(ResultSet rs, int rowNum) throws SQLException {
            return JobApplication.builder()
                    .id(rs.getLong("id"))
                    .userId(rs.getLong("user_id"))
                    .companyName(rs.getString("company_name"))
                    .jobRole(rs.getString("job_role"))
                    .jobDescription(rs.getString("job_description"))
                    .jobLocation(rs.getString("job_location"))
                    .jobType(rs.getString("job_type") != null ? JobType.valueOf(rs.getString("job_type")) : null)
                    .applicationDate(rs.getDate("application_date") != null ? rs.getDate("application_date").toLocalDate() : null)
                    .salaryRange(rs.getString("salary_range"))
                    .jobPostingUrl(rs.getString("job_posting_url"))
                    .status(ApplicationStatus.valueOf(rs.getString("status")))
                    .notes(rs.getString("notes"))
                    .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                    .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                    .build();
        }
    }

    // ─── Get all applications for a user (newest first) ──────────────

    public List<JobApplication> findByUserIdOrderByCreatedAtDesc(Long userId) {
        String sql = "SELECT * FROM job_applications WHERE user_id = ? ORDER BY created_at DESC";
        return jdbc.query(sql, new ApplicationRowMapper(), userId);
    }

    // ─── Find one application belonging to a specific user ───────────

    public Optional<JobApplication> findByIdAndUserId(Long id, Long userId) {
        String sql = "SELECT * FROM job_applications WHERE id = ? AND user_id = ?";
        return jdbc.query(sql, new ApplicationRowMapper(), id, userId)
                .stream().findFirst();
    }

    // ─── Count by status (for dashboard cards) ───────────────────────

    public long countByUserIdAndStatus(Long userId, ApplicationStatus status) {
        String sql = "SELECT COUNT(*) FROM job_applications WHERE user_id = ? AND status = ?";
        Long count = jdbc.queryForObject(sql, Long.class, userId, status.name());
        return count != null ? count : 0;
    }

    // ─── Count total applications ────────────────────────────────────

    public long countByUserId(Long userId) {
        String sql = "SELECT COUNT(*) FROM job_applications WHERE user_id = ?";
        Long count = jdbc.queryForObject(sql, Long.class, userId);
        return count != null ? count : 0;
    }

    // ─── Get 5 most recent (for dashboard) ───────────────────────────

    public List<JobApplication> findTop5ByUserIdOrderByCreatedAtDesc(Long userId) {
        String sql = "SELECT * FROM job_applications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5";
        return jdbc.query(sql, new ApplicationRowMapper(), userId);
    }

    // ─── Search by company name or job role (case-insensitive) ───────

    public List<JobApplication> searchByKeyword(Long userId, String keyword) {
        String sql = "SELECT * FROM job_applications WHERE user_id = ? " +
                     "AND (LOWER(company_name) LIKE LOWER(?) OR LOWER(job_role) LIKE LOWER(?)) " +
                     "ORDER BY created_at DESC";
        String pattern = "%" + keyword + "%";
        return jdbc.query(sql, new ApplicationRowMapper(), userId, pattern, pattern);
    }

    // ─── Filter by status ────────────────────────────────────────────

    public List<JobApplication> findByUserIdAndStatus(Long userId, ApplicationStatus status) {
        String sql = "SELECT * FROM job_applications WHERE user_id = ? AND status = ? ORDER BY created_at DESC";
        return jdbc.query(sql, new ApplicationRowMapper(), userId, status.name());
    }

    // ─── Monthly count for bar chart ─────────────────────────────────

    public List<Object[]> countByMonthForUser(Long userId) {
        String sql = "SELECT MONTH(application_date) AS month, COUNT(*) AS count " +
                     "FROM job_applications WHERE user_id = ? " +
                     "AND application_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) " +
                     "GROUP BY MONTH(application_date) " +
                     "ORDER BY MONTH(application_date)";
        return jdbc.query(sql, (rs, rowNum) ->
                new Object[]{ rs.getInt("month"), rs.getLong("count") }, userId);
    }

    // ─── Insert a new application ────────────────────────────────────

    public JobApplication save(JobApplication app) {
        if (app.getId() == null) {
            return insert(app);
        } else {
            return update(app);
        }
    }

    private JobApplication insert(JobApplication app) {
        String sql = "INSERT INTO job_applications " +
                     "(user_id, company_name, job_role, job_description, job_location, " +
                     "job_type, application_date, salary_range, job_posting_url, status, notes) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, app.getUserId());
            ps.setString(2, app.getCompanyName());
            ps.setString(3, app.getJobRole());
            ps.setString(4, app.getJobDescription());
            ps.setString(5, app.getJobLocation());
            ps.setString(6, app.getJobType() != null ? app.getJobType().name() : null);
            ps.setDate(7, Date.valueOf(app.getApplicationDate()));
            ps.setString(8, app.getSalaryRange());
            ps.setString(9, app.getJobPostingUrl());
            ps.setString(10, app.getStatus().name());
            ps.setString(11, app.getNotes());
            return ps;
        }, keyHolder);

        app.setId(keyHolder.getKey().longValue());
        return app;
    }

    private JobApplication update(JobApplication app) {
        String sql = "UPDATE job_applications SET company_name = ?, job_role = ?, job_description = ?, " +
                     "job_location = ?, job_type = ?, application_date = ?, salary_range = ?, " +
                     "job_posting_url = ?, status = ?, notes = ? WHERE id = ? AND user_id = ?";

        jdbc.update(sql,
                app.getCompanyName(), app.getJobRole(), app.getJobDescription(),
                app.getJobLocation(), app.getJobType() != null ? app.getJobType().name() : null,
                Date.valueOf(app.getApplicationDate()), app.getSalaryRange(),
                app.getJobPostingUrl(), app.getStatus().name(), app.getNotes(),
                app.getId(), app.getUserId());

        return app;
    }

    // ─── Update application status only ─────────────────────────────
    public void updateStatus(Long id, Long userId, ApplicationStatus status) {
        String sql = "UPDATE job_applications SET status = ? WHERE id = ? AND user_id = ?";
        jdbc.update(sql, status.name(), id, userId);
    }

    // ─── Delete application ──────────────────────────────────────────
    // CASCADE in schema.sql auto-deletes related interviews

    public void deleteByIdAndUserId(Long id, Long userId) {
        String sql = "DELETE FROM job_applications WHERE id = ? AND user_id = ?";
        jdbc.update(sql, id, userId);
    }

    // ─── Count interviews for an application ─────────────────────────

    public int countInterviewsByApplicationId(Long applicationId) {
        String sql = "SELECT COUNT(*) FROM interviews WHERE job_application_id = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, applicationId);
        return count != null ? count : 0;
    }
}
