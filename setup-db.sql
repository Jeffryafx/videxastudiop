-- ==================== DROP DATABASE ====================
DROP DATABASE IF EXISTS videxa_studio;

-- ==================== CREATE DATABASE ====================
CREATE DATABASE videxa_studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE videxa_studio;

-- ==================== USERS TABLE ====================
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64),
	`name` text,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`password` text,
	`loginMethod` varchar(64) DEFAULT 'email',
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`company` text,
	`resetToken` text,
	`resetTokenExpires` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);

-- ==================== INSERT ADMIN USER ====================
INSERT INTO users (email, password, name, role, loginMethod, lastSignedIn, createdAt, updatedAt) 
VALUES (
  'admin@videxa.com',
  '$2b$10$yrbMhNJv.U1QdGm7RpGeYuWFnlhDnICbvsJBVb/LoRWuSho01OtFS',
  'Jeffry',
  'admin',
  'email',
  NOW(),
  NOW(),
  NOW()
);

-- ==================== SERVICES TABLE ====================
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`basePrice` decimal(10,2) NOT NULL,
	`icon` varchar(50),
	`category` varchar(50) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);

-- ==================== QUOTES TABLE ====================
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`serviceId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`estimatedPrice` decimal(10,2),
	`finalPrice` decimal(10,2),
	`status` enum('pending','approved','rejected','completed') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` datetime,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);

-- ==================== PROJECTS TABLE ====================
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int NOT NULL,
	`clientId` int NOT NULL,
	`serviceId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('pending','in-progress','completed','on-hold','cancelled') NOT NULL DEFAULT 'pending',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`deliverables` text,
	`timeline` varchar(100),
	`clientFilesUrl` text,
	`deliveryFilesUrl` text,
	`startDate` datetime,
	`dueDate` datetime,
	`completedDate` datetime,
	`assignedTo` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);

-- ==================== PROJECT UPDATES TABLE ====================
CREATE TABLE `projectUpdates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`updateType` enum('revision-request','status-change','file-upload','comment','approval') NOT NULL,
	`message` text,
	`fileUrl` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectUpdates_id` PRIMARY KEY(`id`)
);

-- ==================== PAYMENTS TABLE ====================
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`quoteId` int NOT NULL,
	`clientId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`paymentMethod` enum('paypal','stripe','bank-transfer','cash') NOT NULL,
	`paymentStatus` enum('pending','processing','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`transactionId` varchar(255),
	`paypalOrderId` varchar(255),
	`invoiceNumber` varchar(50),
	`invoiceUrl` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`paidAt` datetime,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);

-- ==================== NOTIFICATIONS TABLE ====================
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('quote-created','quote-approved','quote-rejected','project-started','project-update','revision-requested','payment-received','project-completed','message') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`relatedProjectId` int,
	`relatedQuoteId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);

-- ==================== EMAIL LOGS TABLE ====================
CREATE TABLE `emailLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`emailType` varchar(50) NOT NULL,
	`status` enum('sent','failed','bounced') NOT NULL DEFAULT 'sent',
	`relatedProjectId` int,
	`relatedQuoteId` int,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailLogs_id` PRIMARY KEY(`id`)
);

-- ==================== BLOG ARTICLES TABLE ====================
CREATE TABLE `blogArticles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`category` varchar(50) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`thumbnailUrl` text,
	`readingTime` int,
	`authorId` int NOT NULL,
	`isPublished` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogArticles_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogArticles_slug_unique` UNIQUE(`slug`)
);

-- ==================== PORTFOLIO ITEMS TABLE ====================
CREATE TABLE `portfolioItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(50) NOT NULL,
	`duration` varchar(50),
	`thumbnailUrl` text,
	`videoUrl` text,
	`clientName` varchar(255),
	`isPublic` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolioItems_id` PRIMARY KEY(`id`)
);

-- ==================== VERIFICATION ====================
SELECT 'Database setup complete!' AS status;
SELECT id, email, role, name FROM users WHERE email = 'admin@videxa.com';
