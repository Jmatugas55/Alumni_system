-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2025 at 08:26 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alumni_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `alumni`
--

CREATE TABLE `alumni` (
  `alumni_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `graduation_year` year(4) NOT NULL,
  `course` varchar(255) DEFAULT NULL,
  `current_job` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alumni`
--

INSERT INTO `alumni` (`alumni_id`, `user_id`, `name`, `graduation_year`, `course`, `current_job`, `company_id`, `created_at`) VALUES
(21, 36, '', '2026', 'bsit', 'web dev', 15, '2025-06-03 14:17:44'),
(22, 42, '', '2026', 'BIT', 'dasda', 18, '2025-06-03 16:21:47');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `company_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`company_id`, `name`, `location`, `industry`, `created_at`) VALUES
(12, 'phone company', 'bunawan', 'china', '2025-03-28 03:33:15'),
(13, 'asdsa', 'asdasd', 'asd', '2025-05-19 04:51:32'),
(15, 'DEPED', 'Philippines', 'Philippines', '2025-05-19 13:00:24'),
(16, 'jboy@gmail.com', 'jboy', '', '2025-05-31 10:13:41'),
(18, 'microsoft', 'buanawan', 'ph', '2025-06-01 02:01:58'),
(19, 'WEB DEVELOPMENT', 'bunawan', 'philippines', '2025-06-03 14:18:18');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `title`, `description`, `event_date`, `location`, `created_by`, `image_url`) VALUES
(3, 'batch 2015 alumni', 'attendance is a must\n', '2025-05-30 15:24:00', 'properidad Matugas Building', NULL, 'http://localhost:5000/uploads/1747639271058.webp'),
(4, 'shandylyn alumni', 'required', '2025-05-31 16:05:00', 'Lapaz', NULL, 'http://localhost:5000/uploads/1747641820480.webp'),
(5, 'bsit BATCH 2026', 'fafarasrf', '2025-05-24 22:08:00', 'Del Monte', NULL, 'http://localhost:5000/uploads/1748700317403.jfif'),
(6, 'Alumni for batch 2026', 'afabfiaa', '2025-06-20 00:13:00', 'Talacogon', NULL, 'http://localhost:5000/uploads/1748967256316.jpg'),
(7, 'almni for batch 2016', 'FDASFASF', '2025-06-21 00:21:00', 'properidad building of matugas', NULL, 'http://localhost:5000/uploads/1748967457892.jpg'),
(8, 'asdasda', 'awfafasf', '2025-06-28 22:34:00', 'cascsac', NULL, 'http://localhost:5000/uploads/1749004171176.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `job_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `posted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`job_id`, `company_id`, `title`, `description`, `location`, `salary`, `posted_at`, `user_id`) VALUES
(16, 15, 'web developer', 'asjfgiasbfaisfa', 'properidad', 100000.00, '2025-05-31 10:14:11', NULL),
(18, 13, 'asdsa', 'asdsa', 'asdasd', -412121.00, '2025-06-01 02:31:24', NULL),
(19, 12, 'dsdas', 'fdasd', 'affsa', 121212.00, '2025-06-01 02:41:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','alumni','company') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `graduation_year` int(11) DEFAULT NULL,
  `course` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `current_job` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password`, `role`, `created_at`, `graduation_year`, `course`, `name`, `current_job`, `photo`) VALUES
(36, 'shandylyn@gmail.com', '$2b$10$Tr5Aa1hUUldm1B7PFTHSWOO.UHPiqQu2ZJ.8pm.IGXWO9wL1XOa/q', 'alumni', '2025-05-31 13:10:59', 2026, 'BSIT', 'shandy', NULL, '1749002846936.jpg'),
(37, 'jboy@gmail.com', '$2b$10$xNcoX6oVW1/lWBwh8ZOuGOEdaFep5MH6FLEYxK/tt74ExO3CQgNuS', 'admin', '2025-05-31 14:00:49', 2026, 'BSIT', 'jboy', NULL, NULL),
(41, 'brian@gmail.com', '$2b$10$jbJhlIYCwT4NX53h4FX0sOraS.Waxrz8iqAwYxPLBkVRWEW8rOc3u', 'company', '2025-06-01 03:00:03', 2027, 'BAT', 'brian', 'asfnahgtag5', NULL),
(42, 'keith@gmail.com', '$2b$10$P/q2j0xdJdng5wmBg0RXj.L75mwmhGPCE9eSwMRURPYv9DqCZkUcu', 'alumni', '2025-06-03 14:51:30', 2026, 'BIT', 'keith', 'WEbs', '1748963242636.jpg'),
(43, 'Matugas@gmail.com', '$2b$10$mfrvCCHInGnLu82FHogrye/GCpM69zg709f.kUnOyGxXghcUk52RW', 'alumni', '2025-06-04 02:45:36', 2026, 'BSIT', 'Matugas', 'wala', '1749005660968.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumni`
--
ALTER TABLE `alumni`
  ADD PRIMARY KEY (`alumni_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`company_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumni`
--
ALTER TABLE `alumni`
  MODIFY `alumni_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alumni`
--
ALTER TABLE `alumni`
  ADD CONSTRAINT `fk_alumni_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `fk_jobs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
