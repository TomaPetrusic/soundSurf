# 2. Analiza zahtjeva


Zahtjevi su izvedeni iz opisa teme ProAudio (vidi [1. Opseg projekta](1-Projekt.md)) i iz obaveznih pravila kolegija. Svaki zahtjev ima stabilan ID, prioritet, izvor i, za funkcijske zahtjeve, razvojni ciklus u kojem je planiran:

- **Izvor** je jedan od: **Opis teme** (izravno iz projektnog zadatka), **Pravila kolegija** (obavezni zahtjevi kolegija koji ne proizlaze iz teme, npr. GitHub, dokumentacija, OO oblikovanje) ili **Tim** (odluka ili pretpostavka tima koja razrađuje opis teme).
- **Ciklus** razlikuje **1. ciklus** (predaja 20. 11. 2026.: prijava, osnovna radna okolina, barem jedan filtar, preslušavanje i waveform, deploy) od **2. ciklus** (preostala funkcionalnost: generiranje zvuka, ostali filtri, javna stranica, postovi, favoriti).
- Vrijednosti označene s *(pretpostavka – potvrditi s timom)* nisu dogovorene s nastavnikom/asistentom i tim ih treba potvrditi ili prilagoditi.

## 2.1 Funkcijski zahtjevi

**Cilj:** Navesti što aplikacija mora omogućiti korisnicima, odakle pojedina mogućnost proizlazi i koji se opažljivi rezultat smatra prihvaćanjem.

### Autentifikacija i korisnički račun

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja | Ciklus | Povezani UC |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | Korisnik se prijavljuje u sustav putem vanjskog pružatelja identiteta koristeći protokol OAuth 2.0 / OpenID Connect. | Visok | Opis teme | Nakon uspješne autorizacije kod vanjskog pružatelja identiteta korisnik je prijavljen u aplikaciju i ima pristup radnjama rezerviranima za prijavljene korisnike; odustajanje od prijave te radnje ostavlja nedostupnima. | 1 | UC-01 |
| F-02 | Pri prvoj uspješnoj prijavi korisnika sustav stvara njegov korisnički račun i radnu okolinu s tri početna zvukovna zapisa. | Visok | Opis teme | Nakon prve prijave novog korisnika njegova radna okolina sadrži točno tri zvukovna zapisa dostupna za preslušavanje i obradu. | 1 | UC-01 |
| F-03 | Prijavljeni korisnik se odjavljuje iz sustava. | Visok | Opis teme | Nakon odjave korisnik gubi pristup radnjama rezerviranima za prijavljene korisnike dok se ponovno ne prijavi. | 1 | UC-01 |

### Radna okolina – datoteke i direktoriji

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja | Ciklus | Povezani UC |
| --- | --- | --- | --- | --- | --- | --- |
| F-04 | Korisnik učitava (upload) zvukovnu datoteku u radnu okolinu u formatu WAV, MP3 ili FLAC. | Visok | Opis teme | Datoteka u jednom od tri podržana formata uspješno se učitava i pojavljuje u odabranom direktoriju radne okoline; datoteka nepodržanog formata se odbija uz objašnjenje. | 1 | UC-03 |
| F-05 | Korisnik pretražuje Freesound i uvozi odabrani zvukovni zapis izravno u svoju radnu okolinu. | Srednji | Opis teme | Nakon odabira rezultata pretrage s Freesounda, odgovarajući zvukovni zapis pojavljuje se u radnoj okolini korisnika spreman za preslušavanje i obradu. | 2 | UC-04 |
| F-06 | Korisnik preuzima (download) zvukovnu datoteku iz radne okoline u formatu WAV, MP3 ili FLAC. | Visok | Opis teme | Preuzeta datoteka otvara se u vanjskom programu i sadržajno odgovara zapisu iz radne okoline u odabranom formatu. | 1 | UC-05 |
| F-07 | Korisnik stvara, organizira u stablo i pregledava direktorije unutar svoje radne okoline. | Visok | Opis teme | Novi direktorij pojavljuje se na odabranom mjestu u stablu; korisnik može proširivati i pregledavati podstablo direktorija i datoteka. | 1 | UC-02 |
| F-08 | Korisnik imenuje i preimenuje datoteke i direktorije u radnoj okolini. | Visok | Opis teme | Nakon preimenovanja novi naziv prikazuje se na svim mjestima gdje se datoteka ili direktorij navodi; preimenovanje u naziv koji već postoji u istom direktoriju odbija se uz objašnjenje. | 2 | UC-02 |
| F-09 | Korisnik premješta datoteku u drugi direktorij unutar svoje radne okoline. | Srednji | Tim | Nakon premještanja datoteka se pojavljuje samo u odredišnom direktoriju i više nije dostupna u izvornom. | 2 | UC-02 |
| F-10 | Korisnik briše datoteku ili direktorij iz radne okoline. | Visok | Opis teme | Nakon brisanja datoteka ili direktorij (sa svim podacima koje sadrži) više nije dostupan u radnoj okolini korisnika. | 2 | UC-02 |

