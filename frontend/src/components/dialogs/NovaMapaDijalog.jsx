import { useState } from "react";
import Dialog from "../Dialog";

// za sada samo izgled: "Stvori" zatvara dijalog, mapa se ne stvara
export default function NovaMapaDijalog({ nadmapa, postojeci, onZatvori }) {
  const [naziv, setNaziv] = useState("");
  const ime = naziv.trim();
  const postoji = postojeci.includes(ime);

  return (
    <Dialog
      naslov="Nova mapa"
      tekst={"Mapa će se stvoriti u mapi " + nadmapa + "."}
      potvrda="Stvori"
      potvrdaOnemogucena={!ime}
      onPotvrdi={() => !postoji && onZatvori()}
      onZatvori={onZatvori}
    >
      <div className="dlg-field">
        <label htmlFor="naziv-mape" className="ws-lbl">
          Naziv mape
        </label>
        <input
          id="naziv-mape"
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
            Mapa s tim nazivom već postoji u ovoj mapi.
          </p>
        )}
      </div>
    </Dialog>
  );
}
