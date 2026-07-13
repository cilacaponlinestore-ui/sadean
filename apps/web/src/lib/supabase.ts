import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iwklzxtakqedshykjckf.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_aKVOzKtZop6D66ghl9xWPg_eBwa7seW',
  { auth: { flowType: 'pkce', persistSession: true, detectSessionInUrl: true } },
);
