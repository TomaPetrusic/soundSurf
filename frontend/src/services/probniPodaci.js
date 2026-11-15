// probni podaci za izgled radne okoline, dok nema pravih podataka iz API-ja

const datoteka = (id, naziv, format) => ({ id, naziv, format, tip: "datoteka" });
const mapa = (id, naziv, djeca) => ({ id, naziv, djeca, tip: "mapa" });

// novi korisnik: točno tri početna zapisa, ništa nije odabrano
export const PRVA_PRIJAVA = {
  stavke: [
    datoteka("bas", "Bas linija", "WAV"),
    datoteka("ritam", "Ritam", "MP3"),
    datoteka("gitara", "Gitara", "FLAC"),
  ],
  otvoreno: [],
  odabrano: null,
};

// korisnik s mapama, odabrana je jedna datoteka
export const REPRODUKCIJA = {
  stavke: [
    mapa("projekti", "Projekti", [
      mapa("skice", "Skice", [
        datoteka("bas", "Bas linija", "WAV"),
        datoteka("refren", "Refren", "WAV"),
      ]),
      datoteka("vokal", "Vokal", "MP3"),
    ]),
    mapa("uzorci", "Uzorci", [datoteka("udaraljke", "Udaraljke", "WAV")]),
    datoteka("ritam", "Ritam", "MP3"),
    datoteka("gitara", "Gitara", "FLAC"),
    datoteka("klavir", "Klavir", "WAV"),
  ],
  otvoreno: ["projekti", "skice"],
  odabrano: "ritam",
};

// pseudoslučajni niz da isti zapis uvijek dobije isti valni oblik
function slucajni(sjeme) {
  let s = sjeme;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// visine stupića (u postocima) za probni valni oblik
export function visineStupica(broj, sjeme) {
  const r = slucajni(sjeme);
  const visine = [];
  for (let i = 0; i < broj; i++) {
    const t = i / broj;
    const ovojnica =
      0.3 + 0.7 * Math.pow(Math.sin(Math.PI * Math.min(0.999, 0.04 + t * 0.98)), 0.5);
    const ritam = 0.55 + 0.45 * Math.abs(Math.sin(i * 0.41 + sjeme));
    const h = Math.max(0.04, Math.min(1, (0.3 + 0.7 * r()) * ovojnica * ritam));
    visine.push(h * 100);
  }
  return visine;
}

// poruke o neuspjelom učitavanju, za pregled izgleda
export const OBAVIJESTI = {
  format: {
    vrsta: "format",
    datoteka: "Proba.ogg",
    tekst: "Nepodržani format. Dopušteni su WAV, MP3 i FLAC.",
  },
  velicina: {
    vrsta: "velicina",
    datoteka: "Proba benda.wav · 72 MB",
    tekst: "Datoteka je veća od 50 MB.",
  },
};