### Generiranje zvuka

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja | Ciklus | Povezani UC |
| --- | --- | --- | --- | --- | --- | --- |
| F-11 | Korisnik generira zvukovni zapis odabirom oblika oscilatora (sinus, kvadrat, pila ili trokut) te zadavanjem frekvencije, trajanja i amplitude signala. | Visok | Opis teme | Za odabrani oblik vala i zadane parametre sustav generira zapis čije trajanje odgovara zadanom; neispravna vrijednost parametra (npr. negativno trajanje) odbija se uz objašnjenje. | 2 | UC-06 |
| F-12 | Sustav sprema generirani zvukovni zapis kao novu datoteku u direktoriju koji korisnik odabere u radnoj okolini. | Visok | Opis teme | Nakon generiranja nova datoteka pojavljuje se u odabranom direktoriju i može se preslušati. | 2 | UC-06 |

### Obrada i reprodukcija

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja | Ciklus | Povezani UC |
| --- | --- | --- | --- | --- | --- | --- |
| F-13 | Korisnik primjenjuje niskopropusni (low-pass) filtar na zvukovni zapis uz podesivu graničnu frekvenciju. | Visok | Opis teme | Rezultirajući zapis sadrži znatno manji udio sastavnica iznad zadane granične frekvencije u odnosu na izvorni zapis. | 1 | UC-07, UC-08 |
| F-14 | Korisnik primjenjuje visokopropusni (high-pass) filtar na zvukovni zapis uz podesivu graničnu frekvenciju. | Visok | Opis teme | Rezultirajući zapis sadrži znatno manji udio sastavnica ispod zadane granične frekvencije u odnosu na izvorni zapis. | 2 | UC-07, UC-09 |
| F-15 | Korisnik primjenjuje filtar pojačanja (gain / amplify) na zvukovni zapis uz podesiv faktor pojačanja. | Visok | Opis teme | Amplituda rezultirajućeg zapisa razmjerno je promijenjena prema zadanom faktoru pojačanja u odnosu na izvorni zapis. | 2 | UC-07, UC-10 |
| F-16 | Korisnik primjenjuje reverb efekt na zvukovni zapis uz podesive parametre (npr. vrijeme odziva i udio efekta). | Srednji | Opis teme | Rezultirajući zapis sadrži čujni odjek čije trajanje i intenzitet odgovaraju zadanim parametrima. | 2 | UC-07, UC-11 |
| F-17 | Korisnik primjenjuje tremolo efekt na zvukovni zapis uz podesive parametre (brzina i dubina modulacije). | Srednji | Opis teme | Amplituda rezultirajućeg zapisa periodički se mijenja brzinom i dubinom koje odgovaraju zadanim parametrima. | 2 | UC-07, UC-12 |
| F-18 | Korisnik pri primjeni filtra bira hoće li rezultat spremiti kao novu datoteku ili prepisati izvornu datoteku. | Visok | Opis teme | Odabirom "nova datoteka" izvorna datoteka ostaje nepromijenjena i nastaje nova; odabirom "prepisivanje" sadržaj izvorne datoteke zamjenjuje se obrađenim zapisom. | 1 | UC-07a |
| F-19 | Korisnik preslušava (reproducira) zvukovni zapis iz radne okoline unutar web-preglednika. | Visok | Opis teme | Odabrani zapis se reproducira s mogućnošću pokretanja, pauziranja i promjene položaja reprodukcije. | 1 | UC-13 |
| F-20 | Sustav prikazuje valni oblik (waveform) zvukovnog zapisa u vremenskoj domeni tijekom preslušavanja. | Visok | Opis teme | Prikazani valni oblik odgovara amplitudi zapisa kroz vrijeme, a trenutačni položaj reprodukcije vidljiv je na prikazu. | 1 | UC-13 |

