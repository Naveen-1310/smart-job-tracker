package com.jobtracker.app.exception;

/**
 * Thrown when a requested resource (application, interview, user) is not found.
 * Results in HTTP 404 response.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " not found with id: " + id);
    }
}
