-- AgentVerse MySQL Database Schema Definition
-- Safe to execute multiple times (uses IF NOT EXISTS clauses)

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('STUDENT', 'TEACHER', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `year_of_study` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CLUBS TABLE
CREATE TABLE IF NOT EXISTS `clubs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `mentor_teacher_id` INT DEFAULT NULL,
  `president_user_id` INT DEFAULT NULL,
  `vp_user_id` INT DEFAULT NULL,
  `president_name` VARCHAR(255) DEFAULT NULL,
  `vp_name` VARCHAR(255) DEFAULT NULL,
  `president_phone` VARCHAR(50) DEFAULT NULL,
  `vp_phone` VARCHAR(50) DEFAULT NULL,
  `full_vision` TEXT DEFAULT NULL,
  `member_count` INT DEFAULT 0,
  `active_events_count` INT DEFAULT 0,
  `logo_url` VARCHAR(512) DEFAULT NULL,
  `banner_url` VARCHAR(512) DEFAULT NULL,
  `tags` JSON DEFAULT NULL,
  `social_links` JSON DEFAULT NULL,
  `contact_email` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_clubs_mentor_teacher` FOREIGN KEY (`mentor_teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_clubs_president_user` FOREIGN KEY (`president_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_clubs_vp_user` FOREIGN KEY (`vp_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TEACHER_PROFILES TABLE
CREATE TABLE IF NOT EXISTS `teacher_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `staff_id` VARCHAR(50) NOT NULL UNIQUE,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `club_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_teacher_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_profiles_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. STUDENT_PROFILES TABLE
CREATE TABLE IF NOT EXISTS `student_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `student_id` VARCHAR(50) NOT NULL UNIQUE,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `year_of_study` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_student_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CLUB_MEMBERS TABLE
CREATE TABLE IF NOT EXISTS `club_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `club_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `role` ENUM('MEMBER', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'TREASURER', 'LEAD', 'CORE') DEFAULT 'MEMBER',
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  UNIQUE KEY `unique_club_student` (`club_id`, `student_id`),
  CONSTRAINT `fk_club_members_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_club_members_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `club_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `student_id_number` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `year_of_study` INT DEFAULT NULL,
  `reason_to_join` TEXT DEFAULT NULL,
  `skills` TEXT DEFAULT NULL,
  `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` TIMESTAMP NULL DEFAULT NULL,
  `reviewed_by` INT DEFAULT NULL,
  INDEX `idx_applications_club` (`club_id`),
  INDEX `idx_applications_student` (`student_id`),
  INDEX `idx_applications_status` (`status`),
  CONSTRAINT `fk_applications_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_applications_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_applications_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipient_user_id` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `application_id` INT DEFAULT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notifications_recipient` (`recipient_user_id`),
  INDEX `idx_notifications_is_read` (`is_read`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`recipient_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notifications_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS `activities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `activity_type` VARCHAR(100) NOT NULL DEFAULT 'EVENT',
  `organizer` VARCHAR(255) DEFAULT NULL,
  `college` VARCHAR(255) DEFAULT NULL,
  `start_date` DATETIME DEFAULT NULL,
  `end_date` DATETIME DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `mode` ENUM('Online', 'Offline', 'Hybrid') DEFAULT 'Offline',
  `fee` VARCHAR(50) DEFAULT 'Free',
  `team_size` VARCHAR(100) DEFAULT NULL,
  `deadline` DATETIME DEFAULT NULL,
  `logo_url` VARCHAR(512) DEFAULT NULL,
  `banner_url` VARCHAR(512) DEFAULT NULL,
  `google_form_url` VARCHAR(512) DEFAULT NULL,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `tags` JSON DEFAULT NULL,
  `eligibility` JSON DEFAULT NULL,
  `contact_numbers` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_activities_type` (`activity_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. STUDENT_ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS `student_activities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `activity_id` INT NOT NULL,
  `participation_status` VARCHAR(50) DEFAULT 'REGISTERED',
  `achievement` VARCHAR(255) DEFAULT NULL,
  `certificate_url` VARCHAR(512) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_student_activity` (`student_id`, `activity_id`),
  CONSTRAINT `fk_student_activities_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_student_activities_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `organization` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `top_level_category` VARCHAR(50) DEFAULT 'Certifications',
  `issue_date` VARCHAR(50) DEFAULT NULL,
  `credential_id` VARCHAR(100) DEFAULT NULL,
  `achievement` VARCHAR(100) DEFAULT NULL,
  `skills` JSON DEFAULT NULL,
  `verification_status` ENUM('PENDING', 'HUMAN_VERIFIED', 'REJECTED') DEFAULT 'PENDING',
  `confidence_score` FLOAT DEFAULT 0.0,
  `flagged_fields` JSON DEFAULT NULL,
  `raw_ocr_text` LONGTEXT DEFAULT NULL,
  `file_path` VARCHAR(512) DEFAULT NULL,
  `certificate_url` VARCHAR(512) DEFAULT NULL,
  `extracted_data` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_certificates_student` (`student_id`),
  INDEX `idx_certificates_verification` (`verification_status`),
  CONSTRAINT `fk_certificates_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. CLUB_PERFORMANCE TABLE
CREATE TABLE IF NOT EXISTS `club_performance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `club_id` INT NOT NULL UNIQUE,
  `members_count` INT DEFAULT 0,
  `activities_count` INT DEFAULT 0,
  `participation_count` INT DEFAULT 0,
  `score` INT DEFAULT 0,
  `ranking` INT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_club_performance_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. ALUMNI TABLE
CREATE TABLE IF NOT EXISTS `alumni` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `club_id` INT NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(50) DEFAULT NULL,
  `graduation_year` INT NOT NULL DEFAULT 2023,
  `degree_branch` VARCHAR(150) NOT NULL DEFAULT 'B.Tech Computer Science & Engineering',
  `current_company` VARCHAR(255) NOT NULL,
  `current_designation` VARCHAR(255) NOT NULL,
  `location` VARCHAR(150) DEFAULT 'Bangalore, India',
  `former_club_role` VARCHAR(150) DEFAULT 'Former Executive Lead',
  `bio` TEXT DEFAULT NULL,
  `skills` JSON DEFAULT NULL,
  `mentorship_areas` JSON DEFAULT NULL,
  `linkedin_url` VARCHAR(512) DEFAULT NULL,
  `github_url` VARCHAR(512) DEFAULT NULL,
  `avatar_url` VARCHAR(512) DEFAULT NULL,
  `is_available_for_mentorship` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_alumni_club` (`club_id`),
  INDEX `idx_alumni_company` (`current_company`),
  CONSTRAINT `fk_alumni_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. ALUMNI_MESSAGES TABLE
CREATE TABLE IF NOT EXISTS `alumni_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `alumni_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `student_name` VARCHAR(255) NOT NULL,
  `student_email` VARCHAR(255) NOT NULL,
  `student_phone` VARCHAR(50) DEFAULT NULL,
  `request_type` VARCHAR(100) NOT NULL DEFAULT 'General Inquiry',
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('SENT', 'READ', 'REPLIED') DEFAULT 'SENT',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_alumni_messages_alumni` (`alumni_id`),
  INDEX `idx_alumni_messages_student` (`student_id`),
  CONSTRAINT `fk_alumni_messages_alumni` FOREIGN KEY (`alumni_id`) REFERENCES `alumni` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_alumni_messages_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

