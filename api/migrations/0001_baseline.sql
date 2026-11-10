-- Migration number: 0001 	 2026-07-26T08:48:44.707Z
-- Users
--no use of foreign key in users table because we want to keep the user data even if the survey is deleted
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);

-- Surveys 
--use of foreign key in surveys table because we want to delete the survey if the user is deleted
--branding stored as json text object in the database, for example: {"logo": "https://example.com/logo.png", "color": "#ff0000"}
CREATE TABLE IF NOT EXISTS surveys (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  title TEXT NOT NULL,
  branding TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Questions
--use of foreign key in questions table because we want to delete the questions if the survey is deleted
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  options TEXT DEFAULT '[]',
  sort_order INTEGER NOT NULL,
  Foreign KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

-- Responses 
--use of foreign key in responses table because we want to delete the responses if the survey is deleted
CREATE TABLE IF NOT EXISTS responses (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL,
  answers TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  Foreign KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);