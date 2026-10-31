import Surfer from "./Surfer";
import "./FilterWave.css";

// frekvencijski odziv niskopropusnog filtra, iz dizajna login stranice
const FC = 1200; // granična frekvencija (Hz)
const Q = 2.2; // rezonancija
const Y0 = 210; // visina 0 dB u koordinatama 0..1000
const K = 13; // koliko koordinata po jednom dB
const KORAK = 4;

const HZ = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
const DB = [0, -12, -24, -36, -48];

// frekvencija -> x u koordinatama 0..1000 (logaritamska os, 20 Hz do 20 kHz)
const X = (f) => (Math.log10(f / 20) / 3) * 1000;

// pojačanje niskopropusnog filtra drugog reda u dB
const lowpassDb = (f, c, q) => {
  const r = f / c;
  return -10 * Math.log10(Math.pow(1 - r * r, 2) + Math.pow(r / q, 2));
};

const oznaka = (f) => (f >= 1000 ? f / 1000 + "k" : String(f));

function izracunaj() {
  const ys = [];
  const tocke = [];
  for (let x = 0; x <= 1000; x += KORAK) {
    const f = 20 * Math.pow(1000, x / 1000);
    const y = Math.min(1010, Y0 - lowpassDb(f, FC, Q) * K);
    ys.push(y);
    tocke.push(x + " " + y.toFixed(1));
  }
  const yAt = (x) =>
    ys[Math.max(0, Math.min(ys.length - 1, Math.round(x / KORAK)))];

  // vrh vala: najviša točka krivulje od polovice granične frekvencije nadalje
  let pi = Math.round(X(FC * 0.5) / KORAK);
  for (let i = pi; i < ys.length; i++) if (ys[i] < ys[pi]) pi = i;

  // surfer stoji malo niže niz padinu vala, nagnut prema nagibu krivulje
  let si = pi;
  while (si < ys.length - 3 && ys[si] < ys[pi] + 60) si++;
  const dy = ys[Math.min(ys.length - 1, si + 2)] - ys[Math.max(0, si - 2)];
  const nagib = Math.min(28, (Math.atan2(dy * 0.9, 16 * 1.44) * 180) / Math.PI);

  let grid = "";
  HZ.forEach((f) => {
    grid += "M" + X(f).toFixed(1) + " 0V1000";
  });
  DB.forEach((d) => {
    grid += "M0 " + (Y0 - d * K).toFixed(1) + "H1000";
  });

  // oznake su bijele tamo gdje je ispod njih plava ispuna, inače sive
  const hz = [20, ...HZ].map((f) => ({
    left: X(f) / 10 + "%",
    tekst: oznaka(f) + (f === 20 ? " Hz" : ""),
    unutra: yAt(X(f) + 22) < 960,
  }));
  const db = DB.map((d) => ({
    top: (Y0 - d * K) / 10 + "%",
    tekst: (d === 0 ? "0" : "−" + Math.abs(d)) + " dB",
    unutra: yAt(985) < Y0 - d * K - 22,
  }));

  return {
    krivulja: "M" + tocke.join("L"),
    ispuna: "M0 1000L" + tocke.join("L") + "L1000 1000Z",
    grid,
    hz,
    db,
    vrhLijevo: pi * KORAK / 10 + "%",
    vrhGore: ys[pi] / 10 + "%",
    surferLijevo: (si * KORAK) / 10 + "%",
    surferGore: ys[si] / 10 + "%",
    nagib: nagib.toFixed(1),
  };
}

// krivulja se ne mijenja, pa je dovoljno izračunati je jednom
const VAL = izracunaj();

export default function FilterWave() {
  return (
    <>
      <svg
        className="wave-svg"
        aria-hidden="true"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="clip-wave">
            <path d={VAL.ispuna} />
          </clipPath>
        </defs>
        <path className="wave-grid" d={VAL.grid} vectorEffect="non-scaling-stroke" />
        <path className="wave-fill" d={VAL.ispuna} />
        <path
          className="wave-grid wave-grid-inside"
          d={VAL.grid}
          clipPath="url(#clip-wave)"
          vectorEffect="non-scaling-stroke"
        />
        <path className="wave-curve" d={VAL.krivulja} vectorEffect="non-scaling-stroke" />
      </svg>

      {VAL.hz.map((l) => (
        <span
          key={l.tekst}
          aria-hidden="true"
          className={"wave-label wave-label-hz" + (l.unutra ? " wave-label-inside" : "")}
          style={{ left: l.left }}
        >
          {l.tekst}
        </span>
      ))}
      {VAL.db.map((l) => (
        <span
          key={l.tekst}
          aria-hidden="true"
          className={"wave-label wave-label-db" + (l.unutra ? " wave-label-inside" : "")}
          style={{ top: l.top }}
        >
          {l.tekst}
        </span>
      ))}

      <Surfer lijevo={VAL.surferLijevo} gore={VAL.surferGore} nagib={VAL.nagib} />

      <div
        aria-hidden="true"
        className="wave-peak"
        style={{ left: VAL.vrhLijevo, top: VAL.vrhGore }}
      >
        <span className="wave-peak-name">
          <span className="wave-peak-square" />
          LOW-PASS
        </span>
        <span>fc 1.2 kHz · Q 2.2</span>
      </div>
    </>
  );
}
