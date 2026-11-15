import { useState } from "react";
import Dialog from "../Dialog";
import { porukaGreske } from "../../services/api";
import { brojDatoteka, datotekeUMapi } from "../../services/stablo";

// onObrisi() briše stavku na poslužitelju; greška se prikaže u dijalogu
export default function ObrisiDijalog({ stavka, onObrisi, onZatvori }) {
  const jeMapa = stavka.tip === "mapa";
  const unutra = jeMapa ? datotekeUMapi(stavka) : [];
  const [greska, setGreska] = useState("");
  const [salje, setSalje] = useState(false);

  async function potvrdi() {
    if (salje) return;
    setSalje(true);
    try {
      await onObrisi();
      onZatvori();
    } catch (err) {
      setGreska(porukaGreske(err));
      setSalje(false);
    }
  }

  return (
    <Dialog
      uloga="alertdialog"
      naslov={(jeMapa ? "Obriši mapu " : "Obriši datoteku ") + stavka.naziv + "?"}
      tekst={
        <>
          {jeMapa
            ? "Brisanjem mape briše se i sve što je u njoj. "
            : "Datoteka će biti trajno obrisana. "}
          <strong>Ovo se ne može poništiti.</strong>
        </>
      }
      potvrda={salje ? "Brisanje..." : "Obriši"}
      potvrdaOnemogucena={salje}
      opasno
      onPotvrdi={potvrdi}
      onZatvori={onZatvori}
    >
      {jeMapa && unutra.length > 0 && (
        <div className="dlg-field">
          <span className="ws-lbl">U mapi je · {brojDatoteka(unutra.length)}</span>
          <ul className="dlg-list">
            {unutra.map((d) => (
              <li key={d.id} className="dlg-list-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M6 3h8l4 4v14H6z" />
                  <path d="M14 3v4h4" />
                </svg>
                <span>{d.naziv}</span>
                <span className="tree-fmt">{d.format}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {greska && (
        <p className="dlg-error" role="alert">
          {greska}
        </p>
      )}
    </Dialog>
  );
}
