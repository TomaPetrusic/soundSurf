import { supabase } from "../services/supabaseClient";

export default function LoginButton() {
  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  return (
    <button onClick={handleLogin}>Prijava preko Googlea</button>
  );
}
