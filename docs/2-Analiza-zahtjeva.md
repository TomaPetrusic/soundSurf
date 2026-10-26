# 2. Analiza zahtjeva

Zahtjevi su izvedeni iz opisa teme ProAudio (vidi [1. Opseg projekta](1-Projekt.md)) i iz obaveznih pravila kolegija. Svaki zahtjev ima ID, prioritet i izvor.

## 2.1 Funkcijski zahtjevi



### Autentifikacija i korisnički račun

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-01 | Korisnik se prijavljuje u sustav putem vanjskog pružatelja identiteta koristeći protokol OAuth 2.0 / OpenID Connect. | Visok | Opis teme | Nakon uspješne autorizacije kod vanjskog pružatelja identiteta korisnik je prijavljen u aplikaciju i ima pristup radnjama rezerviranima za prijavljene korisnike; odustajanje od prijave te radnje ostavlja nedostupnima. |
| F-02 | Pri prvoj uspješnoj prijavi korisnika sustav stvara njegov korisnički račun i radnu okolinu s tri početna zvukovna zapisa. | Visok | Opis teme | Nakon prve prijave novog korisnika njegova radna okolina sadrži točno tri zvukovna zapisa dostupna za preslušavanje i obradu. |
| F-03 | Korisnik se odjavljuje iz sustava. | Visok | Opis teme | Nakon odjave korisnik gubi pristup radnjama rezerviranima za prijavljene korisnike dok se ponovno ne prijavi. |

### Radna okolina – datoteke i direktoriji

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-04 | Korisnik učitava (upload) zvukovnu datoteku u radnu okolinu u formatu WAV, MP3 ili FLAC. | Visok | Opis teme | Datoteka u jednom od tri podržana formata uspješno se učitava i pojavljuje u odabranom direktoriju radne okoline; datoteka nepodržanog formata se odbija uz objašnjenje. |
| F-05 | Korisnik pretražuje Freesound i uvozi odabrani zvukovni zapis izravno u svoju radnu okolinu. | Visok | Opis teme / Pravila kolegija | Nakon odabira rezultata pretrage s Freesounda, odgovarajući zvukovni zapis pojavljuje se u radnoj okolini korisnika spreman za preslušavanje i obradu. |
| F-06 | Korisnik preuzima (download) zvukovnu datoteku iz radne okoline u formatu WAV, MP3 ili FLAC. | Visok | Opis teme | Preuzeta datoteka otvara se u vanjskom programu i sadržajno odgovara zapisu iz radne okoline u odabranom formatu. |
| F-07 | Korisnik stvara direktorij unutar svoje radne okoline i pri stvaranju mu zadaje naziv. | Visok | Opis teme | Novi direktorij sa zadanim nazivom pojavljuje se na odabranom mjestu u stablu radne okoline; stvaranje direktorija s nazivom koji na istoj razini već postoji odbija se uz objašnjenje. |
| F-08 | Korisnik pregledava stablo direktorija i datoteka svoje radne okoline. | Visok | Opis teme | Korisnik može proširivati i pregledavati podstablo direktorija i datoteka radne okoline do bilo koje razine ugnježđenosti. |
| F-09 | Korisnik preimenuje datoteku ili direktorij u radnoj okolini. | Visok | Opis teme | Nakon preimenovanja novi naziv prikazuje se na svim mjestima gdje se datoteka ili direktorij navodi; preimenovanje u naziv koji već postoji u istom direktoriju odbija se uz objašnjenje. |
| F-10 | Korisnik premješta datoteku u drugi direktorij unutar svoje radne okoline. | Srednji | Tim | Nakon premještanja datoteka se pojavljuje samo u odredišnom direktoriju i više nije dostupna u izvornom. |
| F-11 | Korisnik briše datoteku ili direktorij iz radne okoline. | Visok | Opis teme | Nakon brisanja datoteka ili direktorij (sa svim podacima koje sadrži) više nije dostupan u radnoj okolini korisnika. |

### Generiranje zvuka

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-12 | Korisnik generira zvukovni zapis odabirom oblika oscilatora (sinus, kvadrat, pila ili trokut) te zadavanjem frekvencije, trajanja i amplitude signala. | Visok | Opis teme | Za odabrani oblik vala i zadane parametre sustav generira zapis čije trajanje odgovara zadanom; neispravna vrijednost parametra (npr. negativno trajanje) odbija se uz objašnjenje. |
| F-13 | Sustav sprema generirani zvukovni zapis kao novu datoteku u direktoriju koji korisnik odabere u radnoj okolini. | Visok | Opis teme | Nakon generiranja nova datoteka pojavljuje se u odabranom direktoriju i može se preslušati. |

