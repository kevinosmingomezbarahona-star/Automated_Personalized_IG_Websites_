/*
  # Add niche column to prospects table

  1. Changes
    - Add `niche` column to prospects table with default value 'fitness'
    - Niche values: 'fitness', 'legal', 'corporate', 'ecommerce', 'fashion'
  
  2. Important Notes
    - Default niche is 'fitness' for backward compatibility
    - Niche determines the theme, icons, text, and styling
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects' AND column_name = 'niche'
  ) THEN
    ALTER TABLE prospects ADD COLUMN niche text DEFAULT 'fitness';
  END IF;
END $$;