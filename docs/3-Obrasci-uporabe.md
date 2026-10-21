# 3. Obrasci uporabe

**Cilj:** Prikazati glavne interakcije između aktera aplikacije i sustava. Opišite kako akter ostvaruje cilj i što se događa kada važan korak ne uspije. Interakcije temeljite na odobrenim zahtjevima i ažurirajte ih kako se aplikacija razvija.

## 3.1 Dijagram obrazaca uporabe

**Cilj:** Prikazati granicu sustava, relevantne aktere i njihove glavne ciljeve u **preglednom UML dijagramu obrazaca uporabe**. Ako je za razumijevanje pojedinog dijela sustava potrebno prikazati više detalja, taj dio izdvojite u dodatni usmjereni dijagram.

<!-- TODO: dijagram obrazaca uporabe – izrađuje tim -->

### Akteri

| ID | Naziv | Vrsta | Generalizacija |
| --- | --- | --- | --- |
| A-01 | Neprijavljeni posjetitelj | Aktivni — pokreće UC-01 (jedini obrazac uporabe dostupan ovom akteru). | — |
| A-02 | Prijavljeni korisnik | Aktivni — pokreće sve obrasce uporabe osim onih koje pokreću isključivo sekundarni akteri; sudjeluje i u UC-01 nakon autorizacije. | — |
| A-03 | Vanjski pružatelj identiteta (OAuth 2.0 / OIDC) | Pasivni — sudjeluje u UC-01 kao sekundarni akter (provodi autentifikaciju), ali ga ne pokreće. | — |
| A-04 | Freesound API | Pasivni — sudjeluje u UC-04 kao sekundarni akter (isporučuje zapise), ali ga ne pokreće. | — |