### Obrada i reprodukcija

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-14 | Korisnik primjenjuje filtar na zvukovni zapis odabirom jedne od najmanje pet vrsta: niskopropusni (low-pass, podesiva granična frekvencija), visokopropusni (high-pass, podesiva granična frekvencija), pojačanje (gain, podesiv faktor pojačanja), reverb (podesivo vrijeme odziva i udio efekta) ili tremolo (podesiva brzina i dubina modulacije). | Visok | Opis teme | Za niskopropusni/visokopropusni rezultat sadrži znatno manji udio sastavnica iznad/ispod granične frekvencije; za pojačanje amplituda je razmjerno promijenjena prema faktoru; za reverb rezultat sadrži čujan odjek prema zadanim parametrima; za tremolo amplituda se periodički mijenja prema zadanim parametrima — u odnosu na izvorni zapis. |
| F-15 | Korisnik pri primjeni filtra bira hoće li rezultat spremiti kao novu datoteku ili prepisati izvornu datoteku. | Visok | Opis teme | Odabirom "nova datoteka" izvorna datoteka ostaje nepromijenjena i nastaje nova; odabirom "prepisivanje" sadržaj izvorne datoteke zamjenjuje se obrađenim zapisom. |
| F-16 | Korisnik preslušava (reproducira) zvukovni zapis iz radne okoline unutar web-preglednika. | Visok | Opis teme | Odabrani zapis se reproducira s mogućnošću pokretanja, pauziranja i promjene položaja reprodukcije. |
| F-17 | Sustav prikazuje valni oblik (waveform) zvukovnog zapisa u vremenskoj domeni tijekom preslušavanja. | Visok | Opis teme | Prikazani valni oblik odgovara amplitudi zapisa kroz vrijeme, a trenutačni položaj reprodukcije vidljiv je na prikazu. |

### Javna stranica i postovi

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-18 | Korisnik uređuje podatke svoje javne stranice: korisničko ime, profilnu sliku i kratki opis. | Visok | Opis teme | Nakon spremanja promjena, nova vrijednost korisničkog imena, slike ili opisa prikazuje se na javnoj stranici korisnika. |
| F-19 | Korisnik objavljuje post odabirom zvukovnog zapisa iz svoje radne okoline i unosom tekstualnog opisa. | Visok | Opis teme | Nakon objave post se prikazuje na javnoj stranici korisnika sa zadanim zvukovnim zapisom i tekstualnim opisom. |
| F-20 | Korisnik uređuje tekstualni opis postojećeg posta. | Visok | Opis teme | Nakon spremanja izmjene, javna stranica prikazuje izmijenjeni tekstualni opis posta. |
| F-21 | Korisnik označava post kao javni ili privatni. | Visok | Opis teme | Post označen kao privatan prestaje biti vidljiv drugim korisnicima na javnoj stranici; post označen kao javan ponovno im je vidljiv. |
| F-22 | Korisnik briše post sa svoje javne stranice. | Visok | Opis teme | Nakon brisanja post se ne prikazuje na javnoj stranici korisnika ni na popisu favorita drugih korisnika. |

### Favoriti i preuzimanje tuđih zapisa

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-23 | Korisnik pregledava javnu stranicu drugog korisnika i na njoj vidi samo postove koje je vlasnik označio kao javne. | Visok | Opis teme | Na tuđoj javnoj stranici prikazuju se korisničko ime, slika, opis i popis javnih postova; privatni postovi vlasnika se ne prikazuju. |
| F-24 | Korisnik dodaje tuđu javnu stranicu u favorite. | Visok | Opis teme | Stranica dodana u favorite pojavljuje se na popisu favorita korisnika. |
| F-25 | Korisnik dodaje pojedini tuđi javni post u favorite. | Visok | Opis teme | Post dodan u favorite pojavljuje se na popisu favorita korisnika. |
| F-26 | Korisnik uklanja stranicu ili post iz favorita. | Visok | Opis teme | Nakon uklanjanja, stavka se ne prikazuje na popisu favorita korisnika. |
| F-27 | Korisnik pregledava popis svojih favorita (stranice i postove). | Visok | Opis teme | Popis prikazuje sve stranice i postove koje je korisnik prethodno dodao u favorite. |
| F-28 | Korisnik preuzima (download) zvukovni zapis s tuđeg javnog posta na svoje računalo. | Visok | Opis teme | Preuzeta datoteka sadržajno odgovara zvukovnom zapisu objavljenom u postu. |
| F-29 | Korisnik dodaje zvukovni zapis s tuđeg javnog posta u vlastitu radnu okolinu. | Visok | Opis teme | Nakon dodavanja, kopija zapisa pojavljuje se u radnoj okolini korisnika i može se dalje obrađivati neovisno o izvornom postu. |

