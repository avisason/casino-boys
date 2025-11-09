-- Migration script to add 'slots' game type to existing database
-- Run this in your Supabase SQL Editor if you already have a database set up

-- Add 'slots' to the existing game_type enum
ALTER TYPE game_type ADD VALUE IF NOT EXISTS 'slots';

-- Verify the change
SELECT enum_range(NULL::game_type);

