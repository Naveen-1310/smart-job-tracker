USE job_tracker_db;

DELETE FROM interviews;
DELETE FROM job_applications;

INSERT INTO job_applications (user_id, company_name, job_role, job_description, job_location, job_type, application_date, salary_range, job_posting_url, status, notes) VALUES
(1, 'Google', 'Software Engineer (Backend)', 'Large-scale distributed systems in Java, microservices, gRPC, and cloud architectures.', 'Bangalore, India', 'FULL_TIME', '2026-11-01', '28 - 35 LPA', 'https://careers.google.com', 'APPLIED', 'Referred by college senior. High priority application.'),
(1, 'Amazon', 'SDE 1 (AWS Cloud)', 'Core Java, multi-threading, Spring Boot, DynamoDB, AWS services, and high availability systems.', 'Hyderabad, India', 'FULL_TIME', '2026-11-04', '22 - 28 LPA', 'https://amazon.jobs', 'ASSESSMENT', 'Online assessment link received on Hackerrank. Complete within 5 days.'),
(1, 'Microsoft', 'Software Engineer (Azure Cloud)', 'Building enterprise Azure backend microservices, SQL databases, and high availability APIs.', 'Hyderabad, India', 'FULL_TIME', '2026-11-06', '24 - 30 LPA', 'https://careers.microsoft.com', 'INTERVIEW_SCHEDULED', 'DSA round scheduled. Practice trees, graphs, and dynamic programming.'),
(1, 'Swiggy', 'Backend Developer - Platform', 'High throughput order dispatch platform, Spring Boot, MySQL, Redis, and Kafka messaging.', 'Bangalore, India', 'FULL_TIME', '2026-11-07', '16 - 22 LPA', 'https://careers.swiggy.com', 'INTERVIEW_SCHEDULED', 'Technical interview round 2 focused on Spring Boot architecture.'),
(1, 'TCS Digital', 'Systems Engineer (Java Full Stack)', 'Full stack development using React, Spring Boot, and MySQL for global enterprise clients.', 'Chennai, India', 'FULL_TIME', '2026-10-25', '7.5 - 9.0 LPA', 'https://www.tcs.com/careers', 'SELECTED', 'Offer letter received! Document verification in progress.'),
(1, 'Meta', 'Production Engineer', 'Systems engineering, Linux internals, network automation, Python, and C++.', 'Remote', 'FULL_TIME', '2026-10-20', '35 - 45 LPA', 'https://metacareers.com', 'REJECTED', 'Rejected after screening. Need to strengthen Linux kernel concepts.');

INSERT INTO interviews (job_application_id, interview_date, round, interview_type, meeting_link, preparation_notes, status)
SELECT id, '2026-11-14 11:00:00', 'Technical Round 1: DSA & Problem Solving', 'ONLINE', 'https://teams.microsoft.com/l/meetup-join/demo-meeting', 'Revise Binary Search, Sliding Window, Graph BFS/DFS, and Big-O complexity.', 'SCHEDULED'
FROM job_applications WHERE company_name = 'Microsoft' LIMIT 1;

INSERT INTO interviews (job_application_id, interview_date, round, interview_type, meeting_link, preparation_notes, status)
SELECT id, '2026-11-17 15:30:00', 'Technical Round 2: Spring Boot & Database Design', 'ONLINE', 'https://meet.google.com/demo-swiggy-interview', 'Prepare JdbcTemplate vs Hibernate tradeoffs, indexing, Redis caching, REST API status codes.', 'SCHEDULED'
FROM job_applications WHERE company_name = 'Swiggy' LIMIT 1;

INSERT INTO interviews (job_application_id, interview_date, round, interview_type, meeting_link, preparation_notes, status)
SELECT id, '2026-11-09 14:00:00', 'Managerial & HR Discussion', 'ONLINE', 'https://tcs.webex.com/meet/demo-hr-round', 'Discussed relocation, project details, and salary negotiation. Cleared!', 'COMPLETED'
FROM job_applications WHERE company_name = 'TCS Digital' LIMIT 1;
