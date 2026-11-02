// obrada zvuka preko Web Audio API-ja (UC-06, UC-07)
// za sad generator, lowpass, highpass i export u wav, ostalo kasnije

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

// lowpass i highpass su isti BiquadFilter, razlika je samo u tipu
async function biquad(buffer, tip, granicna) {
  const ctx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = tip;
  filter.frequency.value = granicna;

  src.connect(filter).connect(ctx.destination);
  src.start();

  return ctx.startRendering();
}

export function lowpass(buffer, granicna) {
  return biquad(buffer, "lowpass", granicna);
}

export function highpass(buffer, granicna) {
  return biquad(buffer, "highpass", granicna);
}

// AudioBuffer -> wav Blob (16 bit PCM), to se onda salje na backend
export function uWav(buffer) {
  const brKanala = buffer.numberOfChannels;
  const brUzoraka = buffer.length;
  const velicinaPodataka = brUzoraka * brKanala * 2;

  const out = new ArrayBuffer(44 + velicinaPodataka);
  const v = new DataView(out);

  const pisiTekst = (pos, s) => {
    for (let i = 0; i < s.length; i++) v.setUint8(pos + i, s.charCodeAt(i));
  };

  // header, vidi http://soundfile.sapp.org/doc/WaveFormat/
  pisiTekst(0, "RIFF");
  v.setUint32(4, 36 + velicinaPodataka, true);
  pisiTekst(8, "WAVE");
  pisiTekst(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // 1 = PCM
  v.setUint16(22, brKanala, true);
  v.setUint32(24, buffer.sampleRate, true);
  v.setUint32(28, buffer.sampleRate * brKanala * 2, true);
  v.setUint16(32, brKanala * 2, true);
  v.setUint16(34, 16, true);
  pisiTekst(36, "data");
  v.setUint32(40, velicinaPodataka, true);

  const kanali = [];
  for (let k = 0; k < brKanala; k++) kanali.push(buffer.getChannelData(k));

  // kanali idu naizmjenicno (L R L R ...)
  let pos = 44;
  for (let i = 0; i < brUzoraka; i++) {
    for (let k = 0; k < brKanala; k++) {
      const s = Math.max(-1, Math.min(1, kanali[k][i]));
      v.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      pos += 2;
    }
  }

  return new Blob([out], { type: "audio/wav" });
}

// TODO gain, reverb, tremolo
