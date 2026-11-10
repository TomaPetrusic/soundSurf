import { useEffect, useRef, useState } from "react";
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
import { ApiError, createFolder, getTree } from "../services/api";
import { OBAVIJESTI } from "../services/probniPodaci";
import { nadji, roditelj } from "../services/stablo";
import "./Workspace.css";

const KORIJEN_NAZIV = "Sve datoteke";
const FORMATI = ["WAV", "MP3", "FLAC"];
const NAJVECA_VELICINA = 50 * 1024 * 1024; // 50 MB

// stablo se dohvaća iz API-ja; ako se preda `podaci` (lokalni pregled), koriste se probni
export default function Workspace({ session, podaci = null, pocetnaObavijest = null }) {
  const [stavke, setStavke] = useState(podaci?.stavke ?? null);
  const [greska, setGreska] = useState("");
  const [odabrano, setOdabrano] = useState(podaci?.odabrano ?? null);
  const [otvoreno, setOtvoreno] = useState(new Set(podaci?.otvoreno ?? []));
  const [izbornik, setIzbornik] = useState(null);
  const [dijalog, setDijalog] = useState(null);
  const [obavijest, setObavijest] = useState(OBAVIJESTI[pocetnaObavijest] ?? null);
  // datoteka s računala koja se samo sluša, ne sprema se na poslužitelj
  const [lokalna, setLokalna] = useState(null);
  const ulaz = useRef(null);

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

  const izStabla = odabrano && stavke ? nadji(stavke, odabrano) : null;
  const datoteka = lokalna ?? izStabla;
  // poruka o veličini ide u plavu zonu, ali samo dok je ona prikazana
  const porukaUZoni = obavijest?.vrsta === "velicina" && !datoteka;

  // provjerava format i veličinu odabrane datoteke, pa je otvara u playeru
  function odabranaDatoteka(e) {
    const dat = e.target.files[0];
    e.target.value = ""; // da se ista datoteka može ponovno odabrati
    if (!dat) return;

    const dijelovi = dat.name.split(".");
    const format = dijelovi.length > 1 ? dijelovi.pop().toUpperCase() : "";
    if (!FORMATI.includes(format)) {
      setObavijest({ vrsta: "format", datoteka: dat.name, tekst: OBAVIJESTI.format.tekst });
      return;
    }
    if (dat.size > NAJVECA_VELICINA) {
      const mb = Math.round(dat.size / (1024 * 1024));
      setObavijest({
        vrsta: "velicina",
        datoteka: dat.name + " · " + mb + " MB",
        tekst: OBAVIJESTI.velicina.tekst,
      });
      return;
    }

    setObavijest(null);
    setOdabrano(null);
    setLokalna({ id: "lokalno", naziv: dijelovi.join("."), format, datoteka: dat });
  }

  function prebaciMapu(id) {
    const novo = new Set(otvoreno);
    if (novo.has(id)) novo.delete(id);
    else novo.add(id);
    setOtvoreno(novo);
  }

  const zatvori = () => setDijalog(null);

  // stvara mapu na poslužitelju, ponovno učita stablo i otvori mapu u kojoj je nastala
  async function stvoriMapu(naziv, roditeljId) {
    if (podaci) return; // lokalni pregled: nema poslužitelja
    await createFolder(session.access_token, naziv, roditeljId);
    setStavke(await getTree(session.access_token));
    if (roditeljId !== null) setOtvoreno(new Set(otvoreno).add(roditeljId));
  }

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
          onStvori={(naziv) => stvoriMapu(naziv, otac ? otac.id : null)}
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
            onUcitaj={() => ulaz.current.click()}
          />
        ))}
      <input
        ref={ulaz}
        type="file"
        accept=".wav,.mp3,.flac"
        hidden
        onChange={odabranaDatoteka}
      />
      <Toolbar
        onNovaMapa={() => setDijalog({ vrsta: "novaMapa" })}
        onUcitaj={() => ulaz.current.click()}
      />
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
          onOdaberi={(id) => {
            setLokalna(null);
            setOdabrano(id);
          }}
          onPrebaciMapu={prebaciMapu}
          onIzbornik={setIzbornik}
          onRadnja={(vrsta, stavka) => setDijalog({ vrsta, id: stavka.id })}
        />
      )}
      {dijalog && prikaziDijalog()}
    </div>
  );
}