### Javna stranica i postovi

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja | Ciklus | Povezani UC |
| --- | --- | --- | --- | --- | --- | --- |
| F-21 | Korisnik uređuje podatke svoje javne stranice: korisničko ime, profilnu sliku i kratki opis. | Visok | Opis teme | Nakon spremanja promjena, nova vrijednost korisničkog imena, slike ili opisa prikazuje se na javnoj stranici korisnika. | 2 | UC-14 |
| F-22 | Korisnik objavljuje post odabirom zvukovnog zapisa iz svoje radne okoline i unosom tekstualnog opisa. | Visok | Opis teme | Nakon objave post se prikazuje na javnoj stranici korisnika sa zadanim zvukovnim zapisom i tekstualnim opisom. | 2 | UC-15 |
| F-23 | Korisnik uređuje tekstualni opis postojećeg posta. | Srednji | Opis teme | Nakon spremanja izmjene, javna stranica prikazuje izmijenjeni tekstualni opis posta. | 2 | UC-16 |
| F-24 | Korisnik označava post kao javni ili privatni. | Visok | Opis teme | Post označen kao privatan prestaje biti vidljiv drugim korisnicima na javnoj stranici; post označen kao javan ponovno im je vidljiv. | 2 | UC-16 |
| F-25 | Korisnik briše post sa svoje javne stranice. | Srednji | Opis teme | Nakon brisanja post se ne prikazuje na javnoj stranici korisnika ni na popisu favorita drugih korisnika. | 2 | UC-16 |

### Favoriti i preuzimanje tuđih zapisa

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja | Ciklus | Povezani UC |
| --- | --- | --- | --- | --- | --- | --- |
| F-26 | Prijavljeni korisnik pregledava javnu stranicu drugog prijavljenog korisnika i na njoj vidi samo postove koje je vlasnik označio kao javne. | Visok | Opis teme | Na tuđoj javnoj stranici prikazuju se korisničko ime, slika, opis i popis javnih postova; privatni postovi vlasnika se ne prikazuju. | 2 | UC-17 |
| F-27 | Korisnik dodaje tuđu javnu stranicu u favorite. | Srednji | Opis teme | Stranica dodana u favorite pojavljuje se na popisu favorita korisnika. | 2 | UC-18 |
| F-28 | Korisnik dodaje pojedini tuđi javni post u favorite. | Srednji | Opis teme | Post dodan u favorite pojavljuje se na popisu favorita korisnika. | 2 | UC-18 |
| F-29 | Korisnik uklanja stranicu ili post iz favorita i pregledava popis svojih favorita. | Srednji | Opis teme | Nakon uklanjanja, stavka se ne prikazuje na popisu favorita; preostale stavke i dalje su dostupne na popisu. | 2 | UC-18 |
| F-30 | Korisnik preuzima (download) zvukovni zapis s tuđeg javnog posta na svoje računalo. | Visok | Opis teme | Preuzeta datoteka sadržajno odgovara zvukovnom zapisu objavljenom u postu. | 2 | UC-19 |
| F-31 | Korisnik dodaje zvukovni zapis s tuđeg javnog posta u vlastitu radnu okolinu. | Srednji | Opis teme | Nakon dodavanja, kopija zapisa pojavljuje se u radnoj okolini korisnika i može se dalje obrađivati neovisno o izvornom postu. | 2 | UC-19 |

