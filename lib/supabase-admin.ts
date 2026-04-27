import { createClient } from "@supabase/supabase-js";

function getSupabaseAdminEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return null;
  }

  return { supabaseUrl, supabaseSecretKey };
}

export function getSupabaseAdmin() {
  const env = getSupabaseAdminEnv();
  if (!env) {
    throw new Error(
      "Missing Supabase backend environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)."
    );
  }

  return createClient(env.supabaseUrl, env.supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
