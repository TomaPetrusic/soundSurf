# ProAudio

**Programsko inženjerstvo, ak. god. 2026./2027.**

Sveučilište u Zagrebu
Fakultet elektrotehnike i računarstva

---

## Zašto je ovaj odjeljak važan

ProAudio korisnicima omogućuje uvoz, generiranje, obradu i objavu zvukovnih zapisa na jednom mjestu, u web pregledniku, bez instaliranja posebnog softvera.

**Projekt na kolegiju:** Ovu aplikaciju razvija studentski tim SoundSurfer (G05.4) u sklopu kolegija Programsko inženjerstvo na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu (FER), pod vodstvom nastavnika Vlade Sruka.

## Opis aplikacije

Osoba koja želi obraditi i objaviti zvukovni zapis danas obično mora koristiti više odvojenih alata: jedan za obradu, drugi za pohranu, treći za javnu objavu. ProAudio je namijenjen glazbenicima, producentima i svima koji eksperimentiraju sa zvukom, a te korake objedinjuje u jednoj aplikaciji: prijavljeni korisnik u privatnoj radnoj okolini uvozi, generira, organizira, preslušava i obrađuje zvukovne zapise filtrima, a gotove zapise objavljuje na svojoj javnoj stranici u obliku postova. Drugi prijavljeni korisnici mogu pregledavati tuđe javne stranice, preuzimati zapise ili ih spremati u favorite.

**Trenutno stanje:** Repozitorij je u ranoj fazi razvoja. Poslužiteljski dio (`backend/`) sadrži samo testnu `/health` krajnju točku bez pravog poslovnog koda, a klijentski dio (`frontend/`) samo statičnu placeholder stranicu; nijedna funkcionalnost opisana ispod još nije implementirana.

**Planirane funkcionalnosti** (vidi [docs/2-Analiza-zahtjeva.md](docs/2-Analiza-zahtjeva.md) za potpun i provjerljiv popis):

- Prijava putem vanjskog pružatelja identiteta (OAuth 2.0 / OpenID Connect).
- Uvoz i izvoz zvukovnih zapisa u formatima WAV, MP3 i FLAC te uvoz zapisa s Freesounda.
- Organizacija zapisa u direktorije, generiranje zvuka oscilatorom, obrada filtrima (niskopropusni, visokopropusni, pojačanje, reverb, tremolo) i preslušavanje s prikazom valnog oblika (waveform).
- Javna stranica s postovima (zvukovni zapis + opis), oznaka vidljivosti posta (javno/privatno) i favoriti za tuđe stranice i postove.

Za potpuni opseg, zahtjeve, oblikovanje i dokaze ispitivanja pogledajte [docs](docs/Home.md).

## Postavljanje (engl. deployment)

**Javno dostupna aplikacija:** još nema javne adrese sa stvarnom funkcionalnošću. CD radni tijek (`.github/workflows/cd.yml`) pokreće Render deploy hook pri svakom spajanju na `main`, ali taj hook trenutno postavlja samo poslužiteljski stub (vidi "Trenutno stanje" iznad). Javna adresa bit će dodana ovdje kada tim potvrdi vlastiti deployment.

**Isprobajte:** nakon postavljanja javne adrese, posjetite `<adresa>/health` — odgovor `{"status":"healthy"}` potvrđuje da je poslužitelj pokrenut. Korisnički tijek (prijava, radna okolina, javna stranica) još ne postoji na javno postavljenoj inačici.

**Demonstracija:** Korisnički račun nije potreban za trenutno dostupan dio aplikacije (testna `/health` krajnja točka).

**Ograničenja:** aplikacija je u fazi scaffolda bez implementirane poslovne logike; poznata ograničenja i planirani opseg vode se u [docs/2-Analiza-zahtjeva.md](docs/2-Analiza-zahtjeva.md) i [docs/7-Zakljucak-i-buduci-rad.md](docs/7-Zakljucak-i-buduci-rad.md).

Vodič za postavljanje i pokretanje opisuje smještaj aplikacije (engl. hosting) koji tim stvarno koristi: [docs/6-Postavljanje-instalacija-i-konfiguracija.md](docs/6-Postavljanje-instalacija-i-konfiguracija.md).

## Brzi početak / instalacija

**Preduvjeti:** Node.js (LTS inačica) i npm. Baza podataka i vanjske usluge (OAuth pružatelj, Freesound API) još nisu potrebne za pokretanje trenutnog stuba.

```
git clone https://github.com/TomaPetrusic/soundSurf.git
cd soundSurf/backend
npm install
npm start
```

**Adresa:** `http://localhost:10000` (port se može promijeniti varijablom okruženja `PORT`).

**Konfiguracija:** trenutni backend stub ne zahtijeva varijable okruženja osim neobaveznog `PORT`. Kada se implementiraju prijava, baza podataka i vanjske integracije, njihove varijable okruženja i `.env.example` bit će dokumentirani ovdje i u vodiču za postavljanje.

