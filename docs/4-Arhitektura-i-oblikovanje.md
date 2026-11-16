# 4. Arhitektura i oblikovanje

**Cilj:** Definirati arhitekturni stil, dekompoziciju programa na podsustave i module, organizaciju podataka te dinamičko ponašanje tijekom izvođenja. Arhitektura predstavlja temelj za implementaciju i ažurira se pri svakoj važnijoj promjeni projektnih odluka.

| Arhitekturni pogled | Ključno inženjersko pitanje | Primijenjeni model ili dijagram |
| :--- | :--- | :--- |
| **Strategija rješenja** | Koji stil i temeljne odluke određuju program? | Tablica odluka (odjeljak 4.1) |
| **Struktura podsustava** | Koji su glavni dijelovi i kako komuniciraju? | Dijagram komponenata |
| **Model podataka** | Kako su strukturirani trajni podaci programa? | Relacijski ER dijagram |
| **Struktura koda** | Kako su dodijeljene odgovornosti i ključne klase? | Reprezentativni dijagram razreda |
| **Dinamičko ponašanje** | Kako moduli surađuju pri obradi ključnih transakcija? | sekvencijski dijagram |
| **Stanja sustava** | Kako ključni domenski objekt mijenja svoja stanja? | Dijagram stanja |
| **Fizički razmještaj** | Na kojim se izvršnim čvorovima program izvodi? | Dijagram razmještaja (poglavlje 6) |

---

Za svaki UML dijagram čuvajte čitljivu sliku i PlantUML izvor, kako je opisano na stranici [Home](./Home.md). U dovršenoj stranici koristite vlastite projektne odluke i modele.

## 4.1 Ključne arhitekturne odluke

| Odluka | Razmatrana alternativa | Projektno specifično obrazloženje i kompromis |
| --- | --- | --- |
| Web-klijent (React) i poslužiteljski API (Django REST) postavljaju se kao jedna aplikacija: jedna Docker slika na Railwayu, a Django poslužuje i izgrađeni klijent. | Zasebno postavljeni klijent i poslužiteljski sustav. | Jedna adresa i jedno postavljanje dovoljni su za opseg i veličinu tima, a u produkciji nema zahtjeva između različitih domena. Kompromis: klijent i poslužitelj uvijek se postavljaju zajedno, pa kvar tog servisa prekida cijelu aplikaciju. |
| Prijava preko Supabase Autha (Google, OAuth 2.0 / OpenID Connect); poslužitelj samo provjerava potpis pristupnog tokena i pri prvom zahtjevu stvara korisnički profil. | Vlastita registracija i prijava s lozinkama u Djangu. | Ispunjava F-01 i NF-06: aplikacija ne pohranjuje lozinke i ne mora sama provoditi njihovu zaštitu. Kompromis: prijava ovisi o dostupnosti vanjskog pružatelja identiteta. |
| Relacijska baza (Supabase PostgreSQL) kojoj pristupa isključivo poslužitelj preko Django ORM-a i migracija; na tablicama je uključen RLS bez pravila pristupa. | Klijent izravno čita i piše tablice preko Supabase klijenta, uz RLS pravila za svaku tablicu. | Pravila radne okoline (vlasništvo, jedinstven naziv u mapi, provjera formata) nalaze se na jednom mjestu i mogu se ispitati, a javni ključ iz klijenta ne daje pristup tablicama. Kompromis: svaki pristup podacima ide kroz poslužitelj, što znači više poslužiteljskog koda. |
| Audio sadržaj sprema se u privatni spremnik datoteka (Supabase Storage), a u bazi su samo metapodaci i ključ oblika `<supabase_user_id>/<nasumični uuid>.<ext>`. | Sadržaj u bazi podataka ili na disku poslužitelja. | Baza ostaje mala, a disk na Railwayu nije trajan. Ključ ne ovisi o nazivu ni mapi, pa preimenovanje i premještanje (F-09, F-10) ne diraju sadržaj. Kompromis: baza i spremnik nisu u istoj transakciji, pa poslužitelj sam briše sadržaj pri brisanju, a pri prepisivanju (F-15) koristi novi ključ i stari briše tek nakon uspjeha. |
| Mape i datoteke čuvaju se u jednoj tablici u kojoj svaka stavka pokazuje na nadređenu mapu. | Odvojene tablice za direktorije i datoteke. | Jedno pravilo jedinstvenosti naziva vrijedi za mape i datoteke na istoj razini (F-07, F-09), a premještanje i brisanje rade jednako za obje vrste (F-10, F-11). Kompromis: polja specifična za datoteke prazna su kod mapa, a da je nadređena stavka mapa istog korisnika provjerava poslužitelj, ne baza. |
| Filtri i generator zvuka izvode se u pregledniku (Web Audio API); poslužitelj sprema rezultat i pretvara format pri preuzimanju. | Obrada na poslužitelju uz privremeni pregled rezultata. | Rezultat se može odmah preslušati i poslužitelj nije opterećen računanjem (F-12–F-15). Kompromis: obrada ovisi o mogućnostima preglednika i cijeli zapis mora stati u njegovu memoriju; poslužitelj ipak provjerava format svakog spremljenog rezultata. |

