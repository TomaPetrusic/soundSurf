import { useEffect, useRef, useState } from "react";
import DropZone from "../components/DropZone";
import FileTree from "../components/FileTree";
import Header from "../components/Header";
import Obavijest from "../components/Obavijest";
import PlayerPanel from "../components/PlayerPanel";
import Toolbar from "../components/Toolbar";
import FiltarDijalog from "../components/dialogs/FiltarDijalog";
import NovaMapaDijalog from "../components/dialogs/NovaMapaDijalog";
import ObrisiDijalog from "../components/dialogs/ObrisiDijalog";
import PreimenujDijalog from "../components/dialogs/PreimenujDijalog";
import PremjestiDijalog from "../components/dialogs/PremjestiDijalog";
import PreuzmiDijalog from "../components/dialogs/PreuzmiDijalog";
import {
  createFolder,
  deleteNode,
  downloadFile,
  getTree,
  porukaGreske,
  spremiNaRacunalo,
  updateNode,
  uploadFile,
} from "../services/api";
import { OBAVIJESTI } from "../services/probniPodaci";
import { datotekeUMapi, nadji, putDo, roditelj } from "../services/stablo";
import "./Workspace.css";

const KORIJEN_NAZIV = "Sve datoteke";
const FORMATI = ["WAV", "MP3", "FLAC"];
const NAJVECA_VELICINA = 50 * 1024 * 1024; // 50 MB
const ZAPAMCENIH_ZVUKOVA = 8; // koliko preuzetih datoteka čuvamo da se ne preuzimaju ponovno

