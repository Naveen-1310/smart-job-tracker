package com.jobtracker.app.repository;

import com.jobtracker.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity.
 * Spring Data JPA auto-generates the implementation at runtime.
 * We get CRUD operations for free — just define custom queries we need.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by email.
     * Used during login to look up the user.
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if an email is already registered.
     * Used during registration to prevent duplicate accounts.
     */
    boolean existsByEmail(String email);
}
