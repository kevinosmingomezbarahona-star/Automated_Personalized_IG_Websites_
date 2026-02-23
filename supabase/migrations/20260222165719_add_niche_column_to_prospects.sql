/*
  # Add niche column to prospects table
  
  1. Changes
    - Add niche column with default value 'fitness'
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects' AND column_name = 'niche'
  ) THEN
    ALTER TABLE prospects ADD COLUMN niche text DEFAULT 'fitness';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects' AND column_name = 'hero_headline'
  ) THEN
    ALTER TABLE prospects ADD COLUMN hero_headline text;
  END IF;
END $$;