**Provjera:** `curl http://localhost:10000/health` treba vratiti `{"status":"healthy"}`.

Klijentski dio (`frontend/`) trenutno nema razvojni poslužitelj; `npm run build` unutar `frontend/` samo generira statičnu placeholder stranicu (`npm install` nije potreban jer nema ovisnosti).

Za detaljno postavljanje pogledajte [projektnu dokumentaciju](docs/6-Postavljanje-instalacija-i-konfiguracija.md).

## Tehnologije

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
| Node.js | Izvršno okruženje poslužiteljskog dijela (`backend/`) | Trenutno se koristi samo ugrađeni `http` modul; odabir poslužiteljskog okvira (npr. Express) još nije donesen. |
| GitHub Actions | CI/CD | `ci.yml` je trenutno samo placeholder korak; `cd.yml` pri spajanju na `main` pokreće Render deploy hook. |
| Render | Planirano smještanje (hosting) poslužiteljskog dijela | Deploy hook konfiguriran u `cd.yml`; stvarna javna adresa još nije potvrđena (vidi "Postavljanje" iznad). |
| OAuth 2.0 / OpenID Connect pružatelj identiteta | Planirana prijava korisnika (F-01 u zahtjevima) | Konkretan pružatelj još nije odabran (vidi pretpostavku AS-02 u [docs/2](docs/2-Analiza-zahtjeva.md)). |
| Freesound API | Planirani uvoz zvukovnih zapisa (F-05 u zahtjevima) | Obavezna domenski relevantna vanjska integracija prema pravilima kolegija (vidi ograničenje C-04 u [docs/2](docs/2-Analiza-zahtjeva.md)). |

Potrebne verzije i konfiguraciju tehnologija dokumentirat ćemo u vodiču za instalaciju kako se budu odabirale.

## Članovi tima

| Ime i prezime | Uloga | Zaduženja |
|---|---|---|
| Filip Celić | Voditelj tima | Upload, download, formati, folderi |
| Jakov Džijan | Član tima | Javna stranica, postovi, favoriti |
| Toni Grdović | Član tima | Player, UI, radne okoline |
| Leonard Fabris | Član tima | Filtri, generiranje zvuka |
| Ante Vrkić | Član tima | Dokumentacija, UML, testovi, pomoć pri kodiranju |
| Toma Petrušić | Član tima | Login, deploy |

Uloge se tijekom projekta mogu mijenjati. Repozitorij i GitHub Issues služe kao dodatni dokazi timskog rada.

## Doprinos projektu

Zadaci i nedostaci prate se putem [GitHub Issues](https://github.com/TomaPetrusic/soundSurf/issues) ovog repozitorija. Promjene koda i dokumentacije pregledavaju se kroz zahtjeve za uključivanje promjena (pull request) prije spajanja na granu `main`. Tim trenutno ne održava zaseban `CONTRIBUTING.md`.

**Status licence:** licenca za kod i sadržaj aplikacije ProAudio još nije odabrana. Datoteka [LICENSE](LICENSE) u ovom repozitoriju odnosi se na dokumentacijski predložak kolegija, ne na aplikaciju (vidi niže). Tim treba odabrati licencu aplikacije (ili izričito navesti da nije dodijeljena licenca koja dopušta javnu ponovnu uporabu) prije javnog objavljivanja, ako je primjenjivo.

Dokumentacijski predložak kolegija sadrži otvorene obrazovne sadržaje (engl. Open Educational Resources, OER) i licenciran je licencom Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Ta licenca ne određuje automatski licencu studentske aplikacije; tim treba jasno navesti licencu svojeg projekta u prethodnom retku i datoteci LICENSE, ako je primjenjivo.

Kod trećih strana, skupovi podataka, slike, ikone i drugi sadržaji zadržavaju vlastite licence i uvjete uporabe.

## Uporaba umjetne inteligencije

**AI Usage: Disclosed**

Ovaj projekt slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

**Izjava:** Tim je koristio Claude Code (Anthropic) za izradu nacrta projektne dokumentacije — poglavlja [2. Analiza zahtjeva](docs/2-Analiza-zahtjeva.md), [3. Obrasci uporabe](docs/3-Obrasci-uporabe.md) i ovog README-a — na temelju opisa teme i pravila kolegija koje je zadao tim. Tim je generirani sadržaj pregledao, ispravio i prilagodio (vidi povijest promjena u repozitoriju) i odgovoran je za točnost svih tvrdnji o funkcionalnostima. Detaljan zapis uporabe umjetne inteligencije vodi se u [docs/Home.md](docs/Home.md#izjava-o-uporabi-umjetne-inteligencije); tim ga treba dovršiti prije predaje.

## Kodeks ponašanja i podrška

Od članova tima očekuje se pridržavanje Kodeksa ponašanja studenata Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i Etičkog kodeksa IEEE-a. Vidi [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora Vlade Sruka, licenciranom pod CC BY-NC-SA 4.0. Aplikaciju i njezin sadržaj izradio je gore navedeni studentski tim.
