# 1. Opseg projekta

## 1.1 Problem i cilj projekta

**Problem:** Osoba koja želi napraviti, obraditi i podijeliti zvukovni zapis danas za to obično koristi više odvojenih alata. Zapis obrađuje u programu instaliranom na računalu, datoteke čuva lokalno ili na općenitoj usluzi za pohranu, a dijeli ih na zasebnoj platformi za objavu zvuka. Prelazak između tih alata zahtijeva ručno izvoženje i ponovno učitavanje datoteka.

**Cilj projekta:** Razviti web platformu ProAudio na kojoj prijavljeni korisnik na jednom mjestu može uvoziti, generirati, organizirati, preslušavati i obrađivati zvukovne zapise u privatnoj radnoj okolini te ih objaviti na svojoj javnoj stranici u obliku postova.

**Očekivana korist:** Korisnik može od uvoza ili generiranja zvukovnog zapisa, preko obrade filtrima, do objave na javnoj stranici doći unutar jedne aplikacije u web pregledniku, bez instalacije dodatnog programa.

### Očekivane koristi i potkrepljujući dokazi

| Očekivana korist | Kako će se potkrijepiti |
|---|---|
| Obrada zvukovnog zapisa bez instalacije posebnog programa | Demonstracija obrade zapisa filtrima u web pregledniku; ispitni slučajevi za primjenu filtara |
| Zapis se nakon obrade može objaviti bez ručnog izvoza i ponovnog učitavanja | Demonstracija objave zapisa iz radne okoline na javnu stranicu |
| Zapisi su organizirani na jednom mjestu | Ispitni slučajevi za stvaranje direktorija, imenovanje i preimenovanje datoteka |

Navedene koristi očekivane su na temelju projektnog zadatka i bit će provjerene ispitivanjem i demonstracijom gotove aplikacije (vidi poglavlje o ispitivanju).

## 1.2 Ciljani korisnici i dionici

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt |
|---|---|
| Prijavljeni korisnik – vlasnik radne okoline | Uvoz, izvoz, generiranje, organizacija i obrada vlastitih zvukovnih zapisa u privatnoj radnoj okolini |
| Prijavljeni korisnik – autor javne stranice | Objava zvukovnih zapisa s popratnim tekstom, uređivanje profila i postova te označavanje postova kao javnih ili privatnih |
| Prijavljeni korisnik – posjetitelj tuđe javne stranice | Pregled javnih stranica drugih korisnika, dodavanje stranica i postova u favorite, preuzimanje zapisa ili njihovo dodavanje u vlastitu radnu okolinu |
| Asistent i nastavnik kolegija (naručitelj zadatka) | Rješenje koje ispunjava zahtjeve projektnog zadatka i prati propisanu dokumentaciju |
| Razvojni tim (G05.4) | Izvedivost zadatka unutar trajanja semestra uz jasno podijeljena zaduženja |
| Vanjski pružatelj autentifikacije (OAuth 2.0) | Ispravna integracija i poštivanje uvjeta korištenja njegove usluge |

## 1.3 Granice projekta

**Uključeno:**

- Registracija i prijava putem vanjskog servisa za autentifikaciju uporabom radnog okvira OAuth 2.0.
- Privatna radna okolina za svakog korisnika, vidljiva samo vlasniku, s tri inicijalna zvukovna zapisa nakon prve prijave.
- Uvoz i izvoz (upload/download) zvukovnih zapisa u najmanje tri formata datoteka.
- Računalno generiranje zvukovnog zapisa (npr. oscilatorom ili instrumentom).
- Skladištenje i brisanje zapisa, organizacija u strukturu direktorija te imenovanje i preimenovanje datoteka.
- Obrada zapisa s najmanje pet filtara, uz pohranu rezultata kao nove datoteke ili prepisivanje originalne.
- Preslušavanje i prikaz zvukovnog zapisa u vremenskoj domeni (waveform).
- Javna stranica korisnika s korisničkim imenom, slikom i kratkim opisom te nizom postova (zvukovni zapis s tekstualnim opisom).
- Dodavanje, uređivanje i brisanje postova te njihovo označavanje kao javnih ili privatnih.
- Pregled javnih stranica drugih prijavljenih korisnika, dodavanje stranica i postova u favorite te preuzimanje tuđih zapisa lokalno ili u vlastitu radnu okolinu.

**Izvan opsega ili odgođeno:**

- **Pristup neprijavljenih korisnika:** prema projektnom zadatku javne stranice vidljive su samo prijavljenim korisnicima, pa pregled bez prijave nije predviđen.
- **Snimanje zvuka mikrofonom:** nije dio projektnog zadatka; zvukovni zapisi dolaze uvozom datoteka, generiranjem ili s tuđih javnih stranica.
- **Višekanalna obrada i miješanje više zapisa (multitrack):** nije dio zadatka i znatno bi povećala složenost; obrada se odnosi na primjenu filtara na pojedinačni zapis.
- **Komentari, ocjene i slične društvene funkcije osim favorita:** nisu dio zadatka.
- **Zasebna mobilna aplikacija:** aplikacija se razvija kao web platforma u zadanom vremenskom okviru semestra.

**Vanjske ovisnosti:**

- **Vanjski pružatelj identiteta (OAuth 2.0):** obavezan prema projektnom zadatku; bez njega registracija i prijava nisu moguće. Konkretni pružatelj bit će odabran pri odabiru tehnologija.
- **Pohrana podataka:** baza podataka i prostor za pohranu datoteka zvukovnih zapisa i slika korisnika, odabiru se zajedno s tehnologijama.

Projektni zadatak predlaže i Web Audio API za rad sa zvukovnim zapisima te FreeSound API za dohvaćanje zapisa. Njihova uporaba nije obavezna, a bit će navedena ovdje ako ih tim odabere.

## 1.4 Postojeći pristupi i opravdanost projekta

Za obradu zvuka često se koristi Audacity, besplatni program otvorenog koda za uređivanje i snimanje zvuka koji se instalira na računalo i radi na sustavima Windows, macOS i Linux [1]. Za javnu objavu zvuka koriste se platforme poput SoundClouda, koja korisnicima omogućuje učitavanje i dijeljenje zvukovnih zapisa te prikazuje zapise u obliku valnog oblika [2]. Budući da su obrada i objava u tim primjerima odvojene, korisnik mora zapis izvesti iz jednog alata i ponovno ga učitati u drugi. ProAudio te korake objedinjuje u jednoj web aplikaciji, uz privatnu radnu okolinu za organizaciju i obradu zapisa i javnu stranicu za njihovu objavu.

**Izvori:**

1. Hofstra University, Department of Computer Science – Audacity: https://cs.hofstra.edu/docs/pages/resources/software/audacity.html
2. Encyclopedia.pub – SoundCloud: https://encyclopedia.pub/entry/30340
