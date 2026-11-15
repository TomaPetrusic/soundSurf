import { useState } from "react";
import { ApiError } from "../../services/api";
import Dialog from "../Dialog";

const POSTOJI = "Mapa s tim nazivom već postoji u ovoj mapi.";
const ZNAKOVI = "Naziv ne smije sadržavati znakove / i \\.";

// onStvori(naziv) stvara mapu; ako baci ApiError, poruka se prikaže u dijalogu
export default function NovaMapaDijalog({ nadmapa, postojeci, onStvori, onZatvori }) {
  const [naziv, setNaziv] = useState("");
  const [greska, setGreska] = useState("");
  const [salje, setSalje] = useState(false);
  const ime = naziv.trim();

  // iste provjere kao na poslužitelju, da korisnik odmah vidi što je krivo
  const poruka = postojeci.includes(ime)
    ? POSTOJI
    : /[/\\]/.test(ime) || ime === "." || ime === ".."
      ? ZNAKOVI
      : greska;

  async function potvrdi() {
    if (poruka || salje) return;
    setSalje(true);
    try {
      await onStvori(ime);
      onZatvori();
    } catch (err) {
      setGreska(err instanceof ApiError ? err.message : "Došlo je do neočekivane pogreške.");
      setSalje(false);
    }
  }

  return (
    <Dialog
      naslov="Nova mapa"
      tekst={"Mapa će se stvoriti u mapi " + nadmapa + "."}
      potvrda="Stvori"
      potvrdaOnemogucena={!ime || salje}
      onPotvrdi={potvrdi}
      onZatvori={onZatvori}
    >
      <div className="dlg-field">
        <label htmlFor="naziv-mape" className="ws-lbl">
          Naziv mape
        </label>
        <input
          id="naziv-mape"
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
