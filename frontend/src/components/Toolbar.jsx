import "./Toolbar.css";

// ikone iz dizajna: crtice debljine 1.5, boja prati tekst
function Ikona({ children }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// za sada samo "Nova mapa" otvara dijalog, ostali gumbi još ništa ne rade
export default function Toolbar({ onNovaMapa }) {
  return (
    <div className="toolbar">
      <button type="button" className="ws-btn" onClick={onNovaMapa}>
        <Ikona>
          <path d="M3 7h6l2 2h10v10H3z" />
          <path d="M12 12v5M9.5 14.5h5" />
        </Ikona>
        Nova mapa
      </button>
      <button type="button" className="ws-btn">
        <Ikona>
          <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M4 15v5h16v-5" />
        </Ikona>
        Učitaj datoteku
      </button>
      <button type="button" className="ws-btn">
        <Ikona>
          <path d="M7 18a4 4 0 0 1-.6-8 5.5 5.5 0 0 1 10.7-1.4A4 4 0 0 1 17 18" />
          <path d="M12 11v8M9.5 16.5L12 19l2.5-2.5" />
        </Ikona>
        Uvezi s Freesounda
      </button>

      <div className="toolbar-space" />

      <button type="button" className="ws-btn">
        Generiraj zvuk
      </button>
      <button type="button" className="ws-btn">
        Primijeni filtar
      </button>
    </div>
  );
}
