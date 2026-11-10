import { useEffect, useState } from "react";
import DropZone from "../components/DropZone";
import FileTree from "../components/FileTree";
import Header from "../components/Header";
import Obavijest from "../components/Obavijest";
import PlayerPanel from "../components/PlayerPanel";
import Toolbar from "../components/Toolbar";
import NovaMapaDijalog from "../components/dialogs/NovaMapaDijalog";
import ObrisiDijalog from "../components/dialogs/ObrisiDijalog";
import PreimenujDijalog from "../components/dialogs/PreimenujDijalog";
import PremjestiDijalog from "../components/dialogs/PremjestiDijalog";
import PreuzmiDijalog from "../components/dialogs/PreuzmiDijalog";
import { ApiError, getTree } from "../services/api";
import { OBAVIJESTI } from "../services/probniPodaci";
import { nadji, roditelj } from "../services/stablo";
import "./Workspace.css";

const KORIJEN_NAZIV = "Sve datoteke";

// stablo se dohvaća iz API-ja; ako se preda `podaci` (lokalni pregled), koriste se probni
export default function Workspace({ session, podaci = null, pocetnaObavijest = null }) {
  const [stavke, setStavke] = useState(podaci?.stavke ?? null);
  const [greska, setGreska] = useState("");
  const [odabrano, setOdabrano] = useState(podaci?.odabrano ?? null);
  const [otvoreno, setOtvoreno] = useState(new Set(podaci?.otvoreno ?? []));
  const [izbornik, setIzbornik] = useState(null);
  const [dijalog, setDijalog] = useState(null);
  const [obavijest, setObavijest] = useState(OBAVIJESTI[pocetnaObavijest] ?? null);

  useEffect(() => {
    if (podaci) return;
    let aktivno = true;
    getTree(session.access_token)
      .then((stablo) => aktivno && setStavke(stablo))
      .catch(
        (err) =>
          aktivno &&
          setGreska(err instanceof ApiError ? err.message : "Došlo je do neočekivane pogreške.")
      );
    return () => {
      aktivno = false;
    };
  }, [session, podaci]);

  const datoteka = odabrano && stavke ? nadji(stavke, odabrano) : null;
  // poruka o veličini ide u plavu zonu, ali samo dok je ona prikazana
  const porukaUZoni = obavijest?.vrsta === "velicina" && !datoteka;

  function prebaciMapu(id) {
    const novo = new Set(otvoreno);
    if (novo.has(id)) novo.delete(id);
    else novo.add(id);
    setOtvoreno(novo);
  }

  const zatvori = () => setDijalog(null);

  // popis imena na istoj razini, za provjeru "naziv već postoji"
  function nazivi(otac) {
    return (otac ? otac.djeca : stavke).map((s) => s.naziv);
  }

  function prikaziDijalog() {
    if (dijalog.vrsta === "novaMapa") {
      // nova mapa ide u mapu odabrane datoteke, ili na vrh ako ništa nije odabrano
      const otac = odabrano ? roditelj(stavke, odabrano) : null;
      return (
        <NovaMapaDijalog
          nadmapa={otac ? otac.naziv : KORIJEN_NAZIV}
          postojeci={nazivi(otac)}
          onZatvori={zatvori}
        />
      );
    }

    const stavka = nadji(stavke, dijalog.id);
    const otac = roditelj(stavke, dijalog.id);

    if (dijalog.vrsta === "Preimenuj") {
      return (
        <PreimenujDijalog
          stavka={stavka}
          nadmapa={otac ? otac.naziv : KORIJEN_NAZIV}
          drugi={nazivi(otac).filter((n) => n !== stavka.naziv)}
          onZatvori={zatvori}
        />
      );
    }
    if (dijalog.vrsta === "Premjesti") {
      return (
        <PremjestiDijalog
          stavke={stavke}
          stavka={stavka}
          trenutnaMapaId={otac ? otac.id : null}
          onZatvori={zatvori}
        />
      );
    }
    if (dijalog.vrsta === "Preuzmi") {
      return <PreuzmiDijalog stavka={stavka} onZatvori={zatvori} />;
    }
    return <ObrisiDijalog stavka={stavka} onZatvori={zatvori} />;
  }

  return (
    <div className="ws">
      <Header session={session} />
      {stavke !== null &&
        (datoteka ? (
          <PlayerPanel datoteka={datoteka} />
        ) : (
          <DropZone
            obavijest={porukaUZoni ? obavijest : null}
            onZatvoriObavijest={() => setObavijest(null)}
          />
        ))}
      <Toolbar onNovaMapa={() => setDijalog({ vrsta: "novaMapa" })} />
      {obavijest && !porukaUZoni && (
        <div className="ws-notice">
          <Obavijest
            datoteka={obavijest.datoteka}
            tekst={obavijest.tekst}
            onZatvori={() => setObavijest(null)}
          />
        </div>
      )}
      {greska ? (
        <p className="ws-poruka" role="alert">
          {greska}
        </p>
      ) : stavke === null ? (
        <p className="ws-poruka">Učitavanje datoteka...</p>
      ) : (
        <FileTree
          stavke={stavke}
          otvoreno={otvoreno}
          odabrano={odabrano}
          izbornik={izbornik}
          onOdaberi={setOdabrano}
          onPrebaciMapu={prebaciMapu}
          onIzbornik={setIzbornik}
          onRadnja={(vrsta, stavka) => setDijalog({ vrsta, id: stavka.id })}
        />
      )}
      {dijalog && prikaziDijalog()}
    </div>
  );
}
