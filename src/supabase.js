import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseUrlValid =
  typeof supabaseUrl === "string" &&
  /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl) &&
  !/your_project_id/i.test(supabaseUrl);

const isAnonKeyValid =
  typeof supabaseAnonKey === "string" &&
  supabaseAnonKey.length > 20 &&
  !/your_anon_key_here/i.test(supabaseAnonKey);

export const supabaseConfigError =
  isSupabaseUrlValid && isAnonKeyValid
    ? ""
    : "Supabase is not configured correctly. Update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env with your real project values from Supabase Dashboard > Settings > API.";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️  Supabase credentials not found. Copy .env.example to .env and fill in your values."
  );
}

if (supabaseConfigError) {
  console.warn(`⚠️  ${supabaseConfigError}`);
}

export const supabase = createClient(
  isSupabaseUrlValid ? supabaseUrl : "https://placeholder.supabase.co",
  isAnonKeyValid ? supabaseAnonKey : "placeholder"
);
