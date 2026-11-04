import { useState } from "react";
import Dialog from "../Dialog";

const FORMATI = [
  { oznaka: "WAV", opis: "Bez sažimanja" },
  { oznaka: "MP3", opis: "Manja datoteka" },
  { oznaka: "FLAC", opis: "Bez gubitka" },
];

// za sada samo izgled: "Preuzmi" zatvara dijalog, ništa se ne preuzima
export default function PreuzmiDijalog({ stavka, onZatvori }) {
  const [format, setFormat] = useState("WAV");

  return (
    <Dialog
      naslov="Preuzmi"
      tekst={"Odaberi format za datoteku " + stavka.naziv + "."}
      potvrda="Preuzmi"
      onPotvrdi={onZatvori}
      onZatvori={onZatvori}
    >
      <fieldset className="dlg-formati">
        <legend className="ws-lbl">Format</legend>
        <div className="dlg-formati-red">
          {FORMATI.map((f) => (
            <label
              key={f.oznaka}
              className={"dlg-format" + (format === f.oznaka ? " dlg-format-sel" : "")}
            >
              <input
                type="radio"
                name="format"
                value={f.oznaka}
                checked={format === f.oznaka}
                onChange={() => setFormat(f.oznaka)}
              />
              <span className="dlg-format-naziv">{f.oznaka}</span>
              <span className="dlg-format-opis">{f.opis}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </Dialog>
  );
}
