import Obavijest from "./Obavijest";
import "./DropZone.css";

// pojas za prvu prijavu, kad ništa nije odabrano; za sada samo izgled
export default function DropZone({ obavijest, onZatvoriObavijest, onUcitaj }) {
  return (
    <section className="drop" aria-label="Učitaj datoteku">
      <span className="drop-frame" />
      <span className="drop-line" />
      <svg
        className="drop-surfer"
        width="150"
        height="100"
        viewBox="0 0 120 80"
        aria-hidden="true"
      >
        <path d="M14 66Q60 72 106 66" stroke="#F58426" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="64" cy="16" r="6" fill="#F58426" />
        <path d="M58 15a6 6 0 0 1 12 0" stroke="#121314" strokeWidth="2.4" fill="none" />
        <path
          d="M62 23L56 42L48 62M56 42L70 50L74 62M60 29L44 26M61 29L80 34"
          stroke="#F58426"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="drop-text">
        <span className="drop-title">Povuci datoteku ovdje</span>
        <span className="drop-formats">WAV · MP3 · FLAC · do 50 MB</span>
      </div>
      <button type="button" className="ws-btn drop-btn" onClick={onUcitaj}>
        Učitaj datoteku
      </button>
      {obavijest && (
        <div className="drop-notice">
          <Obavijest
            datoteka={obavijest.datoteka}
            tekst={obavijest.tekst}
            onZatvori={onZatvoriObavijest}
          />
        </div>
      )}
    </section>
  );
}