## 4.2 Gradivni blokovi i UML dijagram komponenata

Arhitektura sustava soundSurf temelji se na razdvajanju korisničkog sučelja, poslužiteljske aplikacijske logike, podatkovnog modela i pohrane zvukovnog sadržaja.

UML dijagram komponenata prikazuje glavne dijelove sustava, njihove odgovornosti, međusobne ovisnosti i komunikaciju s vanjskim uslugama.

![UML dijagram komponenata sustava soundSurf](./assets/diagrams/4-1-soundsurf-komponente.svg)

**Slika 4.1. UML dijagram komponenata sustava soundSurf**

**PlantUML izvor:** [4-1-soundsurf-komponente.puml](./puml/4-1-soundsurf-komponente.puml)

### Glavne komponente

| Komponenta | Odgovornost | Razlog za odvajanje |
| --- | --- | --- |
| Web-klijent (React / Vite) | Korisničko sučelje, prijava, prikaz radne okoline, upravljanje datotekama i reprodukcija zvuka. | Odvajanje korisničke interakcije od poslužiteljske logike. |
| Web Audio modul | Generiranje zvuka i obrada zvukovnih zapisa u pregledniku. | Lokalna obrada omogućuje pregled rezultata bez dodatnog opterećenja poslužitelja. |
| Django REST API | Obrada zahtjeva, provjera autentifikacije i ovlasti te upravljanje resursima aplikacije. | Centralizacija poslovnih pravila i kontrole pristupa. |
| Django ORM | Upravljanje modelima `UserProfile`, `Workspace` i `Node`. | Odvajanje rada s podacima od API sloja. |
| Storage adapteri | Spremanje, dohvat, zamjena i uklanjanje zvukovnih datoteka. | Neovisnost aplikacijske logike o odabranom načinu pohrane. |
| Supabase Auth | OAuth prijava, korisničke sesije i izdavanje pristupnih tokena. | Autentifikacija se delegira specijaliziranoj vanjskoj usluzi. |
| PostgreSQL i spremište datoteka | Trajna pohrana metapodataka i sadržaja zvukovnih zapisa. | Odvajanje strukturiranih podataka od binarnog sadržaja. |

### Vanjske integracije

Google OAuth koristi se za potvrdu identiteta korisnika, dok Supabase Auth upravlja autentificiranom sesijom. Django provjerava pristupni token i ovlasti prije izvršavanja zaštićenih API operacija.

Freesound API predviđen je za pretraživanje i uvoz vanjskih zvukovnih zapisa. Integracija je dio planiranih funkcionalnosti.