## 2.2 Nefunkcijski i domenski zahtjevi


### Nefunkcijski zahtjevi

| ID | Opis | Prioritet | Izvor | Način provjere |
| --- | --- | --- | --- | --- |
| NF-01 | Sustav mora podržati učitavanje zvukovne datoteke veličine do 50 MB. | Srednji | Tim | Pokušati učitati datoteku veličine unutar i iznad granice te provjeriti da se datoteka iznad granice odbija uz objašnjenje. |
| NF-02 | Primjena jednog filtra na WAV zapis u trajanju do 3 minute traje manje od 5 sekundi. | Srednji | Tim | Mjerenje vremena izvođenja primjene filtra na javnom poslužitelju. |
| NF-03 | Privatnoj radnoj okolini i privatnim postovima korisnika ne može pristupiti nijedan drugi korisnik, ni izravnim zahtjevom na adresu resursa. | Visok | Opis teme | Pokušati pristupiti tuđem privatnom resursu izravnim zahtjevom bez odgovarajućih ovlasti i provjeriti da sustav pristup odbija. |
| NF-04 | Web-sučelje mora korektno raditi na Google Chrome-u i Mozilla Firefox-u. | Srednji | Tim | Ručno provjeriti glavne korisničke obrasce korištenja u navedenim preglednicima. |
| NF-05 | Aplikacija mora biti dostupna na javno dostupnoj mrežnoj adresi tijekom cijelog razdoblja ocjenjivanja projekta. | Visok | Pravila kolegija | Pristup javnoj adresi i provjera funkcionalnosti. |
| NF-06 | Sustav ne pohranjuje lozinku korisnika niti je prima od vanjskog pružatelja identiteta; autentifikacijski podaci ostaju isključivo kod pružatelja identiteta. | Visok | Tim | Pregled podatkovnog modela korisnika i razmijenjenih OAuth/OIDC poruka. |


## 2.3 Dionici i akteri

**Cilj:** Utvrditi uloge koje utječu na zahtjeve i razlikovati dionike od aktera koji komuniciraju s aplikacijom.

| ID uloge ili aktera | Odnos prema sustavu | Relevantni zahtjevi |
| --- | --- | --- |
| A-01 Posjetitelj | Neautenticirani korisnik, prema opisu teme nema pristup radnoj okolini ni javnim stranicama i može jedino pokrenuti prijavu putem vanjskog pružatelja identiteta. | F-01 |
| A-02 Korisnik | Glavni akter sustava, nakon uspješne prijave posjetitelj postaje korisnik i stječe sve mogućnosti upravljanja vlastitom radnom okolinom i javnom stranicom (kao vlasnik/autor) te pregleda tuđih javnih stranica, preuzimanja tuđih zapisa i upravljanja favoritima. | F-02 – F-29 |
| A-03 Vanjski pružatelj identiteta (OAuth 2.0 / OIDC) | Sekundarni akter (vanjski sustav). Provodi autentifikaciju korisnika pri prijavi i izdaje potvrdu identiteta koju aplikacija koristi za otvaranje sesije. | F-01; C-01; NF-09 |
| A-04 Freesound API | Sekundarni akter (vanjski sustav). Na zahtjev korisnika isporučuje rezultate pretrage i zvukovne zapise za uvoz u radnu okolinu; ispunjava obavezu barem jedne domenski relevantne vanjske integracije (vidi C-05). | F-05; NF-10 |

## 2.4 Ograničenja i pretpostavke

**Cilj:** Zabilježiti projektno specifične granice i pretpostavke koje utječu na zahtjeve ili oblikovanje, zajedno s njihovim izvorom i praktičnom posljedicom.

