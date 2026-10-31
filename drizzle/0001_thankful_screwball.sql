CREATE TABLE `admins` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `episodes` (
	`id` text PRIMARY KEY NOT NULL,
	`series_id` text NOT NULL,
	`season_id` text NOT NULL,
	`season` integer NOT NULL,
	`episode` integer NOT NULL,
	`title` text,
	`torrent_magnet` text NOT NULL,
	`file_index` integer NOT NULL,
	`file_name` text,
	`size` integer,
	`duration` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `seasons` (
	`id` text PRIMARY KEY NOT NULL,
	`series_id` text NOT NULL,
	`season_number` integer NOT NULL,
	`torrent_magnet` text NOT NULL,
	`info_hash` text,
	`torrent_name` text,
	`total_files` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subtitles` (
	`id` text PRIMARY KEY NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`language` text NOT NULL,
	`label` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_movies` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`poster` text,
	`backdrop` text,
	`year` integer,
	`rating` real,
	`duration` text,
	`genres` text,
	`language` text DEFAULT 'English',
	`torrent_magnet` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_movies`("id", "title", "description", "poster", "backdrop", "year", "rating", "duration", "genres", "language", "torrent_magnet", "created_at") SELECT "id", "title", "description", "poster", "backdrop", "year", "rating", "duration", "genres", "language", "torrent_magnet", "created_at" FROM `movies`;--> statement-breakpoint
DROP TABLE `movies`;--> statement-breakpoint
ALTER TABLE `__new_movies` RENAME TO `movies`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_series` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`poster` text,
	`backdrop` text,
	`year` integer,
	`rating` real,
	`genres` text,
	`language` text DEFAULT 'English',
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_series`("id", "title", "description", "poster", "backdrop", "year", "rating", "genres", "language", "created_at") SELECT "id", "title", "description", "poster", "backdrop", "year", "rating", "genres", "language", "created_at" FROM `series`;--> statement-breakpoint
DROP TABLE `series`;--> statement-breakpoint
ALTER TABLE `__new_series` RENAME TO `series`;