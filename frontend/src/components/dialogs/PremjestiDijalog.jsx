import { Fragment, useState } from "react";
import { porukaGreske } from "../../services/api";
import Dialog from "../Dialog";

const KORIJEN = "korijen";

// onPremjesti(mapaId) premješta stavku na poslužitelju (null = korijen);
// greška (npr. zauzet naziv u odredištu) se prikaže u dijalogu
export default function PremjestiDijalog({ stavke, stavka, trenutnaMapaId, onPremjesti, onZatvori }) {
  const [odabrano, setOdabrano] = useState(null);
  const [zatvoreno, setZatvoreno] = useState(new Set());
  const [greska, setGreska] = useState("");
  const [salje, setSalje] = useState(false);
  const trenutna = trenutnaMapaId ?? KORIJEN;

  async function potvrdi() {
    if (odabrano === null || salje) return;
    setSalje(true);
    try {
      await onPremjesti(odabrano === KORIJEN ? null : odabrano);
      onZatvori();
    } catch (err) {
      setGreska(porukaGreske(err));
      setSalje(false);
    }
  }

  function prebaci(id) {
    const novo = new Set(zatvoreno);
    if (novo.has(id)) novo.delete(id);
    else novo.add(id);
    setZatvoreno(novo);
  }

  function redak(id, naziv, dubina, imaPodmape) {
    const jeTrenutna = id === trenutna;
    const izabrana = id === odabrano;
    return (
      <button
        type="button"
        role="treeitem"
        className={"dlg-ti" + (izabrana ? " dlg-ti-sel" : "")}
        aria-selected={izabrana}
        aria-disabled={jeTrenutna || undefined}
        style={{ paddingLeft: 12 + dubina * 24 }}
        onClick={() => {
          if (jeTrenutna) return;
          setOdabrano(id);
          setGreska("");
        }}
      >
        {imaPodmape ? (
          <span
            className="dlg-ti-strelica"
            onClick={(e) => {
              e.stopPropagation();
              prebaci(id);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d={zatvoreno.has(id) ? "M9 6l6 6-6 6" : "M6 9l6 6 6-6"} />
            </svg>
          </span>
        ) : (
          <span className="dlg-ti-razmak" />
        )}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 7h6l2 2h10v10H3z" />
        </svg>
        <span>{naziv}</span>
        {jeTrenutna && (
          <>
            <span className="dlg-ti-prazno" />
            <span className="ws-lbl">Trenutno</span>
          </>
        )}
      </button>
    );
  }

  // samo mape, a mapa koju premještamo ne može biti odredište samoj sebi
  function mape(popis, dubina) {
    return popis
      .filter((m) => m.tip === "mapa" && m.id !== stavka.id)
      .map((m) => (
        <Fragment key={m.id}>
          {redak(m.id, m.naziv, dubina, m.djeca.some((d) => d.tip === "mapa"))}
          {!zatvoreno.has(m.id) && mape(m.djeca, dubina + 1)}
        </Fragment>
      ));
  }

  const vrsta = stavka.tip === "mapa" ? "mapu" : "datoteku";

  return (
    <Dialog
      naslov="Premjesti"
      tekst={"Odaberi mapu u koju želiš premjestiti " + vrsta + " " + stavka.naziv + "."}
      potvrda="Premjesti"
      potvrdaOnemogucena={odabrano === null || salje}
      onPotvrdi={potvrdi}
      onZatvori={onZatvori}
    >
      <div className="dlg-field">
        <span id="odrediste" className="ws-lbl">
          Odredište
        </span>
        <div role="tree" aria-labelledby="odrediste" className="dlg-list">
          {redak(KORIJEN, "Sve datoteke", 0, stavke.some((s) => s.tip === "mapa"))}
          {!zatvoreno.has(KORIJEN) && mape(stavke, 1)}
        </div>
        {greska && (
          <p className="dlg-error" role="alert">
            {greska}
          </p>
        )}
      </div>
    </Dialog>
  );
}
