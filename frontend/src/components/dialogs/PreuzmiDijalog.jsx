import { useState } from "react";
import { porukaGreske } from "../../services/api";
import Dialog from "../Dialog";

const FORMATI = [
  { oznaka: "WAV", opis: "Bez sažimanja" },
  { oznaka: "MP3", opis: "Manja datoteka" },
  { oznaka: "FLAC", opis: "Bez gubitka" },
];

// onPreuzmi(format) preuzima datoteku u odabranom formatu; greška se prikaže u dijalogu
export default function PreuzmiDijalog({ stavka, onPreuzmi, onZatvori }) {
  // ponuđen je izvorni format datoteke, jer za njega ne treba pretvorba
  const [format, setFormat] = useState(
    FORMATI.some((f) => f.oznaka === stavka.format) ? stavka.format : "WAV"
  );
  const [greska, setGreska] = useState("");
  const [salje, setSalje] = useState(false);

  async function potvrdi() {
    if (salje) return;
    setSalje(true);
    setGreska("");
    try {
      await onPreuzmi(format);
      onZatvori();
    } catch (err) {
      setGreska(porukaGreske(err));
      setSalje(false);
    }
  }

  return (
    <Dialog
      naslov="Preuzmi"
      tekst={"Odaberi format za datoteku " + stavka.naziv + "."}
      potvrda={salje ? "Preuzimanje..." : "Preuzmi"}
      potvrdaOnemogucena={salje}
      onPotvrdi={potvrdi}
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
                onChange={() => {
                  setFormat(f.oznaka);
                  setGreska("");
                }}
              />
              <span className="dlg-format-naziv">{f.oznaka}</span>
              <span className="dlg-format-opis">{f.opis}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {greska && (
        <p className="dlg-error" role="alert">
          {greska}
        </p>
      )}
    </Dialog>
  );
}
