package com.jobtracker.app.security;

import com.jobtracker.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

/**
 * Loads user details from the database during authentication.
 * Spring Security calls this automatically when validating credentials.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Find user by email (our username field).
     * Spring Security needs this to validate credentials during login.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.jobtracker.app.entity.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + email));

        // Build a Spring Security UserDetails object from our User entity
        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())  // BCrypt hashed password
                .roles("USER")                  // Default role
                .build();
    }
}
