import { useEffect, useId } from "react";
import "./Dialog.css";

// zajednički okvir za sve dijaloge: naslov, tekst, sadržaj i dva gumba
export default function Dialog({
  naslov,
  tekst,
  uloga = "dialog",
  potvrda,
  potvrdaOnemogucena = false,
  opasno = false,
  onPotvrdi,
  onZatvori,
  children,
}) {
  const idNaslova = useId();

  // Escape zatvara dijalog
  useEffect(() => {
    const tipka = (e) => e.key === "Escape" && onZatvori();
    document.addEventListener("keydown", tipka);
    return () => document.removeEventListener("keydown", tipka);
  }, [onZatvori]);

  return (
    <div
      className="dlg-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onZatvori()}
    >
      <div className="dlg" role={uloga} aria-modal="true" aria-labelledby={idNaslova}>
        <form
          className="dlg-form"
          onSubmit={(e) => {
            e.preventDefault();
            onPotvrdi();
          }}
        >
          <h2 id={idNaslova} className="dlg-title">
            {naslov}
          </h2>
          {tekst && <p className="dlg-text">{tekst}</p>}
          {children}
          <div className="dlg-buttons">
            <button type="button" className="ws-btn dlg-btn" autoFocus={opasno} onClick={onZatvori}>
              Odustani
            </button>
            <button
              type="submit"
              className={"ws-btn dlg-btn " + (opasno ? "dlg-btn-d" : "dlg-btn-p")}
              disabled={potvrdaOnemogucena}
            >
              {potvrda}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
