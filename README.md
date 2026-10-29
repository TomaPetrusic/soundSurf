# ProAudio

**Programsko inženjerstvo, ak. god. 2026./2027.**

Sveučilište u Zagrebu
Fakultet elektrotehnike i računarstva

---


ProAudio korisnicima omogućuje uvoz, generiranje, obradu i objavu zvukovnih zapisa na jednom mjestu, u web pregledniku, bez instaliranja posebnog softvera.

**Projekt na kolegiju:** Ovu aplikaciju razvija studentski tim SoundSurfer (G05.4) u sklopu kolegija Programsko inženjerstvo na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu (FER), pod vodstvom nastavnika Vlade Sruka.

## Opis aplikacije

Osoba koja želi obraditi i objaviti zvukovni zapis danas obično mora koristiti više odvojenih alata: jedan za obradu, drugi za pohranu, treći za javnu objavu. ProAudio je namijenjen glazbenicima, producentima i svima koji eksperimentiraju sa zvukom, a te korake objedinjuje u jednoj aplikaciji: prijavljeni korisnik u privatnoj radnoj okolini uvozi, generira, organizira, preslušava i obrađuje zvukovne zapise filtrima, a gotove zapise objavljuje na svojoj javnoj stranici u obliku postova. Drugi prijavljeni korisnici mogu pregledavati tuđe javne stranice, preuzimati zapise ili ih spremati u favorite.


**Planirane funkcionalnosti** (vidi [docs/2-Analiza-zahtjeva.md](docs/2-Analiza-zahtjeva.md) za potpun i provjerljiv popis):

- Prijava putem vanjskog pružatelja identiteta (OAuth 2.0 / OpenID Connect).
- Uvoz i izvoz zvukovnih zapisa u formatima WAV, MP3 i FLAC te uvoz zapisa s Freesounda.
- Organizacija zapisa u direktorije, generiranje zvuka oscilatorom, obrada filtrima (niskopropusni, visokopropusni, pojačanje, reverb, tremolo) i preslušavanje s prikazom valnog oblika (waveform).
- Javna stranica s postovima (zvukovni zapis + opis), oznaka vidljivosti posta (javno/privatno) i favoriti za tuđe stranice i postove.


## Postavljanje (engl. deployment)

Trenutno nije dostupno.

**Demonstracija:** 

**Ograničenja:** 


## Brzi početak / instalacija

**Preduvjeti:** Node.js 22 (LTS) i npm, Python 3.12 i pip, te pristup Supabase projektu tima (bazi podataka i Auth postavkama) kako bi se popunile varijable okruženja ispod.

### 1. Kloniranje

```
git clone https://github.com/TomaPetrusic/soundSurf.git
cd soundSurf
```

### 2. Backend (Django + Django REST Framework)

```
cd backend
cp .env.example .env
```

Otvorite `backend/.env` i upišite stvarne vrijednosti (vidi komentare u `.env.example` za izvor svake varijable — Supabase nadzorna ploča za `DATABASE_URL` i `SUPABASE_URL`, te slobodno odabran nasumičan niz za `DJANGO_SECRET_KEY`). **Nikad ne commitajte `.env`** — datoteka je već u `.gitignore`.

```
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Adresa:** `http://localhost:8000`. **Provjera:** `curl http://localhost:8000/api/health/` treba vratiti `{"status":"ok"}`.

### 3. Frontend (React + Vite), u novom terminalu

```
cd frontend
cp .env.example .env
```

Otvorite `frontend/.env` i upišite `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY` (Supabase nadzorna ploča -> Project Settings -> API; anon ključ je javni i smije biti na frontendu). `VITE_API_URL` lokalno ostaje `http://localhost:8000`.

```
npm install
npm run dev
```

**Adresa:** `http://localhost:5173`. Backend mora biti pokrenut (korak 2) da bi prijava i "O meni" radili.

### 4. Provjera cijelog toka

Otvorite `http://localhost:5173`, kliknite "Prijava preko Googlea", prijavite se Google računom, uredite i spremite tekst "O meni", odjavite se i prijavite se ponovno — spremljeni tekst treba ostati.

Za detaljno postavljanje pogledajte [projektnu dokumentaciju](docs/6-Postavljanje-instalacija-i-konfiguracija.md).

## Tehnologije

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
| Python + Django + Django REST Framework | Poslužiteljski dio (`backend/`), JSON API | Kolegij propisuje Javu ili Python uz objektno orijentirano oblikovanje; Django nudi ORM, migracije i ugrađene sigurnosne mehanizme. Frontend nikad ne čita ni ne piše tablice izravno preko Supabasea — sve ide kroz ovaj API. |
| React + Vite | Klijentski dio (`frontend/`) | Interaktivno web-sučelje za radnu okolinu i javne stranice; Vite gradi statičke datoteke koje poslužuje Django (`whitenoise`). |
| PostgreSQL na Supabaseu | Baza podataka | Pohrana korisnika, metapodataka zvukovnih zapisa, postova i favorita; Django joj pristupa preko `DATABASE_URL`. Row Level Security je uključen na svim tablicama (bez politika), tako da Supabase Data API s anonimnim ključem ne vidi ništa — pristup ide isključivo kroz Django. |
| Supabase Auth (Google provider) | Prijava korisnika (F-01 u zahtjevima) | Frontend poziva `supabase-js` samo za prijavu; backend provjerava Supabase JWT (JWKS) i njime autenticira zahtjeve. Prva prijava je registracija (nema zasebne registracijske forme). |
| Freesound API | Uvoz zvukovnih zapisa (F-05 u zahtjevima) | Obavezna domenski relevantna vanjska integracija prema pravilima kolegija (vidi ograničenje C-04 u [docs/2](docs/2-Analiza-zahtjeva.md)). |
| GitHub Actions | CI | Pokretanje provjera na svakom pull requestu; deploy se odvija automatski putem Railwaya. |
| Railway | Smještanje (hosting) aplikacije | Automatski deploy pri spajanju na `main`; trajna pohrana datoteka i baze bez gašenja servisa zbog neaktivnosti. Stvarna javna adresa još nije potvrđena. |
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

**Izjava:** Tim je koristio Claude Code (Anthropic) za izradu nacrta projektne dokumentacije — poglavlja [2. Analiza zahtjeva](docs/2-Analiza-zahtjeva.md), [3. Obrasci uporabe](docs/3-Obrasci-uporabe.md) i ovog README-a — na temelju opisa teme i pravila kolegija koje je zadao tim. Tim je generirani sadržaj pregledao, ispravio i prilagodio (vidi povijest promjena u repozitoriju) i odgovoran je za točnost svih tvrdnji o funkcionalnostima.

## Kodeks ponašanja i podrška

Od članova tima očekuje se pridržavanje Kodeksa ponašanja studenata Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i Etičkog kodeksa IEEE-a. Vidi [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora Vlade Sruka, licenciranom pod CC BY-NC-SA 4.0. Aplikaciju i njezin sadržaj izradio je gore navedeni studentski tim.
