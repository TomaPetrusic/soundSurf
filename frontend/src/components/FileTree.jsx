import { useEffect } from "react";
import "./FileTree.css";

// sve vidljive retke u jednu listu, s dubinom za uvlačenje
function poravnaj(stavke, otvoreno, dubina = 0, izlaz = []) {
  for (const s of stavke) {
    izlaz.push({ ...s, dubina });
    if (s.tip === "mapa" && otvoreno.has(s.id)) {
      poravnaj(s.djeca, otvoreno, dubina + 1, izlaz);
    }
  }
  return izlaz;
}

function Ikona({ velicina = 18, debljina = 1.5, children }) {
  return (
    <svg
      width={velicina}
      height={velicina}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={debljina}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// preuzimanje ima smisla samo za datoteke
const RADNJE_DATOTEKE = ["Preimenuj", "Premjesti", "Preuzmi"];
const RADNJE_MAPE = ["Preimenuj", "Premjesti"];

export default function FileTree({
  stavke,
  otvoreno,
  odabrano,
  izbornik,
  onOdaberi,
  onPrebaciMapu,
  onIzbornik,
  onRadnja,
}) {
  const reci = poravnaj(stavke, otvoreno);

  // izbornik se zatvara klikom bilo gdje drugdje
  useEffect(() => {
    if (!izbornik) return;
    const zatvori = () => onIzbornik(null);
    document.addEventListener("click", zatvori);
    return () => document.removeEventListener("click", zatvori);
  }, [izbornik, onIzbornik]);

  function kliknuto(redak) {
    if (redak.tip === "mapa") onPrebaciMapu(redak.id);
    else onOdaberi(redak.id);
  }

  function pokreni(e, radnja, redak) {
    e.stopPropagation();
    onIzbornik(null);
    onRadnja(radnja, redak);
  }

  return (
    <div className="tree" role="treegrid" aria-label="Datoteke">
      <div className="tree-grid tree-head ws-lbl">
        <span>Naziv</span>
        <span>Format</span>
        <span />
      </div>

      {reci.map((r) => {
        const jeMapa = r.tip === "mapa";
        const odabran = r.id === odabrano;
        return (
          <div
            key={r.id}
            role="row"
            aria-selected={odabran}
            tabIndex={0}
            className={"tree-grid tree-row" + (odabran ? " tree-row-selected" : "")}
            onClick={() => kliknuto(r)}
            onKeyDown={(e) => e.key === "Enter" && kliknuto(r)}
          >
            <span
              className="tree-name"
              style={{ paddingLeft: r.dubina * 24 + (jeMapa ? 0 : 24) }}
            >
              {jeMapa && (
                <Ikona velicina={16} debljina={1.8}>
                  <path d={otvoreno.has(r.id) ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"} />
                </Ikona>
              )}
              {jeMapa ? (
                <Ikona>
                  <path d="M3 7h6l2 2h10v10H3z" />
                </Ikona>
              ) : (
                <Ikona>
                  <path d="M6 3h8l4 4v14H6z" />
                  <path d="M14 3v4h4" />
                </Ikona>
              )}
              <span className="tree-name-text">{r.naziv}</span>
            </span>

            <span>{!jeMapa && <span className="tree-fmt">{r.format}</span>}</span>

            <button
              type="button"
              className="ws-btn ws-btn-ghost tree-more"
              aria-label="Radnje"
              onClick={(e) => {
                e.stopPropagation();
                onIzbornik(izbornik === r.id ? null : r.id);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="5" cy="12" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="19" cy="12" r="1.6" />
              </svg>
            </button>

            {izbornik === r.id && (
              <div className="tree-menu" role="menu" aria-label={"Radnje za " + r.naziv}>
                {(jeMapa ? RADNJE_MAPE : RADNJE_DATOTEKE).map((radnja) => (
                  <button
                    key={radnja}
                    type="button"
                    role="menuitem"
                    className="tree-menu-item"
                    onClick={(e) => pokreni(e, radnja, r)}
                  >
                    {radnja}
                  </button>
                ))}
                <div className="tree-menu-line" />
                <button
                  type="button"
                  role="menuitem"
                  className="tree-menu-item"
                  onClick={(e) => pokreni(e, "Obriši", r)}
                >
                  Obriši
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
