import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const movies = sqliteTable('movies', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  poster: text('poster'),
  backdrop: text('backdrop'),
  year: integer('year'),
  rating: real('rating'),
  duration: text('duration'),
  genres: text('genres'), 
  language: text('language').default('English'),
  torrent720p: text('torrent_720p'),   // 👈 අලුත් 720p කොලම් එක
  torrent1080p: text('torrent_1080p'), // 👈 අලුත් 1080p කොලම් එක
  createdAt: integer('created_at').notNull(),
});

export const series = sqliteTable('series', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  poster: text('poster'),
  backdrop: text('backdrop'),
  year: integer('year'),
  rating: real('rating'),
  genres: text('genres'),
  language: text('language').default('English'),
  createdAt: integer('created_at').notNull(),
});

export const seasons = sqliteTable('seasons', {
  id: text('id').primaryKey(),
  seriesId: text('series_id').notNull(),
  seasonNumber: integer('season_number').notNull(),
  torrentMagnet: text('torrent_magnet').notNull(), // දැනට මේක එහෙමම තියමු
  infoHash: text('info_hash'),
  torrentName: text('torrent_name'),
  totalFiles: integer('total_files'),
  createdAt: integer('created_at').notNull(),
});

export const episodes = sqliteTable('episodes', {
  id: text('id').primaryKey(),
  seriesId: text('series_id').notNull(),
  seasonId: text('season_id').notNull(),
  season: integer('season').notNull(),
  episode: integer('episode').notNull(),
  title: text('title'),
  torrent720p: text('torrent_720p'),   // 👈 අලුත් 720p කොලම් එක
  torrent1080p: text('torrent_1080p'), // 👈 අලුත් 1080p කොලම් එක
  fileIndex: integer('file_index').notNull(),
  fileName: text('file_name'),
  size: integer('size'),
  duration: text('duration'),
  createdAt: integer('created_at').notNull(),
});

export const subtitles = sqliteTable('subtitles', {
  id: text('id').primaryKey(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  language: text('language').notNull(),
  label: text('label').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const admins = sqliteTable('admins', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
});