## 2.2 Nefunkcijski i domenski zahtjevi

**Cilj:** Odrediti važna svojstva kvalitete i uvjete rada aplikacije (nefunkcijski zahtjevi) te pravila specifična za domenu obrade zvuka (domenski zahtjevi), na način koji tim može razumno provjeriti.

### Nefunkcionalni zahtjevi

| ID | Opis | Prioritet | Izvor | Način provjere | Ciklus |
| --- | --- | --- | --- | --- | --- |
| NF-01 | Sustav mora podržati učitavanje zvukovne datoteke veličine do 50 MB *(pretpostavka – potvrditi s timom)*. | Srednji | Tim | Pokušati učitati datoteku veličine unutar i iznad granice te provjeriti da se datoteka iznad granice odbija uz objašnjenje. | 1 |
| NF-02 | Primjena jednog filtra na WAV zapis u trajanju do 3 minute traje manje od 5 sekundi na prosječnom prijenosnom računalu *(pretpostavka – potvrditi s timom)*. | Srednji | Tim | Mjerenje vremena izvođenja primjene filtra na referentnom zapisu i računalu. | 1 |
| NF-03 | Privatnoj radnoj okolini i privatnim postovima korisnika ne može pristupiti nijedan drugi korisnik, ni izravnim zahtjevom na adresu resursa. | Visok | Opis teme | Pokušati pristupiti tuđem privatnom resursu izravnim zahtjevom bez odgovarajućih ovlasti i provjeriti da sustav pristup odbija. | 1 |
| NF-04 | Web-sučelje mora korektno raditi u zadnje dvije objavljene inačice preglednika Google Chrome i Mozilla Firefox *(pretpostavka – potvrditi s timom)*. | Srednji | Tim | Ručno provjeriti glavne korisničke tijekove u navedenim preglednicima i inačicama. | 2 |
| NF-05 | Sva komunikacija između klijenta i poslužitelja mora biti šifrirana protokolom HTTPS. | Visok | Pravila kolegija | Pregled mrežnog promatrača preglednika i konfiguracije poslužitelja na javnoj adresi. | 1 |
| NF-06 | Izvorni kod i dokumentacija projekta razvijaju se kontinuirano u zajedničkom GitHub repozitoriju tijekom cijelog semestra. | Visok | Pravila kolegija | Pregled povijesti commitova i zahtjeva za uključivanje promjena (PR) kroz semestar. | 1–2 |
| NF-07 | Projektna dokumentacija u `docs/` mora odražavati stvarno stanje aplikacije i ažurirati se pri svakoj značajnijoj promjeni zahtjeva ili arhitekture. | Visok | Pravila kolegija | Usporedba dokumentacije s pokrenutom aplikacijom na kontrolnim točkama iz [2.7 Pregled zahtjeva](#27-pregled-zahtjeva). | 1–2 |
| NF-08 | Aplikacija mora biti dostupna na javno dostupnoj mrežnoj adresi tijekom cijelog razdoblja ocjenjivanja projekta. | Visok | Pravila kolegija | Pristup javnoj adresi i provjera osnovnih funkcionalnosti bez lokalnog postavljanja. | 1 |
| NF-09 | Prijava u sustav ostvaruje se isključivo putem vanjskog pružatelja identiteta koji podržava OAuth 2.0 ili OpenID Connect; sustav ne implementira vlastiti mehanizam lozinke. | Visok | Opis teme | Pregled implementacije prijave; pokušaj pristupa zaštićenom resursu bez valjanog tokena pružatelja identiteta mora biti odbijen. | 1 |
| NF-10 | Sustav ne pohranjuje lozinku korisnika niti je prima od vanjskog pružatelja identiteta; autentifikacijski podaci ostaju isključivo kod pružatelja identiteta. | Visok | Pravila kolegija | Pregled podatkovnog modela korisnika i razmijenjenih OAuth/OIDC poruka. | 1 |
| NF-11 | Integracija s Freesound API-jem mora poštivati njegove uvjete korištenja i ograničenje broja zahtjeva (rate limit) te razumljivo obraditi odbijen zahtjev. | Srednji | Opis teme | Pregled implementacije prema dokumentaciji Freesound API-ja; simulacija odbijenog zahtjeva (npr. prekoračen rate limit) i provjera poruke korisniku. | 2 |

### Domenski zahtjevi

| ID | Opis | Prioritet | Izvor | Način provjere | Ciklus |
| --- | --- | --- | --- | --- | --- |
| D-01 | Pri izvozu zvukovnog zapisa sustav čuva izvorni broj kanala i sample rate zapisa, osim ako korisnik izričito odabere drugačije postavke izvoza. | Srednji | Tim | Izvesti zapis bez promjene postavki i usporediti sample rate i broj kanala ulazne i izlazne datoteke. | 2 |
| D-02 | Pretvorba zapisa u MP3 format tijekom izvoza ili uvoza uzrokuje gubitak kvalitete zbog gubitničke komprecije; sustav o tome obavještava korisnika prije potvrde pretvorbe. | Srednji | Tim | Pretvoriti WAV zapis u MP3 i provjeriti prikazuje li se upozorenje prije potvrde radnje. | 2 |
| D-03 | Maksimalno trajanje jednog zvukovnog zapisa u radnoj okolini je 10 minuta *(pretpostavka – potvrditi s timom)*. | Nizak | Tim | Pokušati učitati ili generirati zapis dulji od ograničenja i provjeriti odbijanje uz objašnjenje. | 2 |
| D-04 | Granična frekvencija niskopropusnog i visokopropusnog filtra mora biti unutar čujnog frekvencijskog raspona, od 20 Hz do 20 000 Hz. | Visok | Tim | Pokušati unijeti vrijednost izvan raspona i provjeriti da je sustav odbija ili ograničava na rub raspona. | 2 |
| D-05 | Amplituda generiranog oscilatora ne može prelaziti najveću dopuštenu vrijednost signala (0 dBFS); sustav sprječava postavke koje bi uzrokovale klipiranje (izobličenje) generiranog zapisa. | Srednji | Tim | Pokušati postaviti amplitudu iznad dopuštene granice i provjeriti da sustav vrijednost ograničava ili zahtjev odbija. | 2 |

## 2.3 Dionici i akteri

**Cilj:** Utvrditi uloge koje utječu na zahtjeve i razlikovati dionike od aktera koji komuniciraju s aplikacijom.

| ID uloge ili aktera | Odnos prema sustavu | Relevantni zahtjevi |
| --- | --- | --- |
| A-01 Neprijavljeni posjetitelj | Akter; dolazi na aplikaciju bez prijave. Prema opisu teme nema pristup radnoj okolini ni javnim stranicama i može jedino pokrenuti prijavu putem vanjskog pružatelja identiteta. | F-01 |
| A-02 Prijavljeni korisnik | Glavni akter sustava. Nakon prijave upravlja vlastitom radnom okolinom i javnom stranicom (kao vlasnik/autor) te pregledava tuđe javne stranice, preuzima tuđe zapise i upravlja favoritima (kao posjetitelj tuđe stranice). Riječ je o istoj ulozi u različitim kontekstima, ne o zasebnim akterima. | F-02 – F-31 |
| A-03 Vanjski pružatelj identiteta (OAuth 2.0 / OIDC) | Sekundarni akter (vanjski sustav). Provodi autentifikaciju korisnika pri prijavi i izdaje potvrdu identiteta koju aplikacija koristi za otvaranje sesije. | F-01; NF-09; NF-10 |
| A-04 Freesound API | Sekundarni akter (vanjski sustav). Na zahtjev korisnika isporučuje rezultate pretrage i zvukovne zapise za uvoz u radnu okolinu. | F-05; NF-11 |
| ST-01 Nastavnik / asistent kolegija | Dionik bez izravne interakcije s aplikacijom u ulozi krajnjeg korisnika; ocjenjuje ispunjava li rješenje zahtjeve projektnog zadatka i pravila dokumentiranja. | — |
| ST-02 Razvojni tim (G05.4) | Dionik bez izravne interakcije s aplikacijom u ulozi krajnjeg korisnika; odgovoran za izvedivost rješenja unutar trajanja semestra. | — |

## 2.4 Ograničenja i pretpostavke

**Cilj:** Zabilježiti projektno specifične granice i pretpostavke koje utječu na zahtjeve ili oblikovanje, zajedno s njihovim izvorom i praktičnom posljedicom.

| ID | Tip | Opis ograničenja ili pretpostavke | Izvor | Inženjerska posljedica / Provjera |
| --- | --- | --- | --- | --- |
| C-01 | Ograničenje | Prijava mora koristiti vanjskog pružatelja identiteta putem OAuth 2.0 / OIDC; sustav ne implementira vlastiti mehanizam registracije i prijave lozinkom. | Opis teme | Arhitektura mora predvidjeti OAuth klijent i sigurno rukovanje tokenima; UC-01 modelira pružatelja identiteta kao sekundarnog aktera (vidi [3. Obrasci uporabe](3-Obrasci-uporabe.md)). |
| C-02 | Ograničenje | Radna okolina mora podržavati uvoz i izvoz u najmanje tri formata: WAV, MP3 i FLAC. | Opis teme | Potrebna je mogućnost dekodiranja/kodiranja sva tri formata; testirati uvoz i izvoz svake kombinacije formata. |
| C-03 | Ograničenje | Sustav mora implementirati najmanje pet filtara/efekata: low-pass, high-pass, gain, reverb i tremolo. | Opis teme | Svaki filtar treba zasebno korisničko sučelje, parametre i ispitni slučaj; vidi F-13–F-17. |
| C-04 | Ograničenje | Objava, pregled tuđih stranica i favoriti dostupni su samo prijavljenim korisnicima; aplikacija nema javno dostupan pregled bez prijave. | Opis teme | Sve rute osim prijave zahtijevaju provjeru autentifikacije; vidi NF-03. |
| AS-01 | Pretpostavka | Svaki korisnik ima pristup internetskoj vezi i modernom web-pregledniku koji podržava Web Audio API. | Tim | Ručno provjeriti rad aplikacije u preglednicima i inačicama iz NF-04 prije završne predaje. |
| AS-02 | Pretpostavka | Konkretan vanjski pružatelj identiteta (npr. Google ili GitHub OAuth) bit će odabran pri odabiru tehnologija i neće se značajno mijenjati tijekom semestra. | Tim | Potvrditi odabir do kraja 1. ciklusa; svaku promjenu zabilježiti u [2.5 Značajne promjene zahtjeva](#25-značajne-promjene-zahtjeva). |
| AS-03 | Pretpostavka | Freesound API ostaje besplatno dostupan uz postojeći API ključ tijekom trajanja projekta i integracija nije obavezna za ispunjenje zadatka. | Tim | Provjeriti uvjete korištenja Freesound API-ja prije implementacije UC-04; ako integracija postane neizvediva, F-05 i NF-11 premještaju se u [Izvan opsega / moguća proširenja](#izvan-opsega--moguća-proširenja). |

## 2.5 Značajne promjene zahtjeva

**Cilj:** Sačuvati razlog promjena koje mijenjaju dogovoreni opseg, prioritet ili kriterije prihvaćanja, uz istodobno održavanje prethodnih zahtjeva ažurnima.

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
| — | — | Nema zabilježenih značajnih promjena od izrade ove inačice dokumenta (21.10.2026.). | — |

## 2.6 Sljedivost zahtjeva

**Cilj:** Osigurati dvosmjernu sljedivost — povezati zahtjeve s opisanim ponašanjem, dijelovima sustava koji ih ostvaruju te ispitivanjem ili drugom provjerom.

Arhitektura i ispitni slučajevi još nisu izrađeni (vidi [4. Arhitektura i oblikovanje](4-Arhitektura-i-oblikovanje.md) i [5. Ispitivanje](5-Ispitivanje.md)), pa su ti stupci označeni kao *na čekanju* i popunit će se kada ti dijelovi dokumentacije nastanu.

| ID zahtjeva | Obrazac uporabe / modul | Arhitekturna realizacija | Ispitivanje ili provjera |
| --- | --- | --- | --- |
| F-01 | UC-01 Prijava u sustav | na čekanju | na čekanju |
| F-02 | UC-01 Prijava u sustav | na čekanju | na čekanju |
| F-03 | UC-01 Prijava u sustav | na čekanju | na čekanju |
| F-04 | UC-03 Uvoz zvukovnog zapisa (upload) | na čekanju | na čekanju |
| F-05 | UC-04 Uvoz zapisa s Freesounda | na čekanju | na čekanju |
| F-06 | UC-05 Izvoz zvukovnog zapisa (download) | na čekanju | na čekanju |
| F-07 | UC-02 Upravljanje datotekama i direktorijima | na čekanju | na čekanju |
| F-08 | UC-02 Upravljanje datotekama i direktorijima | na čekanju | na čekanju |
| F-09 | UC-02 Upravljanje datotekama i direktorijima | na čekanju | na čekanju |
| F-10 | UC-02 Upravljanje datotekama i direktorijima | na čekanju | na čekanju |
| F-11 | UC-06 Generiranje zvukovnog zapisa | na čekanju | na čekanju |
| F-12 | UC-06 Generiranje zvukovnog zapisa | na čekanju | na čekanju |
| F-13 | UC-07 Primjena filtra; UC-08 Low-pass | na čekanju | na čekanju |
| F-14 | UC-07 Primjena filtra; UC-09 High-pass | na čekanju | na čekanju |
| F-15 | UC-07 Primjena filtra; UC-10 Gain | na čekanju | na čekanju |
| F-16 | UC-07 Primjena filtra; UC-11 Reverb | na čekanju | na čekanju |
| F-17 | UC-07 Primjena filtra; UC-12 Tremolo | na čekanju | na čekanju |
| F-18 | UC-07a Odabir spremanja | na čekanju | na čekanju |
| F-19 | UC-13 Preslušavanje i waveform | na čekanju | na čekanju |
| F-20 | UC-13 Preslušavanje i waveform | na čekanju | na čekanju |
| F-21 | UC-14 Uređivanje profila javne stranice | na čekanju | na čekanju |
| F-22 | UC-15 Objava posta | na čekanju | na čekanju |
| F-23 | UC-16 Upravljanje postovima | na čekanju | na čekanju |
| F-24 | UC-16 Upravljanje postovima | na čekanju | na čekanju |
| F-25 | UC-16 Upravljanje postovima | na čekanju | na čekanju |
| F-26 | UC-17 Pregled tuđe javne stranice | na čekanju | na čekanju |
| F-27 | UC-18 Upravljanje favoritima | na čekanju | na čekanju |
| F-28 | UC-18 Upravljanje favoritima | na čekanju | na čekanju |
| F-29 | UC-18 Upravljanje favoritima | na čekanju | na čekanju |
| F-30 | UC-19 Preuzimanje ili uvoz tuđeg zapisa | na čekanju | na čekanju |
| F-31 | UC-19 Preuzimanje ili uvoz tuđeg zapisa | na čekanju | na čekanju |
| NF-01 | Ne odnosi se na pojedinačnu korisničku interakciju (UC-03/UC-04) | na čekanju | na čekanju |
| NF-02 | Ne odnosi se na pojedinačnu korisničku interakciju (UC-07) | na čekanju | na čekanju |
| NF-03 | Ne odnosi se na pojedinačnu korisničku interakciju; presijeca sve UC nad privatnim resursima | na čekanju | na čekanju |
| NF-04 | Ne odnosi se na pojedinačnu korisničku interakciju; presijeca sve UC | na čekanju | na čekanju |
| NF-05 | Ne odnosi se na pojedinačnu korisničku interakciju; presijeca sve UC | na čekanju | na čekanju |
| NF-06 | Ne opisuje korisničku interakciju; proces razvoja | — | — |
| NF-07 | Ne opisuje korisničku interakciju; proces dokumentiranja | — | — |
| NF-08 | Ne opisuje korisničku interakciju; postavljanje sustava | na čekanju | na čekanju |
| NF-09 | UC-01 Prijava u sustav | na čekanju | na čekanju |
| NF-10 | UC-01 Prijava u sustav | na čekanju | na čekanju |
| NF-11 | UC-04 Uvoz zapisa s Freesounda | na čekanju | na čekanju |
| D-01 | UC-05 Izvoz zvukovnog zapisa (download) | na čekanju | na čekanju |
| D-02 | UC-03/UC-05 Uvoz i izvoz zvukovnog zapisa | na čekanju | na čekanju |
| D-03 | UC-03 Uvoz; UC-06 Generiranje | na čekanju | na čekanju |
| D-04 | UC-08 Low-pass; UC-09 High-pass | na čekanju | na čekanju |
| D-05 | UC-06 Generiranje zvukovnog zapisa | na čekanju | na čekanju |

## 2.7 Pregled zahtjeva

**Cilj:** Zabilježiti važne povratne informacije o zahtjevima i odluke koje iz njih proizlaze na formalnim kontrolnim točkama projekta.

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 | – (kontrolna točka još nije održana) | – |
| Demo 2 | – (kontrolna točka još nije održana) | – |
| Završni pregled | – (kontrolna točka još nije održana) | – |

---

## Izvan opsega / moguća proširenja

**Cilj:** Odvojiti ideje koje imaju smisla za ProAudio, ali nisu dio opisa teme, pravila kolegija ni dogovorenog opsega (vidi i [1.3 Granice projekta](1-Projekt.md#13-granice-projekta) za već isključenu funkcionalnost poput snimanja mikrofonom, multitracka, komentara i mobilne aplikacije). Ovo nisu zahtjevi i tim ih ne implementira osim ako se opseg projekta izričito promijeni.

- Administratorska ili moderatorska uloga koja uklanja neprimjeren sadržaj s javnih stranica drugih korisnika.
- Pretraga javnih stranica, postova ili zvukovnih zapisa po ključnoj riječi, žanru ili oznaci.
- Praćenje ("follow") drugih korisnika uz obavijesti o njihovim novim postovima.
- Povijest izmjena (verzioniranje) obrađenog zapisa s mogućnošću poništavanja (undo) primijenjenog filtra.
- Zajednička obrada više datoteka odjednom (batch operacije) nad cijelim direktorijem.
- Javno dijeljenje pojedinog posta izvan platforme poveznicom vidljivom i neprijavljenim osobama.

---

>**Završna provjera:** Zahtjevi su aktualni, provjerljivi i povezani. Svaki važan zahtjev moguće je pratiti od njegova opisa i ponašanja preko mjesta realizacije u sustavu do odgovarajućeg ispitivanja ili druge provjere. Poveznice koriste stvarne identifikatore i nazive iz projektne dokumentacije.
