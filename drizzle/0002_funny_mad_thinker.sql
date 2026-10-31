ALTER TABLE `episodes` ADD `torrent_720p` text;--> statement-breakpoint
ALTER TABLE `episodes` ADD `torrent_1080p` text;--> statement-breakpoint
ALTER TABLE `episodes` DROP COLUMN `torrent_magnet`;--> statement-breakpoint
ALTER TABLE `movies` ADD `torrent_720p` text;--> statement-breakpoint
ALTER TABLE `movies` ADD `torrent_1080p` text;--> statement-breakpoint
ALTER TABLE `movies` DROP COLUMN `torrent_magnet`;