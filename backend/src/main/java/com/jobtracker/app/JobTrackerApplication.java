package com.jobtracker.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Smart Job Application Tracker backend.
 *
 * @SpringBootApplication enables:
 * - Auto-configuration
 * - Component scanning
 * - Configuration properties
 */
@SpringBootApplication
public class JobTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobTrackerApplication.class, args);
    }
}