// stablo se dohvaća iz API-ja; ako se preda `podaci` (lokalni pregled), koriste se probni
export default function Workspace({ session, podaci = null, pocetnaObavijest = null }) {
  const [stavke, setStavke] = useState(podaci?.stavke ?? null);
  const [greska, setGreska] = useState("");
  const [odabrano, setOdabrano] = useState(podaci?.odabrano ?? null);
  // mapa koja je trenutno odredište za upload i novu mapu (null = korijen)
  const [odabranaMapa, setOdabranaMapa] = useState(null);
  const [otvoreno, setOtvoreno] = useState(new Set(podaci?.otvoreno ?? []));
  const [izbornik, setIzbornik] = useState(null);
  const [dijalog, setDijalog] = useState(null);
  const [obavijest, setObavijest] = useState(OBAVIJESTI[pocetnaObavijest] ?? null);
  // datoteka s računala koja se samo sluša (samo lokalni pregled bez poslužitelja)
  const [lokalna, setLokalna] = useState(null);
  const [salje, setSalje] = useState(false); // upload u tijeku
  // zvuk odabrane datoteke s poslužitelja: { id, datoteka: File } ili { id, greska }
  const [izPosluzitelja, setIzPosluzitelja] = useState(null);
  const zvukovi = useRef(new Map()); // id -> File, nedavno preuzeti ili učitani
  const ulaz = useRef(null);

  useEffect(() => {
    if (podaci) return;
    let aktivno = true;
    getTree(session.access_token)
      .then((stablo) => aktivno && setStavke(stablo))
      .catch((err) => aktivno && setGreska(porukaGreske(err)));
    return () => {
      aktivno = false;
    };
  }, [session, podaci]);

  const izStabla = odabrano && stavke ? nadji(stavke, odabrano) : null;

  function zapamtiZvuk(id, file) {
    const mapa = zvukovi.current;
    mapa.delete(id);
    mapa.set(id, file);
    if (mapa.size > ZAPAMCENIH_ZVUKOVA) mapa.delete(mapa.keys().next().value); // najstariji
  }

  // datoteku iz stabla preuzmemo i PlayerPanelu damo kao File, kao i lokalnu
  useEffect(() => {
    setIzPosluzitelja(null);
    if (podaci || !izStabla || izStabla.tip !== "datoteka") return;
    const id = izStabla.id;
    const zapamcen = zvukovi.current.get(id);
    if (zapamcen) {
      setIzPosluzitelja({ id, datoteka: zapamcen });
      return;
    }
    let aktivno = true;
    downloadFile(session.access_token, id)
      .then((blob) => {
        if (!aktivno) return;
        const ime = `${izStabla.naziv}.${izStabla.format.toLowerCase()}`;
        const file = new File([blob], ime, { type: blob.type });
        zapamtiZvuk(id, file);
        setIzPosluzitelja({ id, datoteka: file });
      })
      .catch((err) => aktivno && setIzPosluzitelja({ id, greska: porukaGreske(err) }));
    return () => {
      aktivno = false;
    };
    // ponovno samo kad se odabere druga datoteka, ne pri svakom osvježavanju stabla
  }, [izStabla?.id, podaci]);

  // naziv i ostali podaci uvijek iz stabla (npr. nakon preimenovanja), zvuk s poslužitelja
  const zvuk = izPosluzitelja?.id === izStabla?.id ? izPosluzitelja : null;
  const datoteka =
    lokalna ?? (izStabla && zvuk ? { ...izStabla, datoteka: zvuk.datoteka } : izStabla);
  // za stvarne datoteke bez preuzetog zvuka player ne smije prikazati probni valni oblik
  const cekaZvuk = !podaci && !lokalna && Boolean(izStabla) && !zvuk?.datoteka;
  // poruka o veličini ide u plavu zonu, ali samo dok je ona prikazana
  const porukaUZoni = obavijest?.vrsta === "velicina" && !datoteka;

  // datoteka odabrana gumbom "Učitaj datoteku"
  function odabranaDatoteka(e) {
    const dat = e.target.files[0];
    e.target.value = ""; // da se ista datoteka može ponovno odabrati
    if (dat) ucitaj(dat);
  }

  // provjerava format i veličinu, sprema datoteku na poslužitelj u mapu odabrane
  // datoteke (ili na vrh) i otvara je u playeru
  async function ucitaj(dat) {
    if (salje) return;

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
    if (podaci) {
      // lokalni pregled: nema poslužitelja, datoteka se samo sluša
      setOdabrano(null);
      setLokalna({ id: "lokalno", naziv: dijelovi.join("."), format, datoteka: dat });
      return;
    }

    const otac = odabranaMapa ? nadji(stavke, odabranaMapa) : null;
    setSalje(true);
    try {
      const nova = await uploadFile(session.access_token, dat, otac ? otac.id : null);
      zapamtiZvuk(nova.id, dat); // već je na računalu, ne treba ga preuzimati
      await osvjeziStablo(nova.id);
      setLokalna(null);
      setOdabrano(nova.id);
    } catch (err) {
      setObavijest({ vrsta: "posluzitelj", datoteka: dat.name, tekst: porukaGreske(err) });
    } finally {
      setSalje(false);
    }
  }

  function prebaciMapu(id) {
    const novo = new Set(otvoreno);
    if (novo.has(id)) novo.delete(id);
    else novo.add(id);
    setOtvoreno(novo);
  }

  const zatvori = () => setDijalog(null);

  // ponovno učita stablo s poslužitelja; ako je zadan `prikazi`, otvori sve mape do te stavke
  async function osvjeziStablo(prikazi = null) {
    const stablo = await getTree(session.access_token);
    setStavke(stablo);
    // odabrana stavka je možda obrisana (ili je bila u obrisanoj mapi)
    if (odabrano !== null && !nadji(stablo, odabrano)) setOdabrano(null);
    // odredišna mapa je možda obrisana (upload i nova mapa onda idu u korijen)
    if (odabranaMapa !== null && !nadji(stablo, odabranaMapa)) setOdabranaMapa(null);
    const put = prikazi !== null ? putDo(stablo, prikazi) : null;
    if (put?.length) setOtvoreno((staro) => new Set([...staro, ...put]));
    return stablo;
  }

  // stvara mapu na poslužitelju, ponovno učita stablo i otvori mapu u kojoj je nastala
  async function stvoriMapu(naziv, roditeljId) {
    if (podaci) return; // lokalni pregled: nema poslužitelja
    const nova = await createFolder(session.access_token, naziv, roditeljId);
    await osvjeziStablo(nova.id);
  }

  // preuzima datoteku s poslužitelja (po potrebi pretvorenu) i sprema je na računalo;
  // ime slaže frontend jer preglednik ne vidi Content-Disposition iz drugog izvora
  async function preuzmi(stavka, format) {
    if (podaci) return; // lokalni pregled: nema poslužitelja
    const blob = await downloadFile(session.access_token, stavka.id, format);
    spremiNaRacunalo(blob, `${stavka.naziv}.${format.toLowerCase()}`);
  }

  // promjene na poslužitelju; poruke grešaka (zauzet naziv, mapa u vlastitu
  // podmapu...) dolaze u err.message i prikazuje ih dijalog
  async function preimenuj(stavka, naziv) {
    if (podaci) return;
    await updateNode(session.access_token, stavka.id, { naziv });
    await osvjeziStablo();
  }

  async function premjesti(stavka, ciljnaMapaId) {
    if (podaci) return;
    await updateNode(session.access_token, stavka.id, { roditelj: ciljnaMapaId });
    await osvjeziStablo(stavka.id); // otvori odredište da se vidi gdje je stavka
  }

  async function obrisi(stavka) {
    if (podaci) return;
    await deleteNode(session.access_token, stavka.id);
    const obrisane = stavka.tip === "mapa" ? datotekeUMapi(stavka) : [stavka];
    for (const d of obrisane) zvukovi.current.delete(d.id);
    await osvjeziStablo();
  }

  // popis imena na istoj razini, za provjeru "naziv već postoji"
  function nazivi(otac) {
    return (otac ? otac.djeca : stavke).map((s) => s.naziv);
  }

  function prikaziDijalog() {
    if (dijalog.vrsta === "filtar") {
      // samo pregled zvuka: ne ovisi o stavki u stablu, pa se zatvaranjem
      // dijaloga reprodukcija ne prekida
      return (
        <FiltarDijalog datoteka={dijalog.datoteka} naziv={dijalog.naziv} onZatvori={zatvori} />
      );
    }
    if (dijalog.vrsta === "novaMapa") {
      // iz izbornika mape ide u tu mapu (dijalog.id); iz alatne trake u odabranu mapu
      const ciljId = "id" in dijalog ? dijalog.id : odabranaMapa;
      const otac = ciljId ? nadji(stavke, ciljId) : null;
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
    // nakon brisanja stavke više nema u stablu, a dijalog se zatvara tek poslije
    if (!stavka) return null;
    const otac = roditelj(stavke, dijalog.id);

    if (dijalog.vrsta === "Preimenuj") {
      return (
        <PreimenujDijalog
          stavka={stavka}
          nadmapa={otac ? otac.naziv : KORIJEN_NAZIV}
          drugi={nazivi(otac).filter((n) => n !== stavka.naziv)}
          onSpremi={(naziv) => preimenuj(stavka, naziv)}
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
          onPremjesti={(mapaId) => premjesti(stavka, mapaId)}
          onZatvori={zatvori}
        />
      );
    }
    if (dijalog.vrsta === "Preuzmi") {
      return (
        <PreuzmiDijalog
          stavka={stavka}
          onPreuzmi={(format) => preuzmi(stavka, format)}
          onZatvori={zatvori}
        />
      );
    }
    return <ObrisiDijalog stavka={stavka} onObrisi={() => obrisi(stavka)} onZatvori={zatvori} />;
  }

  return (
    <div className="ws">
      <Header session={session} />
      {stavke !== null &&
        (datoteka ? (
          <PlayerPanel
            datoteka={datoteka}
            ucitava={cekaZvuk && !zvuk?.greska}
            greskaUcitavanja={cekaZvuk ? zvuk?.greska : null}
          />
        ) : (
          <DropZone
            obavijest={porukaUZoni ? obavijest : null}
            onZatvoriObavijest={() => setObavijest(null)}
            onUcitaj={() => ulaz.current.click()}
            onDatoteka={ucitaj}
            salje={salje}
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
        odredisnaMapa={odabranaMapa ? nadji(stavke, odabranaMapa)?.naziv ?? null : null}
        onPrimijeniFiltar={() =>
          setDijalog({ vrsta: "filtar", datoteka: datoteka.datoteka, naziv: datoteka.naziv })
        }
        primijeniFiltarOmoguceno={Boolean(datoteka?.datoteka)}
      />
      {salje && datoteka && (
        <p className="ws-poruka" role="status">
          Spremanje datoteke...
        </p>
      )}
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
      ) : stavke.length === 0 ? (
        <p className="ws-poruka">Još nemaš nijednu datoteku ni mapu.</p>
      ) : (
        <FileTree
          stavke={stavke}
          otvoreno={otvoreno}
          odabrano={odabrano}
          odabranaMapa={odabranaMapa}
          izbornik={izbornik}
          onOdaberi={(id) => {
            setLokalna(null);
            setOdabrano(id);
            // upload i nova mapa idu u mapu odabrane datoteke
            const otac = roditelj(stavke, id);
            setOdabranaMapa(otac ? otac.id : null);
          }}
          onOdaberiMapu={setOdabranaMapa}
          onPrebaciMapu={prebaciMapu}
          onIzbornik={setIzbornik}
          onRadnja={(vrsta, stavka) => setDijalog({ vrsta, id: stavka.id })}
        />
      )}
      {dijalog && prikaziDijalog()}
    </div>
  );
}
