// dekodiranje zvučne datoteke i izračun valnog oblika

// pretvara datoteku (WAV, MP3, FLAC) u niz brojeva: amplituda u svakom trenutku
export async function dekodiraj(datoteka) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  try {
    return await ctx.decodeAudioData(await datoteka.arrayBuffer());
  } finally {
    ctx.close();
  }
}

// koji dio najglasnijih odsječaka uzimamo kao "puna visina"; time jedan
// izolirani glasni trenutak ne spljošti ostatak prikaza
const REFERENTNI_PERCENTIL = 0.98;
// veće od 1 jače razdvaja tihe i glasne dijelove
const OSTRINA = 1.5;
const NAJMANJA_VISINA = 4; // % visine, da stupić uvijek bude vidljiv

// sažima milijune uzoraka u `broj` stupića: visina stupića odgovara prosječnoj
// snazi (RMS) u njegovom odsječku, jer vršna vrijednost kod glasne glazbe
// u gotovo svakom odsječku dosegne vrh
export function visineStupica(buffer, broj) {
  const kanali = [];
  for (let k = 0; k < buffer.numberOfChannels; k++) kanali.push(buffer.getChannelData(k));

  const snage = new Array(broj).fill(0);
  const duljina = buffer.length;

  for (let i = 0; i < broj; i++) {
    const od = Math.floor((i * duljina) / broj);
    const do_ = Math.floor(((i + 1) * duljina) / broj);
    let zbroj = 0;
    for (const kanal of kanali) {
      for (let j = od; j < do_; j++) zbroj += kanal[j] * kanal[j];
    }
    const uzoraka = (do_ - od) * kanali.length;
    snage[i] = uzoraka > 0 ? Math.sqrt(zbroj / uzoraka) : 0;
  }

  const poredano = [...snage].sort((a, b) => a - b);
  const referenca = poredano[Math.floor((broj - 1) * REFERENTNI_PERCENTIL)];

  return snage.map((s) => {
    const omjer = referenca > 0 ? Math.min(1, s / referenca) : 0;
    return Math.max(NAJMANJA_VISINA, Math.pow(omjer, OSTRINA) * 100);
  });
}

// 134 -> "2:14"
export function oblikujVrijeme(sekunde) {
  const ukupno = Math.floor(sekunde);
  const s = String(ukupno % 60).padStart(2, "0");
  return Math.floor(ukupno / 60) + ":" + s;
}
