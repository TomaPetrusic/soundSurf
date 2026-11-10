import { useMemo, useState } from "react";
import { visineStupica } from "../services/probniPodaci";
import "./PlayerPanel.css";

const BROJ_STUPICA = 220;
const OZNAKE = [0, 20, 40, 60, 80, 100, 120]; // sekunde, za okomite crte
const UKUPNO_S = 134; // probno trajanje (2:14)
const POLOZAJ = 0.381; // probni položaj reprodukcije (0:51)

// za sada samo izgled: ne svira pravi zvuk
export default function PlayerPanel({ datoteka }) {
  const [svira, setSvira] = useState(false);

  // isti zapis uvijek dobije isti probni valni oblik
  const visine = useMemo(() => {
    let sjeme = 7;
    for (const c of String(datoteka.id)) sjeme += c.charCodeAt(0);
    return visineStupica(BROJ_STUPICA, sjeme);
  }, [datoteka.id]);

  return (
    <section className="player" aria-label="Reprodukcija">
      <div className="player-top">
        <button
          type="button"
          className="player-play"
          aria-label={svira ? "Pauza" : "Pokreni"}
          onClick={() => setSvira(!svira)}
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
          <span className="player-time-now">0:51</span>
          <span className="player-time-total">/ 2:14</span>
        </div>
      </div>

      <div className="wave" aria-label="Valni oblik — povuci za premotavanje">
        {OZNAKE.map((s) => (
          <span
            key={s}
            className="wave-tick"
            style={{ left: (s / UKUPNO_S) * 100 + "%" }}
          />
        ))}
        <div className="wave-bars">
          {visine.map((h, i) => (
            <span
              key={i}
              className={"wave-bar" + (i / BROJ_STUPICA < POLOZAJ ? " wave-bar-played" : "")}
              style={{ height: h + "%" }}
            />
          ))}
        </div>
        <div className="wave-head" style={{ left: POLOZAJ * 100 + "%" }}>
          <span className="wave-head-top" />
          <span className="wave-head-bottom" />
        </div>
      </div>
    </section>
  );
}
