import { useState } from "react";
import { porukaGreske } from "../../services/api";
import Dialog from "../Dialog";

const POSTOJI = "Taj naziv već postoji u ovoj mapi.";
const ZNAKOVI = "Naziv ne smije sadržavati znakove / i \\.";

// onSpremi(naziv) preimenuje stavku na poslužitelju; greška se prikaže u dijalogu
export default function PreimenujDijalog({ stavka, nadmapa, drugi, onSpremi, onZatvori }) {
  const [naziv, setNaziv] = useState(stavka.naziv);
  const [greska, setGreska] = useState("");
  const [salje, setSalje] = useState(false);
  const ime = naziv.trim();
  const vrsta = stavka.tip === "mapa" ? "Mapa" : "Datoteka";

  // iste provjere kao na poslužitelju, da korisnik odmah vidi što je krivo
  const poruka = drugi.includes(ime)
    ? POSTOJI
    : /[/\\]/.test(ime) || ime === "." || ime === ".."
      ? ZNAKOVI
      : greska;

  async function potvrdi() {
    if (poruka || salje) return;
    if (ime === stavka.naziv) return onZatvori(); // ništa se nije promijenilo
    setSalje(true);
    try {
      await onSpremi(ime);
      onZatvori();
    } catch (err) {
      setGreska(porukaGreske(err));
      setSalje(false);
    }
  }

  return (
    <Dialog
      naslov="Preimenuj"
      tekst={vrsta + " u mapi " + nadmapa + "."}
      potvrda="Spremi"
      potvrdaOnemogucena={!ime || salje}
      onPotvrdi={potvrdi}
      onZatvori={onZatvori}
    >
      <div className="dlg-field">
        <label htmlFor="novi-naziv" className="ws-lbl">
          Naziv
        </label>
        <input
          id="novi-naziv"
          className={"dlg-input" + (poruka ? " dlg-input-err" : "")}
          type="text"
          autoComplete="off"
          autoFocus
          value={naziv}
          aria-invalid={Boolean(poruka)}
          onChange={(e) => {
            setNaziv(e.target.value);
            setGreska("");
          }}
        />
        {poruka && (
          <p className="dlg-error" role="alert">
            {poruka}
          </p>
        )}
      </div>
    </Dialog>
  );
}
