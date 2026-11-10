-- Migration number: 0002 	 2026-07-28T14:37:00.215Z
--up migrations for user table 
ALTER TABLE users ADD COLUMN name TEXT;
