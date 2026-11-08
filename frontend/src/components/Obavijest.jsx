import "./Obavijest.css";

// poruka o neuspjelom učitavanju (format ili veličina), s gumbom za zatvaranje
export default function Obavijest({ datoteka, tekst, onZatvori }) {
  return (
    <div className="notice" role="status">
      <span className="notice-square" aria-hidden="true" />
      <span className="notice-file">{datoteka}</span>
      <span className="notice-text">{tekst}</span>
      <div className="notice-space" />
      <button
        type="button"
        className="ws-btn ws-btn-ghost notice-close"
        aria-label="Zatvori poruku"
        onClick={onZatvori}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