### Stanje implementacije i planirana proširenja

Dijagram bojama razlikuje implementirane komponente, postojeće module s nedovršenom integracijom i planirane funkcionalnosti. Isprekidane veze označavaju planirane integracije ili ovisnosti.

U Web Audio modulu implementirani su generator oscilatora, niskopropusni i visokopropusni filtar. Niskopropusni filtar integriran je u korisničko sučelje i omogućuje spremanje rezultata. Visokopropusni filtar postoji u audio servisu, ali još nije povezan s korisničkim sučeljem.

Dodatni filtri (gain, reverb i tremolo), Freesound integracija te funkcionalnosti objava, javnih profila i favorita predstavljaju planirana proširenja.

Prikazane komponente predstavljaju logičke odgovornosti sustava. Njihova zasebna reprezentacija u dijagramu ne znači nužno da se izvršavaju kao samostalne poslužiteljske usluge.

## 4.3 Model podataka i oblikovanje razreda

### 4.3.1 ER dijagram i model podataka

Primjer: Ana se prvi put prijavljuje Google računom. Poslužitelj joj stvara korisnički profil, a pri prvom otvaranju radne okoline i zapis o radnoj okolini te mapu *Primjeri* s tri početna zvukovna zapisa (F-02). Ana zatim stvara mapu *Projekti* i u nju učitava datoteku *Bas linija.wav*. Mapa i datoteka su stavke radne okoline: datoteka pokazuje na mapu *Projekti* kao nadređenu stavku, a mapa *Projekti* nema nadređenu stavku jer je u korijenu. Bajtovi zvuka nisu u bazi; stavka datoteke čuva samo ključ pod kojim su spremljeni u Supabase Storageu.

![ER dijagram podataka sustava soundSurf](./assets/diagrams/4-2-soundsurf-podaci-ERD.svg)

### 4.3.2 Reprezentativni UML dijagram razreda

Dijagram prikazuje strukturu i odgovornosti razreda povezanih s korisničkim profilom, radnom okolinom, zvukovnim datotekama i pohranom sadržaja u sustavu soundSurf. Razlikuje stvarne Django modele i implementirane funkcije od konceptualnog domenskog modela i planiranih proširenja.

![UML dijagram razreda sustava soundSurf](./assets/diagrams/4-3-soundsurf-razredi-obrada.svg)

**Slika 4.3. Reprezentativni UML dijagram razreda sustava soundSurf**

**PlantUML izvor:** [4-3-soundsurf-razredi-obrada.puml](./puml/4-3-soundsurf-razredi-obrada.puml)

**Relevantna implementacija:** [modeli radne okoline](../backend/workspace/models.py), [inicijalizacija početnih zapisa](../backend/workspace/seed.py), [API pogledi](../backend/workspace/views.py), [servisne funkcije](../backend/workspace/services.py) i [spremišni adapteri](../backend/workspace/storage.py).

Model `UserProfile` predstavlja korisnika, dok model `Workspace` predstavlja njegovu radnu okolinu. Model `Node` koristi se za direktorije i datoteke, uz hijerarhiju roditeljskih stavki, metapodatke zvuka i oznaku porijekla sadržaja. Ne postoje zasebni Django modeli `Direktorij` i `ZvukovnaDatoteka`; oni su konceptualni prikaz različitih vrsta stavki.

Inicijalizacija radne okoline implementirana je funkcijom `ensure_workspace()` pri prvom dohvaćanju stabla. Sustav pokušava dodati do tri početna zvukovna zapisa, ovisno o njihovoj dostupnosti u spremištu.

`SupabaseStorage` i `LocalStorage` omogućuju spremanje, dohvat, uklanjanje i pristup zvukovnom sadržaju. Obrada niskopropusnim filtrom i spremanje rezultata postoje u aplikaciji, ali prikazane planirane servisne apstrakcije nisu zasebni implementirani Python razredi. Ostale vrste filtara predstavljaju planirana proširenja.

