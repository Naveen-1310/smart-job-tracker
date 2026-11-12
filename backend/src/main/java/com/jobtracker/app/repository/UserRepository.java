package com.jobtracker.app.repository;

import com.jobtracker.app.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

/**
 * UserRepository — uses JdbcTemplate to run raw SQL queries.
 * NO Hibernate, NO JPA — pure Spring Boot + SQL.
 */
@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbc;

    // ─── RowMapper: converts each SQL row → User object ──────────────

    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            return User.builder()
                    .id(rs.getLong("id"))
                    .name(rs.getString("name"))
                    .email(rs.getString("email"))
                    .password(rs.getString("password"))
                    .phone(rs.getString("phone"))
                    .college(rs.getString("college"))
                    .skills(rs.getString("skills"))
                    .linkedinUrl(rs.getString("linkedin_url"))
                    .githubUrl(rs.getString("github_url"))
                    .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                    .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                    .build();
        }
    }

    // ─── Find by email (used during login) ───────────────────────────

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        return jdbc.query(sql, new UserRowMapper(), email)
                .stream().findFirst();
    }

    // ─── Check if email exists (used during registration) ────────────

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    // ─── Insert a new user and return the generated ID ───────────────

    public User save(User user) {
        if (user.getId() == null) {
            return insert(user);
        } else {
            return update(user);
        }
    }

    private User insert(User user) {
        String sql = "INSERT INTO users (name, email, password, phone, college, skills, linkedin_url, github_url) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        // KeyHolder captures the auto-generated ID from MySQL
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getPhone());
            ps.setString(5, user.getCollege());
            ps.setString(6, user.getSkills());
            ps.setString(7, user.getLinkedinUrl());
            ps.setString(8, user.getGithubUrl());
            return ps;
        }, keyHolder);

        user.setId(keyHolder.getKey().longValue());
        return user;
    }

    private User update(User user) {
        String sql = "UPDATE users SET name = ?, phone = ?, college = ?, skills = ?, " +
                     "linkedin_url = ?, github_url = ?, password = ? WHERE id = ?";

        jdbc.update(sql,
                user.getName(), user.getPhone(), user.getCollege(), user.getSkills(),
                user.getLinkedinUrl(), user.getGithubUrl(), user.getPassword(), user.getId());

        return user;
    }

    // ─── Find by ID ──────────────────────────────────────────────────

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        return jdbc.query(sql, new UserRowMapper(), id)
                .stream().findFirst();
    }
}
