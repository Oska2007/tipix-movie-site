CREATE TABLE `movies` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`poster` text,
	`backdrop` text,
	`year` integer,
	`rating` integer,
	`duration` text,
	`genres` text,
	`language` text DEFAULT 'English',
	`torrent_magnet` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `series` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`poster` text,
	`backdrop` text,
	`year` integer,
	`rating` integer,
	`genres` text,
	`language` text DEFAULT 'English',
	`created_at` integer NOT NULL
);