## 4.4 Ponašanje tijekom izvođenja

**Cilj:** Objasniti jednu važnu interakciju među dijelovima koji se izvode i životni ciklus jednog smislenog objekta. Odaberite primjere koji otkrivaju odluke ili neuspješne putove umjesto izrade dijagrama za svaku CRUD radnju.

### 4.4.1 Reprezentativni UML sekvencijski dijagram

**Cilj:** Prikazati redoslijed poruka za jedan reprezentativni scenarij i odgovore na važnu alternativu.

**Scenarij:** [Naziv interakcije; dodajte UC ID ako postoji.]  
**sekvencijski dijagram:** [Ugradite čitljiv UML sekvencijski dijagram.]  
**PlantUML izvor:** [Poveznica na odgovarajuću `.puml` datoteku.]

<details>
<summary><strong>Odabir lokacije, provjera valjanosti i podnošenje prijave</strong></summary>

**Primjer — CrisisMap:** Građanin podnosi prijavu kriznog događaja nakon što ručno odabere lokaciju ili zatraži položaj uređaja. Interakcija prikazuje i što se događa kada je pristup lokaciji odbijen, podaci prijave nisu valjani ili pohrana ne uspije.

![Sekvencijski dijagram podnošenja prijave kriznog događaja](./assets/diagrams/4-4-crisismap-report-submission-SD.svg)

**Slika 4.4. Sekvencijski dijagram podnošenja prijave kriznog događaja**

**PlantUML izvor:** [izvor](./puml/4-4-crisismap-report-submission-SD.puml)

**Analiza primjera:** Dva načina odabira lokacije te alternative provjere i pohrane imaju različite posljedice za korisnika; usporedite ih s odgovarajućim obrascem uporabe i njegovim alternativnim tijekovima. API preglednika za lokaciju mogućnost je preglednika; web-klijent, API, usluga i pohrana odgovaraju prikazu komponenata. Odaberite grane koje pomažu objasniti scenarij vašeg projekta i završni dijagram uskladite s implementiranom interakcijom.

</details>

### 4.4.2 Reprezentativni UML dijagram stanja

**Cilj:** Prikazati važna stanja jednog domenskog objekta ili eksplicitno upravljanog načina rada sustava te događaje ili uvjete koji ih mijenjaju.

**Vlasnik stanja i razlog odabira:** [Navedite objekt ili način rada sustava, kako se njegovo stanje prepoznaje i zašto su prijelazi važni.]  
**Dijagram stanja:** [Ugradite čitljiv UML dijagram stanja.]  
**PlantUML izvor:** [Poveznica na odgovarajuću `.puml` datoteku.]

<details>
<summary><strong>Složeno stanje sustava: koordinacija događaja i dostupnost usluge</strong></summary>

**Primjer — CrisisMap:** Ovaj primjer ne prikazuje životni ciklus jednog domenskog objekta, nego dva neovisna aspekta stanja cijelog sustava CrisisMap. Jedna regija opisuje način koordinacije kriznog događaja, a druga opaženu dostupnost usluge. Budući da se ta dva aspekta mogu mijenjati neovisno jedan o drugome, prikazani su kao ortogonalne regije istog složenog stanja sustava.

![Dijagram stanja prijave kriznog događaja](./assets/diagrams/4-5-crisismap-system-SM.svg)

**Slika 4.5. Dijagram stanja sustava s ortogonalnim regijama**

**PlantUML izvor:** [izvor](./puml/4-5-crisismap-system-SM.puml)

**Analiza primjera:** Vlasnik stanja u ovom je primjeru sustav CrisisMap, a ne pojedinačna prijava kriznog događaja. Dvije ortogonalne regije opisuju stanja koja vrijede istodobno: način koordinacije kriznog događaja i dostupnost usluge. Promjena stanja u jednoj regiji ne mora promijeniti stanje u drugoj; primjerice, aktivni krizni događaj može postojati dok je usluga potpuno ili djelomično dostupna.

