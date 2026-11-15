import { useState } from "react";
import { lowpass } from "../../services/audio";
import { dekodiraj } from "../../services/valniOblik";
import Dialog from "../Dialog";

const NAJMANJA = 20;
const NAJVECA = 20000;
const ZADANA = 1200; // ista granica kao na login stranici (FilterWave.jsx)

// dekodira datoteku, primjenjuje postojeći niskopropusni filtar (services/audio.js)
// i odmah reproducira rezultat preko Web Audio API-ja; ništa se ne sprema niti šalje
// na poslužitelj -- samo pregled zvuka
export default function FiltarDijalog({ datoteka, naziv, onZatvori }) {
  const [granica, setGranica] = useState(String(ZADANA));
  const [greska, setGreska] = useState("");
  const [obradjuje, setObradjuje] = useState(false);
  const broj = Number(granica);
  const nevazeca = !granica || Number.isNaN(broj) || broj < NAJMANJA || broj > NAJVECA;

  async function potvrdi() {
    if (nevazeca || obradjuje) return;
    setObradjuje(true);
    setGreska("");
    try {
      const ulaz = await dekodiraj(datoteka);
      const izlaz = await lowpass(ulaz, broj);
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const izvor = ctx.createBufferSource();
      izvor.buffer = izlaz;
      izvor.connect(ctx.destination);
      izvor.onended = () => ctx.close();
      izvor.start();
      onZatvori();
    } catch {
      setGreska("Zapis se ne može obraditi.");
      setObradjuje(false);
    }
  }

  return (
    <Dialog
      naslov="Primijeni filtar"
      tekst={`Niskopropusni filtar na "${naziv}". Rezultat se samo reproducira, ne sprema se.`}
      potvrda={obradjuje ? "Obrada..." : "Primijeni i reproduciraj"}
      potvrdaOnemogucena={nevazeca || obradjuje}
      onPotvrdi={potvrdi}
      onZatvori={onZatvori}
    >
      <div className="dlg-field">
        <label htmlFor="granica-filtra" className="ws-lbl">
          Granična frekvencija (Hz)
        </label>
        <input
          id="granica-filtra"
          className={"dlg-input" + (nevazeca ? " dlg-input-err" : "")}
          type="number"
          min={NAJMANJA}
          max={NAJVECA}
          autoComplete="off"
          autoFocus
          value={granica}
          aria-invalid={nevazeca}
          onChange={(e) => {
            setGranica(e.target.value);
            setGreska("");
          }}
        />
        <p className="ws-lbl">
          Između {NAJMANJA} i {NAJVECA} Hz.
        </p>
        {greska && (
          <p className="dlg-error" role="alert">
            {greska}
          </p>
        )}
      </div>
    </Dialog>
  );
}
