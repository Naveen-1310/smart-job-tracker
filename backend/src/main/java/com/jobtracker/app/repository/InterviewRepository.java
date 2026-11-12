package com.jobtracker.app.repository;

import com.jobtracker.app.entity.Interview;
import com.jobtracker.app.entity.Interview.InterviewStatus;
import com.jobtracker.app.entity.Interview.InterviewType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * InterviewRepository — pure SQL with JdbcTemplate.
 */
@Repository
public class InterviewRepository {

    @Autowired
    private JdbcTemplate jdbc;

    // ─── RowMapper: converts SQL row → Interview object ──────────────

    private static class InterviewRowMapper implements RowMapper<Interview> {
        @Override
        public Interview mapRow(ResultSet rs, int rowNum) throws SQLException {
            return Interview.builder()
                    .id(rs.getLong("id"))
                    .jobApplicationId(rs.getLong("job_application_id"))
                    .interviewDate(rs.getTimestamp("interview_date") != null ? rs.getTimestamp("interview_date").toLocalDateTime() : null)
                    .round(rs.getString("round"))
                    .interviewType(rs.getString("interview_type") != null ? InterviewType.valueOf(rs.getString("interview_type")) : null)
                    .meetingLink(rs.getString("meeting_link"))
                    .preparationNotes(rs.getString("preparation_notes"))
                    .status(rs.getString("status") != null ? InterviewStatus.valueOf(rs.getString("status")) : null)
                    .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                    .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                    .build();
        }
    }

    // ─── Get all interviews for a user (via JOIN) ────────────────────

    public List<Interview> findAllByUserId(Long userId) {
        String sql = "SELECT i.* FROM interviews i " +
                     "JOIN job_applications j ON i.job_application_id = j.id " +
                     "WHERE j.user_id = ? ORDER BY i.interview_date ASC";
        return jdbc.query(sql, new InterviewRowMapper(), userId);
    }

    // ─── Get upcoming SCHEDULED interviews ───────────────────────────

    public List<Interview> findUpcomingByUserId(Long userId, LocalDateTime now) {
        String sql = "SELECT i.* FROM interviews i " +
                     "JOIN job_applications j ON i.job_application_id = j.id " +
                     "WHERE j.user_id = ? AND i.status = 'SCHEDULED' AND i.interview_date >= ? " +
                     "ORDER BY i.interview_date ASC";
        return jdbc.query(sql, new InterviewRowMapper(), userId, Timestamp.valueOf(now));
    }

    // ─── Find interview by ID, verified via user ownership ───────────

    public Optional<Interview> findByIdAndUserId(Long interviewId, Long userId) {
        String sql = "SELECT i.* FROM interviews i " +
                     "JOIN job_applications j ON i.job_application_id = j.id " +
                     "WHERE i.id = ? AND j.user_id = ?";
        return jdbc.query(sql, new InterviewRowMapper(), interviewId, userId)
                .stream().findFirst();
    }

    // ─── Get company name and role for an interview's parent app ─────

    public String getCompanyNameByInterviewId(Long jobApplicationId) {
        String sql = "SELECT company_name FROM job_applications WHERE id = ?";
        return jdbc.queryForObject(sql, String.class, jobApplicationId);
    }

    public String getJobRoleByApplicationId(Long jobApplicationId) {
        String sql = "SELECT job_role FROM job_applications WHERE id = ?";
        return jdbc.queryForObject(sql, String.class, jobApplicationId);
    }

    // ─── Insert a new interview ──────────────────────────────────────

    public Interview save(Interview interview) {
        if (interview.getId() == null) {
            return insert(interview);
        } else {
            return update(interview);
        }
    }

    private Interview insert(Interview i) {
        String sql = "INSERT INTO interviews " +
                     "(job_application_id, interview_date, round, interview_type, meeting_link, preparation_notes, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, i.getJobApplicationId());
            ps.setTimestamp(2, Timestamp.valueOf(i.getInterviewDate()));
            ps.setString(3, i.getRound());
            ps.setString(4, i.getInterviewType() != null ? i.getInterviewType().name() : null);
            ps.setString(5, i.getMeetingLink());
            ps.setString(6, i.getPreparationNotes());
            ps.setString(7, i.getStatus() != null ? i.getStatus().name() : "SCHEDULED");
            return ps;
        }, keyHolder);

        i.setId(keyHolder.getKey().longValue());
        return i;
    }

    private Interview update(Interview i) {
        String sql = "UPDATE interviews SET interview_date = ?, round = ?, interview_type = ?, " +
                     "meeting_link = ?, preparation_notes = ?, status = ? WHERE id = ?";

        jdbc.update(sql,
                Timestamp.valueOf(i.getInterviewDate()), i.getRound(),
                i.getInterviewType() != null ? i.getInterviewType().name() : null,
                i.getMeetingLink(), i.getPreparationNotes(),
                i.getStatus() != null ? i.getStatus().name() : null,
                i.getId());

        return i;
    }

    // ─── Delete interview ────────────────────────────────────────────

    public void deleteById(Long id) {
        jdbc.update("DELETE FROM interviews WHERE id = ?", id);
    }
}