Prijelazi imaju imenovane događaje ili uvjete, a grane nakon oporavka poslužiteljskog sustava uzimaju u obzir da pružatelj kartografskih usluga može i dalje biti nedostupan. Time primjer pokazuje situaciju u kojoj ortogonalne regije imaju stvarnu semantičku svrhu, a nisu samo način vizualnog grupiranja elemenata.

Ovo je napredniji primjer dijagrama stanja. Koristite takav oblik samo ako sustav stvarno održava dva ili više međusobno neovisnih aspekata stanja koji se mogu mijenjati istodobno. Za projekt u kojem je važan životni ciklus jednog objekta, primjerice prijave, rezervacije ili narudžbe, jednostavniji dijagram stanja tog objekta obično je prikladniji. Složenost dijagrama nije kriterij vrednovanja.

Pri završnom pregledu svaki prikazani prijelaz i uvjet usporedite s ponašanjem koje implementirana aplikacija stvarno podržava.

</details>

## 4.5 Zapisi arhitekturnih odluka

**Cilj:** Sačuvati razloge i obrazložiti odabrane važne arhitekturne odluke kada tablica u odjelku 4.1 nije dovoljna za očuvanje konteksta, razmatranih alternativa i prihvaćenih kompromisa.

Napišite nekoliko ADR-a za važne odluke čije obrazloženje, alternative i kompromis treba sačuvati. Ostale arhitekturne odluke dovoljno je zabilježiti u tablici.

**Detaljni zapis arhitekturne odluke (engl. Architecture Decision Record, ADR), kada odluka zahtijeva dodatno objašnjenje:**

### ADR-[ID]: [Naslov odluke]

| Polje | Zapis odluke |
| --- | --- |
| Kontekst i cilj | [Koji je arhitekturni problem učinio ovu odluku potrebnom?] |
| Kriteriji odluke | [Što je timu stvarno bilo važno?] |
| Razmatrane alternative | [Realne mogućnosti koje je tim razmotrio, ukratko.] |
| Odluka i obrazloženje | [Odabrana mogućnost, zašto je odabrana i čega se tim odrekao.] |
| Status | [Predloženo, prihvaćeno ili zamijenjeno; ako je primjenjivo, poveznica na novu odluku.] |

ADR pišite samo za odluku čije će obrazloženje ostati važno i nakon promjene implementacije. Značajna promjena odluke može se zabilježiti novim ADR-om koji zamjenjuje stari; rutinski odabiri alata ne trebaju detaljne zapise. Promjene dogovorenog opsega pripadaju zahtjevima i njihovoj povijesti promjena; povratna informacija o zadatku ostaje uz odgovarajući zadatak.

<details>
<summary><strong>Odabir jednog poslužiteljskog sustava umjesto zasebno postavljenih usluga</strong></summary>

**Primjer — CrisisMap, ADR-01:**

| ID | Datum | Odluka | Razmatrana alternativa | Obrazloženje i kompromis | Status |
| --- | --- | --- | --- | --- | --- |
| ADR-01 | [Datum odluke] | Jedan poslužiteljski API za obradu prijava | Zasebno postavljene usluge za prijave i resurse | Manji napor postavljanja i integracije za odobreni opseg; kvar poslužiteljskog sustava može utjecati na obje funkcionalnosti. | Prihvaćeno |

### ADR-01: Jedan poslužiteljski API za obradu prijava

