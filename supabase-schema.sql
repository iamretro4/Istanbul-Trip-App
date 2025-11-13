-- Supabase Database Schema for Istanbul Trip Planner
-- Run this SQL in your Supabase SQL Editor

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  days JSONB DEFAULT '{}'::jsonb,
  budget JSONB DEFAULT '{"total": 0, "expenses": []}'::jsonb,
  notes TEXT DEFAULT '',
  hotel_location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - but allow all access since no auth
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we're not using auth)
CREATE POLICY "Allow all operations on trips" ON trips
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index on updated_at for faster queries
CREATE INDEX IF NOT EXISTS idx_trips_updated_at ON trips(updated_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on trip updates
CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for trips table
ALTER PUBLICATION supabase_realtime ADD TABLE trips;

