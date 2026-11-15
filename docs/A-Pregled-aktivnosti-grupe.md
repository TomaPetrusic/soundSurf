# A. Pregled aktivnosti grupe

## A.1 Evidencija sastanaka

**Kratice članova tima:** FC = Filip Celić; JD = Jakov Džijan; TG = Toni Grdović; LF = Leonard Fabris; AV = Ante Vrkić; TP = Toma Petrušić.

Detaljniji zapisi nalaze se u [zapisnicima sastanaka](meeting-notes/sprint-01.md).

| Datum i sudionici | Glavna tema | Donesena odluka ili zadatak | Poveznica na zadatak ili rezultat, ako postoji |
| --- | --- | --- | --- |
| 16. 10. 2026.; FC, JD, TG, LF, AV, TP | Početna podjela posla | Uloge raspodijeljene po dijelovima aplikacije (vidi A.3). TP otvara repozitorij i postavlja dokumentaciju prema predlošku kolegija. | Zahtjevi i README: #2, #4. |
| 22. 10. 2026.; FC, JD, TG, AV, TP | Pokretanje rada po ulogama | Svatko pregledava svoje funkcijske zahtjeve, istražuje tehnologije za svoj dio i javlja prijedlog TP-u; razliku od plana u dokumentaciji javlja AV-u. Svi počinju do 26. 10. JD i TG izrađuju dizajn web-stranice. | Obrasci uporabe: #5, #6; kostur aplikacije: #9; dizajn prijave: #11. |
| 6. 11. 2026.; FC, JD, TG, LF, AV, TP | Plan za prvu predaju | Za predaju: radna okolina po korisniku, upload i download, filtar sa spremanjem rezultata, player. FC dovršava API radne okoline (upload, download, prepisivanje), TG player i valni oblik, AV usklađuje UML dijagrame s implementacijom, TP pregledava i spaja PR-ove. Otvoreno: spajanje sučelja radne okoline s API-jem (dogovoriti nakon završetka pojedinih funkcionalnosti). | #16 – #34, #24, #26, #28. |
| 15. 11. 2026.; FC, JD, TG, AV, TP | Pregled funkcionalnosti i dokumentacije prije prve predaje | JD i TP spajaju radnu okolinu s poslužiteljem (upload, player za datoteke iz stabla, download, dijalozi); TP spaja niskopropusni filtar sa spremanjem i dorađuje sučelje; FC piše poglavlja 4.1 i 4.3, zapisnike i pregled aktivnosti grupe. | #39, #43 – #50, #51. |

## A.2 Plan rada

**Trenutačni plan:** GitHub Issues u repozitoriju i tablica u nastavku. Ažurnost održavaju FC, AV, TP.

| Razdoblje/Tjedan | Glavni planirani rad | Odgovorni članovi | Poveznica na zadatke |
| --- | --- | --- | --- |
| 20. – 26. 10. 2026. | Zahtjevi, obrasci uporabe, README, podjela uloga | TP, AV | #2, #4, #5 |
| 27. 10. – 2. 11. 2026. | Odabir tehnologija i kostur aplikacije s prijavom; UML dijagrami; dizajn prijave; početak obrade zvuka | TP, AV, TG, LF | #7, #9, #10 |
| 3. – 9. 11. 2026. | Izgled radne okoline; model podataka i spajanje na pohranu datoteka | TG, FC | #13, #15, #17 |
| 10. – 16. 11. 2026. (prva predaja) | API radne okoline; player i valni oblik; spajanje sučelja s API-jem; filtar i spremanje; usklađivanje dijagrama i dokumentacija | FC, TG, JD, TP, AV | #19 – #51 |
| Nakon prve predaje (planirano) | Pet filtara (F-14) i generiranje zvuka u sučelju (F-12, F-13) | LF | [issue] |
| Nakon prve predaje (planirano) | Javna stranica, postovi i favoriti (F-18 – F-27) | JD | [issue] |
| Nakon prve predaje (planirano) | Uvoz s Freesounda (F-05) i kopiranje tuđeg zapisa (F-29) | FC | [issue] |
| Nakon prve predaje (planirano) | Ispitivanja (poglavlje 5) | AV | [issue] |

