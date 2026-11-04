import { supabase } from "../services/supabaseClient";
import "./Header.css";

// ime iz Google računa, a ako ga nema, email
function imeKorisnika(user) {
  const meta = user?.user_metadata ?? {};
  return meta.full_name || meta.name || user?.email || "";
}

export default function Header({ session }) {
  return (
    <header className="header">
      <span className="header-logo">SoundSurf</span>
      <div className="header-space" />
      <span className="header-user">{imeKorisnika(session.user)}</span>
      <button
        type="button"
        className="ws-btn"
        onClick={() => supabase.auth.signOut()}
      >
        Odjava
      </button>
    </header>
  );
}
