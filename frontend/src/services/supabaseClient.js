import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Nedostaju VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY varijable okruženja."
  );
}

// Supabase na frontendu služi samo za prijavu (Auth) -- tablice se
// nikad ne čitaju ni ne pišu izravno odavde, samo preko Django API-ja.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