## A.3 Aktivnosti i doprinosi članova

| Aktivnost ili rezultat | Član | Prijavljeni sati | Reprezentativni rezultat ili poveznica |
| --- | --- | --- | --- |
| Zahtjevi, README i organizacija repozitorija | TP | [h] | #2, #4 |
| Obrasci uporabe | AV | [h] | #5, #6 |
| UML dijagrami sustava i usklađivanje s implementacijom | AV | [h] | #7, #12, #26, #28 |
| Kostur aplikacije: Django, prijava preko Supabasea, React, Docker i Railway, CI | TP | [h] | #9 |
| Dizajn prijave, izgled radne okoline, player i valni oblik | TG | [h] | #11, #14, #24 |
| Backend radne okoline: model, pohrana datoteka, mape, upload, download, prepisivanje, preimenovanje, premještanje, brisanje, početni zapisi | FC | [h] | #16, #18, #20, #30, #32, #34, #36, #38 |
| Spajanje radne okoline s poslužiteljem: upload, player za datoteke iz stabla, download, dijalozi | JD, TP | [h] | #39 |
| Obrada zvuka: generator, niskopropusni i visokopropusni filtar, izvoz u WAV | LF | [h] | Grana `feature/obrada-zvuka`; generator i niskopropusni filtar u `main` |
| Primjena filtra, spremanje rezultata i dorada sučelja prije predaje | TP | [h] | #43 – #50 |
| Dokumentacija: arhitekturne odluke, ER dijagram, dijagram razreda | FC | [h] | #51 |
| Vođenje tima, zapisnici i pregled aktivnosti grupe | FC | [h] | Ovaj dokument; [zapisnici](meeting-notes/sprint-01.md) |
| Pregled i spajanje PR-ova, postavljanje aplikacije na Railway | TP | [h] | Spojeni PR-ovi u repozitoriju |

Sati su samoprijavljena procjena svakog člana.

## A.4 Pregled promjena u repozitoriju

**Prikaz aktivnosti repozitorija:** [GitHub Contributors](https://github.com/TomaPetrusic/soundSurf/graphs/contributors), razdoblje 21. 10. – 15. 11. 2026.

Graf ne odražava potpuno raspodjelu rada:
- Spajanja PR-ova, pregledi koda, usklađivanje dokumentacije i dogovori u timu nisu vidljivi kao broj commitova.

## A.5 Ključni inženjerski izazovi i rješenja

| Izazov | Poduzeta radnja | Ishod ili preostalo ograničenje |
| --- | --- | --- |
| Tablice u bazi bile su dostupne preko Supabaseova REST API-ja s javnim ključem iz klijenta. | Uključen RLS bez pravila na svim tablicama; svaka nova tablica dobiva vlastitu RLS migraciju (prva migracija obuhvatila je samo tada postojeće tablice). Podacima pristupa samo Django. | Tablicama se ne može pristupiti izvana; migracije `accounts/0002`, `workspace/0002` i `workspace/0005`. |
| Bajtovi zvuka i zapisi u bazi nisu u istoj transakciji, pa brisanje ili neuspjelo spremanje može ostaviti datoteku bez zapisa ili zapis bez sadržaja. | Upload briše spremljeni sadržaj ako zapis u bazi ne uspije; prepisivanje sprema pod novi ključ i stari briše tek nakon uspjeha; brisanje mape skuplja ključeve iz cijelog podstabla. | Izvorni zvuk ostaje sačuvan ako prepisivanje ne uspije (#34); brisanje uklanja i sadržaj (#36). Ako brisanje iz pohrane ne uspije, zapis se ipak briše, a greška se bilježi u log. |
| UML dijagrami iz faze oblikovanja razlikovali su se od implementacije (dvije tablice umjesto jedne, nedostajalo porijeklo datoteke, obrada na poslužitelju umjesto u pregledniku). | Dijagrami usklađeni s kodom, uz oznaku što je implementirano, a što planirano; izrađen ER dijagram prema migracijama. | #26, #28, #51; dijagrame treba ponovno uskladiti pri svakoj većoj promjeni modela. |