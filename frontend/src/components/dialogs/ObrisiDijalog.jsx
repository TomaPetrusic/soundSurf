import Dialog from "../Dialog";
import { brojDatoteka, datotekeUMapi } from "../../services/stablo";

// za sada samo izgled: "Obriši" zatvara dijalog, ništa se ne briše
export default function ObrisiDijalog({ stavka, onZatvori }) {
  const jeMapa = stavka.tip === "mapa";
  const unutra = jeMapa ? datotekeUMapi(stavka) : [];

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
      potvrda="Obriši"
      opasno
      onPotvrdi={onZatvori}
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
    </Dialog>
  );
}
