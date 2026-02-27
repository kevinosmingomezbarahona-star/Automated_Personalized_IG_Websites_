import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Prospect {
  id: string;
  slug: string;
  full_name?: string;
  company_name?: string;
  biography?: string;
  business_profile: string;
  profile_pic_url?: string;
  profilePicUrl: string;
  posts?: { image_url: string; caption: string; instagram_url: string }[];
  post_images: string[];
  niche: 'fitness' | 'legal' | 'corporate' | 'ecommerce' | 'fashion';
  business_summary?: string;
  site_screenshot_url?: string;
  hero_headline?: string;
  vapi_assistant_id: string;
  vapi_public_key: string;
  vapi_phone_number: string;
  created_at: string;
  updated_at: string;
}
