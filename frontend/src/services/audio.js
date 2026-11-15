// obrada zvuka preko Web Audio API-ja (UC-06, UC-07)
// za sad samo generator i lowpass, ostalo kasnije

const SAMPLE_RATE = 44100;

// tip: sine, square, sawtooth, triangle
export async function generiraj(tip, frekvencija, trajanje, amplituda) {
  const ctx = new OfflineAudioContext(1, SAMPLE_RATE * trajanje, SAMPLE_RATE);

  const osc = ctx.createOscillator();
  osc.type = tip;
  osc.frequency.value = frekvencija;

  const gain = ctx.createGain();
  gain.gain.value = amplituda;

  osc.connect(gain).connect(ctx.destination);
  osc.start();

  return ctx.startRendering();
}

export async function lowpass(buffer, granicna) {
  const ctx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = granicna;

  src.connect(filter).connect(ctx.destination);
  src.start();

  return ctx.startRendering();
}

// AudioBuffer -> WAV (16-bitni PCM, kanali prepleteni), vraća Blob
export function uWav(buffer) {
  const kanali = buffer.numberOfChannels;
  const uzoraka = buffer.length;
  const bajtova = uzoraka * kanali * 2;
  const zapis = new DataView(new ArrayBuffer(44 + bajtova));
  const tekst = (pomak, niz) => {
    for (let i = 0; i < niz.length; i++) zapis.setUint8(pomak + i, niz.charCodeAt(i));
  };

  tekst(0, "RIFF");
  zapis.setUint32(4, 36 + bajtova, true);
  tekst(8, "WAVE");
  tekst(12, "fmt ");
  zapis.setUint32(16, 16, true); // veličina fmt bloka
  zapis.setUint16(20, 1, true); // PCM
  zapis.setUint16(22, kanali, true);
  zapis.setUint32(24, buffer.sampleRate, true);
  zapis.setUint32(28, buffer.sampleRate * kanali * 2, true); // bajtova u sekundi
  zapis.setUint16(32, kanali * 2, true); // bajtova po uzorku svih kanala
  zapis.setUint16(34, 16, true);
  tekst(36, "data");
  zapis.setUint32(40, bajtova, true);

  const podaci = [];
  for (let k = 0; k < kanali; k++) podaci.push(buffer.getChannelData(k));
  let pomak = 44;
  for (let i = 0; i < uzoraka; i++) {
    for (let k = 0; k < kanali; k++) {
      const x = Math.max(-1, Math.min(1, podaci[k][i])); // filtar može prijeći ±1
      zapis.setInt16(pomak, x < 0 ? x * 0x8000 : x * 0x7fff, true);
      pomak += 2;
    }
  }
  return new Blob([zapis], { type: "audio/wav" });
}

// TODO highpass, gain, reverb, tremolo
