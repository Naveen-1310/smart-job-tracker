-- ===================================================================
-- Smart Job Application Tracker — Database Schema
-- Tables are created by Spring Boot on startup (NOT by Hibernate)
-- ===================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    college VARCHAR(200),
    skills TEXT,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS job_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    job_role VARCHAR(255) NOT NULL,
    job_description TEXT,
    job_location VARCHAR(500),
    job_type VARCHAR(50),
    application_date DATE NOT NULL,
    salary_range VARCHAR(255),
    job_posting_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'APPLIED',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. INTERVIEWS TABLE
CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_application_id BIGINT NOT NULL,
    interview_date DATETIME NOT NULL,
    round VARCHAR(100) NOT NULL,
    interview_type VARCHAR(50),
    meeting_link VARCHAR(500),
    preparation_notes TEXT,
    status VARCHAR(30) DEFAULT 'SCHEDULED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_application_id) REFERENCES job_applications(id) ON DELETE CASCADE
);
