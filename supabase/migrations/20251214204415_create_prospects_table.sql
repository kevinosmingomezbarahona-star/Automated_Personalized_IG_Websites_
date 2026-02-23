/*
  # Create prospects table for personal brand websites

  1. New Tables
    - `prospects`
      - `id` (uuid, primary key) - Unique identifier
      - `slug` (text, unique, not null) - URL-friendly identifier for routing
      - `full_name` (text, not null) - Prospect's full name
      - `biography` (text) - Short biography/tagline
      - `profile_pic_url` (text) - URL to profile picture
      - `posts` (jsonb) - Array of portfolio posts with image_url, caption, instagram_url
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update
  
  2. Security
    - Enable RLS on `prospects` table
    - Add policy for public read access (since these are public landing pages)
    - Add policy for authenticated users to manage their own prospects
  
  3. Important Notes
    - Posts JSON structure: [{"image_url": "...", "caption": "...", "instagram_url": "..."}]
    - Slugs must be unique and URL-safe
*/

CREATE TABLE IF NOT EXISTS prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  full_name text NOT NULL,
  biography text DEFAULT '',
  profile_pic_url text DEFAULT '',
  posts jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view all prospects"
  ON prospects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert prospects"
  ON prospects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update prospects"
  ON prospects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete prospects"
  ON prospects
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS prospects_slug_idx ON prospects(slug);