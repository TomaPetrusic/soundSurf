import { useEffect, useRef, useState } from "react";
import { lowpass, uWav } from "../../services/audio";
import { dekodiraj } from "../../services/valniOblik";
import { porukaGreske } from "../../services/api";
import Dialog from "../Dialog";

const NAJMANJA = 20;
const NAJVECA = 20000;
const ZADANA = 1200; // ista granica kao na login stranici (FilterWave.jsx)

const NACINI = [
  { oznaka: "nova", naziv: "Nova datoteka", opis: "Izvorna ostaje" },
  { oznaka: "prepisi", naziv: "Prepiši izvornu", opis: "Zamjenjuje sadržaj" },
];

// dekodira datoteku i primjenjuje niskopropusni filtar (services/audio.js);
// rezultat se može preslušati, a onSpremi(blob, "nova" | "prepisi") ga sprema
// na poslužitelj. Bez onSpremi (lokalni pregled bez poslužitelja) dijalog samo reproducira.
export default function FiltarDijalog({ datoteka, naziv, format, onSpremi, onZatvori }) {
  const [granica, setGranica] = useState(String(ZADANA));
  const [nacin, setNacin] = useState("nova");
  const [greska, setGreska] = useState("");
  const [radi, setRadi] = useState(null); // null | "preslusaj" | "spremi"
  const [svira, setSvira] = useState(false);
  const izvor = useRef(null); // AudioContext i izvor zvuka pregleda
  const obradjeno = useRef(null); // { granica, buffer }: ne filtriramo dvaput za istu granicu
  const broj = Number(granica);
  const nevazeca = !granica || Number.isNaN(broj) || broj < NAJMANJA || broj > NAJVECA;
  const moguceSpremiti = Boolean(onSpremi);

  function zaustavi() {
    const trenutni = izvor.current;
    izvor.current = null;
    if (trenutni) {
      trenutni.izvor.onended = null;
      try {
        trenutni.izvor.stop();
      } catch {
        // već je završio
      }
      trenutni.ctx.close();
    }
    setSvira(false);
  }

  // zatvaranje dijaloga prekida pregled
  useEffect(() => zaustavi, []);

  async function filtriraj() {
    if (obradjeno.current?.granica === broj) return obradjeno.current.buffer;
    const buffer = await lowpass(await dekodiraj(datoteka), broj);
    obradjeno.current = { granica: broj, buffer };
    return buffer;
  }

  async function preslusaj() {
    if (svira) return zaustavi();
    if (nevazeca || radi) return;
    setRadi("preslusaj");
    setGreska("");
    try {
      const buffer = await filtriraj();
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.onended = zaustavi;
      izvor.current = { ctx, izvor: src };
      src.start();
      setSvira(true);
    } catch {
      setGreska("Zapis se ne može obraditi.");
    } finally {
      setRadi(null);
    }
  }

  async function potvrdi() {
    if (nevazeca || radi) return;
    if (!moguceSpremiti) return preslusaj();
    zaustavi();
    setRadi("spremi");
    setGreska("");
    try {
      let buffer;
      try {
        buffer = await filtriraj();
      } catch {
        setGreska("Zapis se ne može obraditi.");
        return;
      }
      await onSpremi(uWav(buffer), nacin);
      onZatvori();
    } catch (err) {
      setGreska(porukaGreske(err));
    } finally {
      setRadi(null);
    }
  }

  return (
    <Dialog
      naslov="Primijeni filtar"
      tekst={`Niskopropusni filtar na "${naziv}".`}
      potvrda={
        radi === "spremi"
          ? "Spremanje..."
          : !moguceSpremiti
            ? "Primijeni i reproduciraj"
            : nacin === "nova"
              ? "Spremi kao novu"
              : "Prepiši izvornu"
      }
      potvrdaOnemogucena={nevazeca || Boolean(radi)}
      opasno={moguceSpremiti && nacin === "prepisi"}
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
            zaustavi();
          }}
        />
        <p className="ws-lbl">
          Između {NAJMANJA} i {NAJVECA} Hz.
        </p>
      </div>

      {moguceSpremiti && (
        <>
          <button
            type="button"
            className="ws-btn dlg-btn"
            disabled={nevazeca || radi === "spremi"}
            onClick={preslusaj}
          >
            {radi === "preslusaj" ? "Obrada..." : svira ? "Zaustavi" : "Preslušaj"}
          </button>

          <fieldset className="dlg-formati">
            <legend className="ws-lbl">Spremi rezultat</legend>
            <div className="dlg-formati-red dlg-formati-red-dva">
              {NACINI.map((n) => (
                <label
                  key={n.oznaka}
                  className={"dlg-format" + (nacin === n.oznaka ? " dlg-format-sel" : "")}
                >
                  <input
                    type="radio"
                    name="nacin"
                    value={n.oznaka}
                    checked={nacin === n.oznaka}
                    onChange={() => {
                      setNacin(n.oznaka);
                      setGreska("");
                    }}
                  />
                  <span className="dlg-format-naziv">{n.naziv}</span>
                  <span className="dlg-format-opis">{n.opis}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {nacin === "prepisi" && (
            <p className="dlg-text">
              Sadržaj datoteke <strong>{naziv}</strong> bit će zamijenjen obrađenim zapisom i to se
              ne može poništiti.
              {format !== "WAV" && ` Datoteka će se spremiti kao WAV (sada je ${format}).`}
            </p>
          )}
        </>
      )}

      {greska && (
        <p className="dlg-error" role="alert">
          {greska}
        </p>
      )}
    </Dialog>
  );
}
