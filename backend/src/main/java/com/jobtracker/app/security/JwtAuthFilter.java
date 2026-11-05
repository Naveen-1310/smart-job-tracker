package com.jobtracker.app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter.
 * This filter runs ONCE per HTTP request (before the controller).
 *
 * It does the following:
 * 1. Reads the "Authorization: Bearer <token>" header.
 * 2. Extracts and validates the JWT.
 * 3. Sets the authenticated user in Spring's SecurityContext.
 *
 * After this filter, Spring Security knows who the user is.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Get the Authorization header
        final String authHeader = request.getHeader("Authorization");

        // 2. If no JWT token → skip this filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract the token (remove "Bearer " prefix)
        final String jwt = authHeader.substring(7);
        final String userEmail;

        try {
            // 4. Extract the user's email from the token
            userEmail = jwtUtil.extractUsername(jwt);
        } catch (Exception e) {
            // Token is invalid or expired — reject silently, security handles the rest
            filterChain.doFilter(request, response);
            return;
        }

        // 5. If user email found and not yet authenticated
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 6. Load user from database
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            // 7. Validate the token against the user
            if (jwtUtil.isTokenValid(jwt, userDetails)) {

                // 8. Create authentication token and set it in SecurityContext
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 9. Mark the user as authenticated for this request
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 10. Continue to the next filter / controller
        filterChain.doFilter(request, response);
    }
}