**Napomena o generalizaciji:** Među akterima nema generalizacije. "Prijavljeni korisnik" ne specijalizira "Neprijavljenog posjetitelja" — riječ je o istoj osobi u dva stanja sesije (prije i nakon prijave), a ne o dvije uloge s različitim skupom mogućnosti koje bi opravdale UML generalizaciju aktera. Isto vrijedi za tri konteksta prijavljenog korisnika iz [2.3 Dionici i akteri](2-Analiza-zahtjeva.md#23-dionici-i-akteri) (vlasnik radne okoline, autor javne stranice, posjetitelj tuđe stranice): to je jedan akter (A-02) u različitim kontekstima, ne tri specijalizirana aktera.

### Popis obrazaca uporabe

**Cilj:** Dok dijagram ne bude izrađen, u tablici popisati sve obrasce uporabe, njihove aktere i odnose `<<include>>`/`<<extend>>` koji stvarno postoje.

| ID | Naziv | Aktivni akter | Pasivni akteri | Odnosi | Povezani zahtjevi |
| --- | --- | --- | --- | --- | --- |
| UC-01 | Prijava u sustav | Neprijavljeni posjetitelj / Prijavljeni korisnik | Vanjski pružatelj identiteta | — | F-01, F-02, F-03 |
| UC-02 | Upravljanje datotekama i direktorijima | Prijavljeni korisnik | — | — | F-07, F-08, F-09, F-10 |
| UC-03 | Uvoz zvukovnog zapisa (upload) | Prijavljeni korisnik | — | «extend» UC-04 [uvjet: korisnik odabere izvor Freesound umjesto lokalne datoteke] | F-04 |
| UC-04 | Uvoz zapisa s Freesounda | Prijavljeni korisnik | Freesound API | Proširuje («extend») UC-03 [isti uvjet] | F-05; NF-11 |
| UC-05 | Izvoz zvukovnog zapisa (download) | Prijavljeni korisnik | — | — | F-06 |
| UC-06 | Generiranje zvukovnog zapisa oscilatorom | Prijavljeni korisnik | — | — | F-11, F-12; D-03, D-05 |
| UC-07 | Primjena filtra na zapis | Prijavljeni korisnik | — | «include» UC-07a [odabir spremanja rezultata uvijek se izvršava]; «extend» UC-08, UC-09, UC-10, UC-11, UC-12 [uvjet: korisnik odabire točno jedan od pet filtara] | F-13–F-18; D-04, D-05 |
| UC-07a | Odabir spremanja rezultata | Prijavljeni korisnik | — | Uključen («include») u UC-07 | F-18 |
| UC-08 | Niskopropusni filtar (low-pass) | Prijavljeni korisnik | — | Proširuje («extend») UC-07 [uvjet: korisnik odabere niskopropusni filtar] | F-13; D-04 |
| UC-09 | Visokopropusni filtar (high-pass) | Prijavljeni korisnik | — | Proširuje («extend») UC-07 [uvjet: korisnik odabere visokopropusni filtar] | F-14; D-04 |
| UC-10 | Pojačanje (gain) | Prijavljeni korisnik | — | Proširuje («extend») UC-07 [uvjet: korisnik odabere pojačanje] | F-15 |
| UC-11 | Reverb | Prijavljeni korisnik | — | Proširuje («extend») UC-07 [uvjet: korisnik odabere reverb] | F-16 |
| UC-12 | Tremolo | Prijavljeni korisnik | — | Proširuje («extend») UC-07 [uvjet: korisnik odabere tremolo] | F-17 |
| UC-13 | Preslušavanje zapisa i prikaz waveforma | Prijavljeni korisnik | — | — | F-19, F-20 |
| UC-14 | Uređivanje profila javne stranice | Prijavljeni korisnik | — | — | F-21 |
| UC-15 | Objava posta | Prijavljeni korisnik | — | — | F-22 |
| UC-16 | Upravljanje postovima | Prijavljeni korisnik | — | — | F-23, F-24, F-25 |
| UC-17 | Pregled tuđe javne stranice | Prijavljeni korisnik | — | — | F-26 |
| UC-18 | Upravljanje favoritima | Prijavljeni korisnik | — | — | F-27, F-28, F-29 |
| UC-19 | Preuzimanje ili uvoz tuđeg zapisa | Prijavljeni korisnik | — | — | F-30, F-31 |

Detaljne specifikacije odabranih obrazaca uporabe nalaze se u nastavku (3.2); tablica iznad služi kao pregled aktera i odnosa dok dijagram ne bude izrađen.

## 3.2 Specifikacije obrazaca uporabe

**Cilj:** Za svaki obrazac uporabe iz dijagrama objasniti cilj aktera, uobičajenu interakciju s aplikacijom i važne alternative. Jednostavne obrasce uporabe opisujemo kratko; proširujemo one kod kojih alternative, vanjske ovisnosti ili posljedice zahtijevaju dodatno objašnjenje — ovdje su to prijava putem OAuth-a (UC-01), uvoz zapisa (UC-03), primjena filtra i spremanje rezultata (UC-07) te objava posta (UC-15).

### UC-01: Prijava u sustav

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Neprijavljeni posjetitelj (A-01) pri pokretanju; Prijavljeni korisnik (A-02) nakon uspješne autorizacije |
| **Sekundarni akter** | Vanjski pružatelj identiteta (A-03) |
| **Povezani zahtjevi** | F-01, F-02, F-03; NF-09, NF-10 |
| **Preduvjeti** | Posjetitelj nije prijavljen u aplikaciju. |
| **Glavni uspješni tok** | 1. Posjetitelj odabire prijavu u aplikaciji.<br>2. Aplikacija ga preusmjerava na vanjskog pružatelja identiteta.<br>3. Posjetitelj se autorizira kod pružatelja identiteta (OAuth 2.0 / OIDC).<br>4. Pružatelj identiteta vraća aplikaciji potvrdu identiteta.<br>5. Ako je to prva prijava korisnika, aplikacija stvara korisnički račun i radnu okolinu s tri početna zvukovna zapisa (F-02).<br>6. Aplikacija otvara sesiju; korisnik je prijavljen i ima pristup svojoj radnoj okolini i javnoj stranici. |
| **Alternativni tokovi / Iznimke** | **3a — Posjetitelj odustane od autorizacije:** pružatelj identiteta ne vrati potvrdu; aplikacija ostaje u neprijavljenom stanju.<br>**4a — Pružatelj identiteta vrati pogrešku:** aplikacija prikazuje obavijest da prijava nije uspjela i nudi ponovni pokušaj; sesija se ne otvara.<br>**6a — Odjava:** prijavljeni korisnik u bilo kojem trenutku pokreće odjavu (F-03); sesija se zatvara i korisnik gubi pristup zaštićenim radnjama dok se ponovno ne prijavi. |
| **Posljedice (ishod)** | Korisnik ima otvorenu sesiju i pristup svojoj radnoj okolini i javnoj stranici; pri prvoj prijavi postoji i novostvoren račun s tri početna zapisa. |

### UC-02: Upravljanje datotekama i direktorijima

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-07, F-08, F-09, F-10 |
| **Preduvjeti** | Korisnik je prijavljen i ima otvorenu radnu okolinu. |
| **Glavni tijek** | Korisnik stvara direktorij, preimenuje datoteku ili direktorij, premješta datoteku u drugi direktorij ili briše datoteku/direktorij; aplikacija odmah prikazuje ažurirano stablo radne okoline. |
| **Alternativni tokovi / Iznimke** | Preimenovanje u naziv koji već postoji u istom direktoriju odbija se uz objašnjenje; brisanje direktorija koji sadrži datoteke traži potvrdu prije nastavka. |
| **Posljedice (ishod)** | Struktura direktorija i datoteka radne okoline odražava izvedenu radnju. |

### UC-03: Uvoz zvukovnog zapisa (upload)

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-04 |
| **Preduvjeti** | Korisnik je prijavljen i ima otvorenu radnu okolinu. |
| **Glavni uspješni tok** | 1. Korisnik odabire direktorij u radnoj okolini u koji želi učitati zapis.<br>2. Korisnik odabire lokalnu datoteku u formatu WAV, MP3 ili FLAC i pokreće učitavanje.<br>3. Aplikacija provjerava format i veličinu datoteke (NF-01).<br>4. Aplikacija pohranjuje datoteku u odabrani direktorij radne okoline.<br>5. Aplikacija prikazuje novu datoteku na popisu sadržaja direktorija. |
| **Alternativni tokovi / Iznimke** | **3a — Nepodržan format:** aplikacija odbija datoteku i objašnjava koji su formati podržani; datoteka se ne pohranjuje.<br>**3b — Datoteka prevelika:** aplikacija odbija datoteku uz objašnjenje najveće dopuštene veličine (NF-01); datoteka se ne pohranjuje.<br>**3c — Naziv datoteke već postoji u odabranom direktoriju:** aplikacija traži novi naziv ili potvrdu prepisivanja prije pohrane.<br>**4a — Pohrana nije uspjela:** aplikacija prijavljuje neuspjeh i ne prikazuje lažnu potvrdu uspješnog učitavanja. |
| **Posljedice (ishod)** | Nova zvukovna datoteka dostupna je u odabranom direktoriju radne okoline i spremna za preslušavanje i obradu. |

### UC-04: Uvoz zapisa s Freesounda

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Sekundarni akter** | Freesound API (A-04) |
| **Povezani zahtjevi** | F-05; NF-11 |
| **Preduvjeti** | Korisnik je prijavljen i ima otvorenu radnu okolinu. |
| **Glavni tijek** | Korisnik pretražuje Freesound unutar aplikacije, pregledava rezultate i odabire zapis koji aplikacija preuzima i pohranjuje u odabrani direktorij radne okoline. Riječ je o alternativnom izvoru zapisa za UC-03 (`<<extend>>`). |
| **Alternativni tokovi / Iznimke** | Freesound API odbije zahtjev (npr. zbog ograničenja broja zahtjeva, NF-11) → aplikacija prikazuje objašnjenje i ne pohranjuje zapis. |
| **Posljedice (ishod)** | Odabrani zvukovni zapis dostupan je u radnoj okolini korisnika. |

### UC-05: Izvoz zvukovnog zapisa (download)

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-06 |
| **Preduvjeti** | Zvukovni zapis postoji u radnoj okolini korisnika. |
| **Glavni tijek** | Korisnik odabire zapis i format izvoza (WAV, MP3 ili FLAC); aplikacija priprema datoteku i isporučuje je korisniku za preuzimanje. |
| **Alternativni tokovi / Iznimke** | Odabrana pretvorba formata nosi gubitak kvalitete (D-02 u [2. Analiza zahtjeva](2-Analiza-zahtjeva.md)) → aplikacija prije izvoza prikazuje upozorenje koje korisnik mora potvrditi. |
| **Posljedice (ishod)** | Korisnik na svom računalu ima datoteku koja sadržajno odgovara zapisu iz radne okoline u odabranom formatu. |

### UC-06: Generiranje zvukovnog zapisa oscilatorom

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-11, F-12; D-03, D-05 |
| **Preduvjeti** | Korisnik je prijavljen i ima otvorenu radnu okolinu. |
| **Glavni tijek** | Korisnik odabire oblik oscilatora (sinus, kvadrat, pila ili trokut), zadaje frekvenciju, trajanje i amplitudu te odabire direktorij; aplikacija generira zapis i pohranjuje ga kao novu datoteku. |
| **Alternativni tokovi / Iznimke** | Zadano trajanje premašuje najveće dopušteno trajanje (D-03) ili amplituda premašuje dopuštenu vrijednost (D-05) → aplikacija odbija zahtjev ili ograničava vrijednost uz objašnjenje. |
| **Posljedice (ishod)** | Nova generirana datoteka dostupna je u odabranom direktoriju radne okoline. |

### UC-07: Primjena filtra na zapis

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-13, F-14, F-15, F-16, F-17, F-18; D-04, D-05 |
| **Preduvjeti** | Odabrani zvukovni zapis postoji u radnoj okolini korisnika. |
| **Glavni uspješni tok** | 1. Korisnik odabire zvukovni zapis i jedan od pet filtara (niskopropusni, visokopropusni, pojačanje, reverb ili tremolo; UC-08–UC-12).<br>2. Korisnik zadaje parametre odabranog filtra (npr. graničnu frekvenciju ili faktor pojačanja).<br>3. Aplikacija provjerava jesu li parametri unutar dopuštenog raspona (npr. D-04 za granične frekvencije).<br>4. Korisnik pokreće primjenu filtra.<br>5. Aplikacija obrađuje zapis i prikazuje rezultat, uključujući waveform (UC-13), prije konačne pohrane.<br>6. Korisnik bira hoće li rezultat spremiti kao novu datoteku ili prepisati izvornu (UC-07a, F-18).<br>7. Aplikacija pohranjuje rezultat prema odabiru iz koraka 6. |
| **Alternativni tokovi / Iznimke** | **3a — Parametar izvan dopuštenog raspona:** aplikacija odbija vrijednost ili je ograničava na rub dopuštenog raspona i traži ispravak prije nastavka na korak 4.<br>**5a — Obrada nije uspjela:** aplikacija prijavljuje neuspjeh, izvorna datoteka ostaje nepromijenjena i rezultat se ne pohranjuje.<br>**6a — Korisnik odustane prije pohrane:** izvorna datoteka ostaje nepromijenjena; obrađeni rezultat se ne pohranjuje. |
| **Posljedice (ishod)** | U radnoj okolini postoji obrađeni zapis — kao nova datoteka ili kao zamjena izvorne, prema odabiru korisnika u koraku 6. |

### UC-07a: Odabir spremanja rezultata

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Veza s drugim obrascima** | Uključen (`<<include>>`) u svako pokretanje UC-07; obavezan korak, ne zaseban korisnički cilj. |
| **Povezani zahtjevi** | F-18 |
| **Preduvjeti** | Primjena filtra (UC-07, koraci 1–5) uspješno je izračunala rezultat koji čeka pohranu. |
| **Glavni tijek** | Korisnik bira "spremi kao novu datoteku" ili "prepiši original"; aplikacija pohranjuje rezultat prema odabiru. |
| **Posljedice (ishod)** | Postoji nova datoteka ili je izvorna datoteka zamijenjena obrađenim zapisom, prema odabiru korisnika. |

### UC-08: Niskopropusni filtar (low-pass)

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Veza s drugim obrascima** | Proširuje (`<<extend>>`) UC-07; korisnik bira ovaj filtar u koraku 1 UC-07. |
| **Povezani zahtjevi** | F-13; D-04 |
| **Glavni tijek** | Korisnik zadaje graničnu frekvenciju (20 Hz – 20 000 Hz, D-04); daljnji tok preuzima se iz UC-07 od koraka 3. |
| **Posljedice (ishod)** | Isto kao UC-07; sastavnice iznad granične frekvencije u rezultatu su znatno prigušene. |

### UC-09: Visokopropusni filtar (high-pass)

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Veza s drugim obrascima** | Proširuje (`<<extend>>`) UC-07; korisnik bira ovaj filtar u koraku 1 UC-07. |
| **Povezani zahtjevi** | F-14; D-04 |
| **Glavni tijek** | Korisnik zadaje graničnu frekvenciju (20 Hz – 20 000 Hz, D-04); daljnji tok preuzima se iz UC-07 od koraka 3. |
| **Posljedice (ishod)** | Isto kao UC-07; sastavnice ispod granične frekvencije u rezultatu su znatno prigušene. |

### UC-10: Pojačanje (gain)

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Veza s drugim obrascima** | Proširuje (`<<extend>>`) UC-07; korisnik bira ovaj filtar u koraku 1 UC-07. |
| **Povezani zahtjevi** | F-15 |
| **Glavni tijek** | Korisnik zadaje faktor pojačanja; daljnji tok preuzima se iz UC-07 od koraka 3. |
| **Posljedice (ishod)** | Isto kao UC-07; amplituda rezultata razmjerno je promijenjena prema zadanom faktoru. |

### UC-11: Reverb

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Veza s drugim obrascima** | Proširuje (`<<extend>>`) UC-07; korisnik bira ovaj efekt u koraku 1 UC-07. |
| **Povezani zahtjevi** | F-16 |
| **Glavni tijek** | Korisnik zadaje vrijeme odziva i udio efekta; daljnji tok preuzima se iz UC-07 od koraka 3. |
| **Posljedice (ishod)** | Isto kao UC-07; rezultat sadrži čujan odjek prema zadanim parametrima. |

### UC-12: Tremolo

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Veza s drugim obrascima** | Proširuje (`<<extend>>`) UC-07; korisnik bira ovaj efekt u koraku 1 UC-07. |
| **Povezani zahtjevi** | F-17 |
| **Glavni tijek** | Korisnik zadaje brzinu i dubinu modulacije; daljnji tok preuzima se iz UC-07 od koraka 3. |
| **Posljedice (ishod)** | Isto kao UC-07; amplituda rezultata periodički se mijenja prema zadanim parametrima. |

### UC-13: Preslušavanje zapisa i prikaz waveforma

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-19, F-20 |
| **Preduvjeti** | Zvukovni zapis postoji u radnoj okolini korisnika. |
| **Glavni tijek** | Korisnik odabire zapis za preslušavanje; aplikacija prikazuje njegov valni oblik u vremenskoj domeni i reproducira zvuk uz mogućnost pokretanja, pauziranja i promjene položaja reprodukcije. |
| **Posljedice (ishod)** | Korisnik je čuo (dio) zapisa i vidio njegov valni oblik. |

### UC-14: Uređivanje profila javne stranice

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-21 |
| **Preduvjeti** | Korisnik je prijavljen. |
| **Glavni tijek** | Korisnik uređuje korisničko ime, profilnu sliku i/ili kratki opis i sprema promjene; javna stranica korisnika prikazuje nove podatke. |
| **Posljedice (ishod)** | Javna stranica korisnika prikazuje ažurirane podatke profila. |

### UC-15: Objava posta

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-22 |
| **Preduvjeti** | Korisnik je prijavljen i u svojoj radnoj okolini ima barem jedan zvukovni zapis. |
| **Glavni uspješni tok** | 1. Korisnik na svojoj javnoj stranici pokreće objavu novog posta.<br>2. Korisnik odabire zvukovni zapis iz radne okoline koji želi objaviti.<br>3. Korisnik unosi tekstualni opis posta i odabire je li post javan ili privatan (F-24).<br>4. Korisnik potvrđuje objavu.<br>5. Aplikacija pohranjuje post i prikazuje ga na javnoj stranici korisnika prema odabranoj vidljivosti. |
| **Alternativni tokovi / Iznimke** | **2a — Radna okolina je prazna:** aplikacija objašnjava da je potreban barem jedan zvukovni zapis prije objave i upućuje korisnika na uvoz ili generiranje zapisa (UC-03/UC-04/UC-06).<br>**3a — Tekstualni opis nedostaje:** aplikacija traži unos opisa prije nastavka na korak 4.<br>**5a — Pohrana nije uspjela:** aplikacija prijavljuje neuspjeh i ne prikazuje lažnu potvrdu objave; post se ne prikazuje na javnoj stranici. |
| **Posljedice (ishod)** | Novi post postoji na javnoj stranici korisnika, vidljiv ovisno o odabranoj postavci javnosti. |

### UC-16: Upravljanje postovima

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-23, F-24, F-25 |
| **Preduvjeti** | Post postoji na javnoj stranici korisnika. |
| **Glavni tijek** | Korisnik uređuje tekstualni opis posta, mijenja njegovu vidljivost (javan/privatan) ili ga briše; javna stranica odmah odražava promjenu. |
| **Posljedice (ishod)** | Post je izmijenjen, promijenjene vidljivosti ili obrisan, prema odabranoj radnji. |

### UC-17: Pregled tuđe javne stranice

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-26 |
| **Preduvjeti** | Korisnik je prijavljen; tuđa javna stranica postoji. |
| **Glavni tijek** | Korisnik otvara tuđu javnu stranicu i pregledava profil i popis javnih postova vlasnika. |
| **Alternativni tokovi / Iznimke** | Stranica nema javnih postova → aplikacija prikazuje prazan popis uz odgovarajuću poruku. |
| **Posljedice (ishod)** | Korisnik je vidio profil i javne postove drugog korisnika. |

### UC-18: Upravljanje favoritima

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-27, F-28, F-29 |
| **Preduvjeti** | Korisnik je prijavljen; tuđa javna stranica ili post iz UC-17 dostupan je. |
| **Glavni tijek** | Korisnik dodaje tuđu javnu stranicu ili pojedini post u favorite, odnosno uklanja postojeću stavku, i pregledava popis svojih favorita. |
| **Posljedice (ishod)** | Popis favorita korisnika odražava izvedenu radnju. |

### UC-19: Preuzimanje ili uvoz tuđeg zapisa

| Element specifikacije | Opis |
| :--- | :--- |
| **Primarni akter** | Prijavljeni korisnik (A-02) |
| **Povezani zahtjevi** | F-30, F-31 |
| **Preduvjeti** | Tuđi javni post sa zvukovnim zapisom dostupan je (UC-17). |
| **Glavni uspješni tok** | 1. Korisnik odabire preuzimanje zapisa s tuđeg posta na svoje računalo.<br>2. Aplikacija isporučuje datoteku korisniku za preuzimanje. |
| **Alternativni tokovi / Iznimke** | **1a — Dodavanje u radnu okolinu umjesto preuzimanja (F-31):** korisnik umjesto preuzimanja odabire dodavanje zapisa u vlastitu radnu okolinu; aplikacija sprema kopiju zapisa u odabrani direktorij korisnika. |
| **Posljedice (ishod)** | Korisnik ima lokalnu kopiju zapisa ili je zapis dodan u njegovu radnu okolinu, prema odabranoj radnji. |

## 3.3 Provjera dosljednosti obrazaca uporabe

**Cilj:** Provjeriti međusobnu usklađenost obrazaca uporabe, aktera, zahtjeva i ispitnih slučajeva. Cjelovito mapiranje održava se isključivo u **[matrici sljedivosti zahtjeva](2-Analiza-zahtjeva.md#26-sljedivost-zahtjeva)**; tablica ispod je pregled pokrivenosti za provjeru dosljednosti, a ne druga trajna matrica.

| Broj obrasca uporabe | Naziv obrasca uporabe | Obuhvaćeni funkcijski/domenski zahtjevi |
| --- | --- | --- |
| UC-01 | Prijava u sustav | F-01, F-02, F-03 |
| UC-02 | Upravljanje datotekama i direktorijima | F-07, F-08, F-09, F-10 |
| UC-03 | Uvoz zvukovnog zapisa (upload) | F-04 |
| UC-04 | Uvoz zapisa s Freesounda | F-05 |
| UC-05 | Izvoz zvukovnog zapisa (download) | F-06 |
| UC-06 | Generiranje zvukovnog zapisa oscilatorom | F-11, F-12, D-03, D-05 |
| UC-07 | Primjena filtra na zapis | F-13, F-14, F-15, F-16, F-17 |
| UC-07a | Odabir spremanja rezultata | F-18 |
| UC-08 | Niskopropusni filtar (low-pass) | F-13, D-04 |
| UC-09 | Visokopropusni filtar (high-pass) | F-14, D-04 |
| UC-10 | Pojačanje (gain) | F-15 |
| UC-11 | Reverb | F-16 |
| UC-12 | Tremolo | F-17 |
| UC-13 | Preslušavanje zapisa i prikaz waveforma | F-19, F-20 |
| UC-14 | Uređivanje profila javne stranice | F-21 |
| UC-15 | Objava posta | F-22 |
| UC-16 | Upravljanje postovima | F-23, F-24, F-25 |
| UC-17 | Pregled tuđe javne stranice | F-26 |
| UC-18 | Upravljanje favoritima | F-27, F-28, F-29 |
| UC-19 | Preuzimanje ili uvoz tuđeg zapisa | F-30, F-31 |

Nefunkcijski zahtjevi NF-01 do NF-11 presijecaju više obrazaca uporabe ili ne opisuju korisničku interakciju (npr. NF-09, NF-10 vezani su uz UC-01, dok NF-05 do NF-08 vrijede za aplikaciju u cjelini); njihovo mapiranje vodi se u [2.6 Sljedivost zahtjeva](2-Analiza-zahtjeva.md#26-sljedivost-zahtjeva), a ne u ovoj tablici.

| Provjera | Pitanje za tim |
| --- | --- |
| Zahtjev | Je li svaki važan obrazac uporabe povezan s postojećim zahtjevom? |
| Akter | Odgovara li akter naveden ovdje prethodno utvrđenoj ulozi i dopuštenoj interakciji? |
| Aplikacija | Može li tim demonstrirati opisani glavni rezultat i važnu alternativu ili je opis jasno označen kao trenutačno oblikovanje? |

Povezivanje zahtjev → obrazac uporabe → ispitivanje održava se **samo jednom, u [tablici sljedivosti zahtjeva](./2-Analiza-zahtjeva.md#26-sljedivost-zahtjeva)**. Ovdje se ne vodi druga projektna tablica mapiranja ni stupac sa statusom implementacije.

---

## Rječnik pojmova

- **Radna okolina** — privatni prostor prijavljenog korisnika u kojem uvozi, generira, organizira u direktorije, obrađuje i preslušava svoje zvukovne zapise; vidljiv je samo vlasniku.
- **Javna stranica** — profil prijavljenog korisnika vidljiv svim prijavljenim korisnicima, s korisničkim imenom, slikom, kratkim opisom i popisom postova; uređuje je samo vlasnik.
- **Post** — objava na javnoj stranici koja povezuje jedan zvukovni zapis iz radne okoline vlasnika s tekstualnim opisom i oznakom vidljivosti (javan ili privatan).
- **Filtar** — postupak obrade zvukovnog zapisa koji mijenja njegov sadržaj prema zadanim parametrima (niskopropusni filtar, visokopropusni filtar, pojačanje, reverb, tremolo); rezultat se sprema kao nova datoteka ili zamjenjuje original.
- **Waveform (valni oblik)** — grafički prikaz amplitude zvukovnog zapisa kroz vrijeme (vremenska domena), prikazan tijekom preslušavanja.
- **Favorit** — stranica ili post drugog korisnika koji je korisnik označio radi lakšeg pronalaženja; ne mijenja vidljivost ni sadržaj izvorne stranice ili posta.
- **OAuth 2.0 / OpenID Connect (OIDC)** — protokoli kojima vanjski pružatelj identiteta provodi autentifikaciju korisnika umjesto da aplikacija sama čuva lozinke.
- **Freesound** — vanjska usluga (API) sa zbirkom zvukovnih zapisa koju aplikacija koristi za pretragu i uvoz zapisa u radnu okolinu korisnika.

---

**Završna provjera:** Dijagram, specifikacije obrazaca uporabe i matrica sljedivosti međusobno su usklađeni. Svaki važan obrazac uporabe povezan je s postojećim zahtjevom, akteri odgovaraju stvarnim ulogama u aplikaciji, a opisani glavni i alternativni tijekovi odgovaraju ponašanju koje sustav stvarno podržava.
