package com.jobtracker.app.exception;

/**
 * Thrown when a user tries to access another user's resource.
 * Results in HTTP 403 Forbidden response.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
