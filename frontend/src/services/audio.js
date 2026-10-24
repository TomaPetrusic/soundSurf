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

// TODO highpass, gain, reverb, tremolo
// TODO export u wav
