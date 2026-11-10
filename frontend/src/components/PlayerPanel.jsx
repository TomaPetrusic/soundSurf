import { useEffect, useMemo, useRef, useState } from "react";
import { visineStupica as probneVisine } from "../services/probniPodaci";
import { dekodiraj, oblikujVrijeme, visineStupica } from "../services/valniOblik";
import "./PlayerPanel.css";

const BROJ_STUPICA = 220;
const OZNAKE = 7; // okomite crte u pozadini
const PROBNO_TRAJANJE = 134; // za zapise bez stvarnog zvuka (probni podaci)
const PROBNI_POLOZAJ = 0.381;

// za datoteku s računala: stvarni valni oblik, trajanje i zvuk;
// vrijeme i marker koji prate reprodukciju dolaze u sljedećim koracima
export default function PlayerPanel({ datoteka }) {
  const [svira, setSvira] = useState(false);
  const [adresa, setAdresa] = useState(null); // adresa zvuka za element <audio>
  const audio = useRef(null);
  // rezultat dekodiranja lokalne datoteke: { visine, trajanje } ili greška
  const [zvuk, setZvuk] = useState(null);
  const [greska, setGreska] = useState(false);

  const lokalna = datoteka.datoteka; // File, samo za datoteke s računala

  // preglednik napravi privremenu adresu iz datoteke; ništa se ne šalje na mrežu
  useEffect(() => {
    setSvira(false);
    if (!lokalna) {
      setAdresa(null);
      return;
    }
    const nova = URL.createObjectURL(lokalna);
    setAdresa(nova);
    return () => URL.revokeObjectURL(nova);
  }, [lokalna]);

  function prebaci() {
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => setSvira(false));
    else a.pause();
  }

  useEffect(() => {
    setZvuk(null);
    setGreska(false);
    if (!lokalna) return;

    let aktivno = true;
    dekodiraj(lokalna)
      .then((buffer) => {
        if (!aktivno) return;
        setZvuk({
          visine: visineStupica(buffer, BROJ_STUPICA),
          trajanje: buffer.duration,
        });
      })
      .catch(() => aktivno && setGreska(true));
    return () => {
      aktivno = false;
    };
  }, [lokalna]);

  // probni valni oblik za zapise bez stvarnog zvuka
  const probne = useMemo(() => {
    let sjeme = 7;
    for (const c of String(datoteka.id)) sjeme += c.charCodeAt(0);
    return probneVisine(BROJ_STUPICA, sjeme);
  }, [datoteka.id]);

  const visine = lokalna ? zvuk?.visine : probne;
  const trajanje = lokalna ? zvuk?.trajanje : (datoteka.trajanje ?? PROBNO_TRAJANJE);
  const polozaj = lokalna ? 0 : PROBNI_POLOZAJ;

  return (
    <section className="player" aria-label="Reprodukcija">
      {adresa && (
        <audio
          ref={audio}
          src={adresa}
          onPlay={() => setSvira(true)}
          onPause={() => setSvira(false)}
          onEnded={() => setSvira(false)}
        />
      )}
      <div className="player-top">
        <button
          type="button"
          className="player-play"
          aria-label={svira ? "Pauza" : "Pokreni"}
          disabled={!adresa}
          onClick={prebaci}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {svira ? (
              <>
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </>
            ) : (
              <path d="M8 5v14l11-7z" />
            )}
          </svg>
        </button>
        <h1 className="player-title">{datoteka.naziv}</h1>
        <div className="player-space" />
        <div className="player-time">
          <span className="player-time-now">
            {trajanje ? oblikujVrijeme(polozaj * trajanje) : "–:––"}
          </span>
          <span className="player-time-total">
            / {trajanje ? oblikujVrijeme(trajanje) : "–:––"}
          </span>
        </div>
      </div>

      <div className="wave" aria-label="Valni oblik — povuci za premotavanje">
        {Array.from({ length: OZNAKE }, (_, i) => (
          <span
            key={i}
            className="wave-tick"
            style={{ left: (i / (OZNAKE - 1)) * 100 + "%" }}
          />
        ))}

        {visine ? (
          <div className="wave-bars">
            {visine.map((h, i) => (
              <span
                key={i}
                className={"wave-bar" + (i / BROJ_STUPICA < polozaj ? " wave-bar-played" : "")}
                style={{ height: h + "%" }}
              />
            ))}
          </div>
        ) : (
          <div className="wave-message">
            {greska ? "Zapis se ne može dekodirati" : "Dekodiranje zvuka..."}
          </div>
        )}

        <div className="wave-head" style={{ left: polozaj * 100 + "%" }}>
          <span className="wave-head-top" />
          <span className="wave-head-bottom" />
        </div>
      </div>
    </section>
  );
}
