-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);

-- Surveys 
CREATE TABLE IF NOT EXISTS surveys (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  title TEXT NOT NULL,
  branding TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Questions
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  options TEXT DEFAULT '[]',
  sort_order INTEGER NOT NULL
);

-- Responses 
CREATE TABLE IF NOT EXISTS responses (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL,
  answers TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);