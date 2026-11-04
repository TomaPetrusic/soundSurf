import { useState } from "react";
import Dialog from "../Dialog";

// za sada samo izgled: "Spremi" zatvara dijalog, naziv se ne mijenja
export default function PreimenujDijalog({ stavka, nadmapa, drugi, onZatvori }) {
  const [naziv, setNaziv] = useState(stavka.naziv);
  const ime = naziv.trim();
  const postoji = drugi.includes(ime);
  const vrsta = stavka.tip === "mapa" ? "Mapa" : "Datoteka";

  return (
    <Dialog
      naslov="Preimenuj"
      tekst={vrsta + " u mapi " + nadmapa + "."}
      potvrda="Spremi"
      potvrdaOnemogucena={!ime}
      onPotvrdi={() => !postoji && onZatvori()}
      onZatvori={onZatvori}
    >
      <div className="dlg-field">
        <label htmlFor="novi-naziv" className="ws-lbl">
          Naziv
        </label>
        <input
          id="novi-naziv"
          className={"dlg-input" + (postoji ? " dlg-input-err" : "")}
          type="text"
          autoComplete="off"
          autoFocus
          value={naziv}
          aria-invalid={postoji}
          onChange={(e) => setNaziv(e.target.value)}
        />
        {postoji && (
          <p className="dlg-error" role="alert">
            Taj naziv već postoji u ovoj mapi.
          </p>
        )}
      </div>
    </Dialog>
  );
}