| Polje | Zapis odluke |
| --- | --- |
| Kontekst i cilj | Tim tijekom jednog semestra mora izraditi i javno postaviti prijavljivanje kriznih događaja i prikaz usmjeren na kartu. |
| Kriteriji odluke | Tim može izraditi, integrirati, postaviti i objasniti rješenje; komponente i dalje imaju prepoznatljive odgovornosti. |
| Razmatrane alternative | **Jedan poslužiteljski sustav:** moduli dijele aplikaciju koja se postavlja kao cjelina. **Zasebne usluge:** svaka se može izvoditi neovisno, ali zahtijeva dodatni rad na integraciji i postavljanju. |
| Odluka i obrazloženje | Odabrati jedan poslužiteljski sustav s jasno odvojenim odgovornostima vezanim uz prijave. Time se smanjuje rad na postavljanju, uz prihvaćanje da kvar tog sustava može istodobno utjecati na rad s prijavama. |
| Status | Prihvaćeno. |

**Analiza primjera:** Strategija rješenja navodi trenutačni pristup; ADR-01 čuva alternative i kriterije koji su do njega doveli. Dijagrami komponenata i razmještaja trebaju odražavati odabrani pristup kako se sustav razvija. Zaseban ADR koristan je za važnu odluku, a ne za svaki odabir alata.

</details>

## 4.6 Zajednička pravila oblikovanja (engl. Cross-cutting concerns)

**Cilj:** Prepoznati i opisati globalna pravila i mehanizme oblikovanja koji se primjenjujuju u više dijelova aplikacije, navesti gdje se planira primijeniti i ažurirati objašnjenje kako implementacija poprima konačan oblik. Uključite samo pravila koja su važna za ovaj projekt.

**Implementirani mehanizmi:**

| Aspekt | Mehanizam | Pravilo | Mjesto primjene |
| --- | --- | --- | --- |
| [Npr. Sigurnost] | [Npr. Autorizacija korisnika] | [Npr. Ovlasti se provjeravaju na poslužiteljskoj strani za svaki zaštićeni zahtjev; skrivanje elemenata korisničkog sučelja nije dovoljna zaštita.] | [Npr. Middleware za autorizaciju / zaštita API usmjernika.] |
| [Npr. Validacija podataka] | [Npr. Provjera ulaznih podataka] | [Npr. Geoprostorni podaci, uključujući koordinate, provjeravaju se prije pohrane.] | [Npr. Sloj za obradu zahtjeva / odgovarajuća usluga.] |

<details>
<summary><strong>Primjer zajedničkih pravila i mehanizama</strong></summary>

**Primjer — CrisisMap:**

| Aspekt | Mehanizam | Pravilo | Mjesto primjene |
| --- | --- | --- | --- |
| Sigurnost | Autorizacija moderiranja prijava | Ovlasti moderatora provjeravaju se na poslužiteljskoj strani prije odobravanja ili odbijanja prijave; skrivanje gumba u korisničkom sučelju nije dovoljna zaštita. | Poslužiteljski dio funkcionalnosti za moderiranje prijava. |
| Validacija podataka | Provjera lokacije prijave | Nedostajuće ili nevaljane koordinate odbijaju se prije pohrane prijave. | Obrada podnošenja prijave. |
| Aspekt | Mehanizam | Pravilo | Mjesto primjene |
| Upravljanje ovisnostima | Injektiranje ovisnosti | Objekt koji provodi poslovnu logiku ne stvara sam konkretnu implementaciju repozitorija, nego potrebnu ovisnost prima izvana. | `ReportWorkflow` prima implementaciju sučelja `ReportRepository` pri stvaranju objekta. |

**Analiza primjera:** Prvi redak pokazuje sigurnosno pravilo koje se provodi neovisno o korisničkom sučelju, a drugi pravilo provjere podataka prije pohrane. U vlastitoj dokumentaciji navedite samo aspekte koji se stvarno primjenjuju u projektu te konkretno mjesto njihove primjene.

