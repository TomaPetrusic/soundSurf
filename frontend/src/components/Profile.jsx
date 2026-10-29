import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { getMe, updateBio, ApiError } from "../services/api";

const BIO_MAX_LENGTH = 500;

export default function Profile({ session }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [bioDraft, setBioDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const data = await getMe(session.access_token);
        if (!active) return;
        setProfile(data);
        setBioDraft(data.bio);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Došlo je do neočekivane pogreške."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [session]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSavedMessage("");
    try {
      const data = await updateBio(session.access_token, bioDraft);
      setProfile(data);
      setBioDraft(data.bio);
      setSavedMessage("Spremljeno!");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Došlo je do neočekivane pogreške."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div>
      {profile && (
        <p>
          Bok, {profile.display_name || profile.email}! ({profile.email})
        </p>
      )}

      {loading && <p>Učitavanje profila...</p>}
      {error && <p role="alert">Greška: {error}</p>}

      {profile && (
        <div>
          <h2>O meni</h2>
          {!profile.bio && !bioDraft && (
            <p>Još nisi ništa napisao o sebi.</p>
          )}
          <textarea
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value.slice(0, BIO_MAX_LENGTH))}
            maxLength={BIO_MAX_LENGTH}
            rows={5}
            cols={50}
          />
          <p>
            {bioDraft.length} / {BIO_MAX_LENGTH} znakova
          </p>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Spremanje..." : "Spremi"}
          </button>
          {savedMessage && <span> {savedMessage}</span>}
        </div>
      )}

      <p>
        <button onClick={handleLogout}>Odjava</button>
      </p>
    </div>
  );
}
