import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import LoginButton from "./components/LoginButton";
import Profile from "./components/Profile";

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  return (
    <div>
      <h1>ProAudio</h1>
      {session === undefined && <p>Učitavanje...</p>}
      {session === null && <LoginButton />}
      {session && <Profile session={session} />}
    </div>
  );
}