Obrasci poput injektiranja ovisnosti (engl. Dependency Injection) ili repozitorija (engl. Repository) pripadaju ovdje samo kada ih kod stvarno koristi i kada objašnjavaju zajedničko pravilo oblikovanja. Tvrdnja „sustav koristi autentikaciju” sama po sebi ne govori čitatelju gdje se provjera provodi niti što štiti. Sigurnost, bilježenje događaja i obrada pogrešaka ne trebaju svaki zaseban pododjeljak po zadanom pravilu.

</details>

## 4.7 Arhitekturni rizici i tehnički dug

**Cilj:** Navesti stvarne tehničke ili domenske rizike i svjesno prihvaćene kompromise oblikovanja, njihove posljedice i način na koji ih tim obrađuje.

**Tehnički rizici i dug**

| Rizik ili kompromis | Posljedica | Odgovor na rizik  |
| --- | --- | --- |
| *Npr. Pohrana slika u lokalni file sustav* | *Pri ponovnom pokretanju kontejnera slike će biti izgubljene.* | *Prihvaćeni tehnički dug za demo verziju. U budućnosti planirana migracija na S3 (AWS).* |
| *Npr. Nepostojanje paginacije na API-ju* | *Moguće usporenje klijenta pri dohvaćanju velike količine podataka iz baze.* | *Ograničen broj testnih unosa. Dodavanje paginacije ostavljeno za sljedeću iteraciju.* |
|  |  |  |

**Poslovni ili domenski rizici, ako su značajni**

| Rizik | Posljedica | Odgovor na rizik |
| --- | --- | --- |
| **Jedna instanca aplikacije obrađuje prijave** | Kvar poslužitelja (hostinga) privremeno onemogućuje nove prijave. | Prihvaćeno u okviru ograničenja projekta za kolegij; tim ne tvrdi da postoji automatsko prebacivanje na pričuvni sustav (failover). |
| **Nedostupnost vanjskke kartografske usluge** | Prikaz karte može prestati raditi iako su pohranjene prijave u bazi i dalje dostupne. | Implementirana je korisniku vidljiva poruka o pogrešci uz alternativu pregleda prijava u tekstualnom obliku. |
|  |  |  |

<details>
<summary><strong>Primjer tehničkih i domenskih rizika</strong></summary>

**Primjer — CrisisMap, tehnički rizici:**

| Rizik ili kompromis | Posljedica | Odgovor na rizik |
| --- | --- | --- |
| Jedna instanca aplikacije obrađuje podnošenje prijava. | Kvar smještaja aplikacije privremeno onemogućuje nove prijave. | Rizik je prihvaćen za opseg projekta; ne uvodi se pričuvna instanca ni automatsko prebacivanje. |
| Vanjske kartografske usluge nisu dostupne. | Prikaz karte može prestati raditi iako su pohranjene prijave i dalje dostupne. | Karta se ne može prikazati, ali pohranjene prijave ostaju dostupne. | Aplikacija prikazuje poruku o nedostupnosti karte i omogućuje pregled prijava u tekstualnom obliku. |

**Primjer — CrisisMap, domenski rizik:** Čitatelji mogu neprovjerenu prijavu građanina zamijeniti za službeno upozorenje. Tim može u sučelju jasno razlikovati status provjere prijave i uputiti korisnike na službene izvore.

**Analiza primjera:** Prvi tehnički rizik prihvaća realistično ograničenje projekta kolegija; domenski se rizik odnosi na način na koji čitatelj tumači prijavu. Zabilježite ograničenje i realan odgovor koji pripadaju vašem projektu. Neostvarena obavezna funkcionalnost nije tehnički dug nego nedovršen opseg.

</details>

---


>**Završna provjera:** Usporedite dijagrame komponenata, podataka, razreda, sekvencijski dijagram i dijagram stanja s implementiranim kodom, ponašanjem aplikacije i stvarnim razmještajem. Ažurirajte zastarjele opise oblikovanja i objasnite svaku važnu razliku koja ostaje; poveznice na odgovarajući kod ili ispitivanja korisne su kada odgovaraju na konkretno pitanje.
