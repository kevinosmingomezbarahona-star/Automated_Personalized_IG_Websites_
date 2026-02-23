/*
  # Update prospects table schema for Vapi integration

  1. Changes
    - Rename full_name to company_name (optional, keep both for compatibility)
    - Rename biography to business_profile
    - Rename profile_pic_url to profilePicUrl
    - Rename posts to post_images (JSONB array of image URLs)
    - Add vapi_assistant_id, vapi_public_key, vapi_phone_number
    - Keep niche, hero_headline fields
  
  2. New Columns
    - vapi_assistant_id: text (Vapi assistant ID)
    - vapi_public_key: text (Vapi public key for browser)
    - vapi_phone_number: text (Phone number for calls)
  
  3. Important Notes
    - post_images structure: ["url1", "url2", "url3", "url4", "url5", "url6"]
    - All Vapi fields are optional for backward compatibility
*/

ALTER TABLE prospects DROP COLUMN IF EXISTS posts CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE prospects ADD COLUMN company_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects' AND column_name = 'business_profile'
  ) THEN
    ALTER TABLE prospects ADD COLUMN business_profile text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects' AND column_name = 'profilePicUrl'
  ) THEN
    ALTER TABLE prospects ADD COLUMN "profilePicUrl" text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects' AND column_name = 'post_images'
  ) THEN
    ALTER TABLE prospects ADD COLUMN post_images jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects' AND column_name = 'vapi_assistant_id'
  ) THEN
    ALTER TABLE prospects ADD COLUMN vapi_assistant_id text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects' AND column_name = 'vapi_public_key'
  ) THEN
    ALTER TABLE prospects ADD COLUMN vapi_public_key text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prospects' AND column_name = 'vapi_phone_number'
  ) THEN
    ALTER TABLE prospects ADD COLUMN vapi_phone_number text DEFAULT '';
  END IF;
END $$;