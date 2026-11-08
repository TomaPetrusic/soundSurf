// pomoćne funkcije za stablo datoteka i mapa

export function nadji(stavke, id) {
  for (const s of stavke) {
    if (s.id === id) return s;
    if (s.tip === "mapa") {
      const u = nadji(s.djeca, id);
      if (u) return u;
    }
  }
  return null;
}

// mapa u kojoj je stavka; null ako je na vrhu, undefined ako je nema
export function roditelj(stavke, id, otac = null) {
  for (const s of stavke) {
    if (s.id === id) return otac;
    if (s.tip === "mapa") {
      const u = roditelj(s.djeca, id, s);
      if (u !== undefined) return u;
    }
  }
  return undefined;
}

// sve datoteke ispod mape, i u podmapama
export function datotekeUMapi(mapa) {
  const izlaz = [];
  for (const s of mapa.djeca) {
    if (s.tip === "mapa") izlaz.push(...datotekeUMapi(s));
    else izlaz.push(s);
  }
  return izlaz;
}

// 1 datoteka, 2 datoteke, 5 datoteka
export function brojDatoteka(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return n + " datoteka";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return n + " datoteke";
  return n + " datoteka";
}