| ID | Tip | Opis ograničenja ili pretpostavke | Izvor | Inženjerska posljedica / Provjera |
| --- | --- | --- | --- | --- |
| C-01 | Ograničenje | Prijava mora koristiti vanjskog pružatelja identiteta putem OAuth 2.0 / OIDC; sustav ne implementira vlastiti mehanizam registracije i prijave lozinkom. | Opis teme | Arhitektura mora predvidjeti OAuth klijent i sigurno rukovanje tokenima. |
| C-02 | Ograničenje | Uvoz i izvoz moraju podržavati najmanje tri formata zapisa: WAV, MP3 i FLAC (vidi F-04, F-06). | Opis teme | Testirati uvoz i izvoz svake kombinacije formata. |
| C-03 | Ograničenje | Objava, pregled tuđih stranica i favoriti dostupni su samo prijavljenim korisnicima; aplikacija nema javno dostupan pregled bez prijave. | Opis teme | Sve rute osim prijave zahtijevaju provjeru autentifikacije. |
| C-04 | Ograničenje | Sustav mora imati barem jednu domenski relevantnu integraciju s vanjskom uslugom ovu obavezu ispunjava integracija s Freesound API-jem. | Pravila kolegija | Ovu obavezu ispunjava integracija s Freesound API-jem. |
| C-05 | Ograničenje | Izvorni kod i dokumentacija projekta razvijaju se kontinuirano u zajedničkom GitHub repozitoriju tijekom cijelog semestra. | Pravila kolegija | Redoviti commitovi i zahtjevi za uključivanje promjena kroz tijek kolegija |
| C-06 | Ograničenje | Projektna dokumentacija u `docs/` mora odražavati stvarno stanje aplikacije i ažurirati se pri svakoj značajnijoj promjeni zahtjeva ili arhitekture. | Pravila kolegija | Usporedba dokumentacije s pokrenutom aplikacijom. |
| AS-01 | Pretpostavka | Svaki korisnik ima pristup internetskoj vezi i modernom web-pregledniku koji podržava Web Audio API. | Tim | Ručno provjeriti rad aplikacije u preglednicima. |
| AS-02 | Pretpostavka | Konkretan vanjski pružatelj identiteta (npr. Google ili GitHub OAuth) bit će odabran pri odabiru tehnologija i neće se značajno mijenjati tijekom semestra. | Tim | Svaku promjenu zabilježiti u [2.5 Značajne promjene zahtjeva](#25-značajne-promjene-zahtjeva). |
| AS-03 | Pretpostavka | Freesound API ostaje besplatno dostupan uz postojeći API ključ tijekom trajanja projekta. | Tim | Provjeriti uvjete korištenja. |

## 2.5 Značajne promjene zahtjeva

Trenutno ne postoje.

## 2.6 Sljedivost zahtjeva

Arhitektura još nije dizajnirana pa tako logički slijed programiranja još ne može biti odlučen.

## 2.7 Pregled zahtjeva

**Cilj:** Zabilježiti važne povratne informacije o zahtjevima i odluke koje iz njih proizlaze na formalnim kontrolnim točkama projekta.

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 | – (kontrolna točka još nije održana) | – |
| Demo 2 | – (kontrolna točka još nije održana) | – |
| Završni pregled | – (kontrolna točka još nije održana) | – |

---

## Izvan opsega / moguća proširenja
ko se opseg projekta izričito promijeni.

- Administratorska ili moderatorska uloga koja uklanja neprimjeren sadržaj s javnih stranica drugih korisnika.
- Pretraga javnih stranica, postova ili zvukovnih zapisa po ključnoj riječi, žanru ili oznaci.
- Praćenje ("follow") drugih korisnika uz obavijesti o njihovim novim postovima.
- Povijest izmjena (verzioniranje) obrađenog zapisa s mogućnošću poništavanja (undo) primijenjenog filtra.
- Zajednička obrada više datoteka odjednom (batch operacije) nad cijelim direktorijem.
- Javno dijeljenje pojedinog posta izvan platforme poveznicom vidljivom i neprijavljenim osobama.
- Upozorenje u sučelju prije pretvorbe zapisa u MP3 format (razmatrano i uklonjeno iz domenskih zahtjeva, vidi 2.5).
- Generiranje zvuka odabirom sintetiziranog instrumenta (umjesto ili uz oscilator), eventualno uz UI za sviranje nota — opis teme navodi oscilator ili instrument kao primjere; oscilator (F-12, F-13) već ispunjava minimalni zahtjev.
