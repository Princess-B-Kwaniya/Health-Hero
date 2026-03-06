// Pro-grade Audio Engine: Uses a dedicated AudioWorker-style lookahead for rock-solid timing
// and rich, multi-layered synthesized textures.

let ctx: AudioContext | null = null;
let musicInterval: any = null;
let masterGain: GainNode | null = null;
const LOOKAHEAD = 0.2; // How far ahead to schedule notes (seconds)

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setVolume(v: number) {
  const c = getCtx();
  if (masterGain) {
    masterGain.gain.setTargetAtTime(v, c.currentTime, 0.05);
  }
}

// Custom Reverb/Echo effect for "flesh"
let reverbNode: ConvolverNode | null = null;
async function getReverb(c: AudioContext) {
  if (reverbNode) return reverbNode;
  const length = c.sampleRate * 1.5;
  const impulse = c.createBuffer(2, length, c.sampleRate);
  for (let i = 0; i < 2; i++) {
    const data = impulse.getChannelData(i);
    for (let j = 0; j < length; j++) {
      data[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
    }
  }
  reverbNode = c.createConvolver();
  reverbNode.buffer = impulse;
  return reverbNode;
}

/** Rewards "pop" sound */
export function playCollect() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const o1 = c.createOscillator();
    const o2 = c.createOscillator();
    const g = c.createGain();
    o1.type = 'triangle'; o2.type = 'sine';
    o1.frequency.setValueAtTime(400, t);
    o1.frequency.exponentialRampToValueAtTime(800, t + 0.05);
    o2.frequency.setValueAtTime(800, t);
    o2.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o1.connect(g); o2.connect(g);
    g.connect(masterGain!);
    o1.start(t); o2.start(t);
    o1.stop(t + 0.2); o2.stop(t + 0.2);
  } catch { /* silent fail */ }
}

/** Impact "thud" sound */
export function playJunkHit() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(30, t + 0.25);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.connect(g).connect(masterGain!);
    o.start(t);
    o.stop(t + 0.4);
  } catch { /* silent fail */ }
}

/** Chime sequence for combos */
export function playCombo() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t + i * 0.08);
      g.gain.linearRampToValueAtTime(0.1, t + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.5);
      o.connect(g).connect(masterGain!);
      o.start(t + i * 0.08);
      o.stop(t + i * 0.08 + 0.5);
    });
  } catch { /* silent fail */ }
}

export function playGameOver() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'square';
    o.frequency.setValueAtTime(200, t);
    o.frequency.linearRampToValueAtTime(40, t + 1.2);
    const g = c.createGain();
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    o.connect(g).connect(masterGain!);
    o.start(t); o.stop(t + 1.2);
  } catch { /* silent fail */ }
}

export function playMove() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(300, t);
    o.frequency.exponentialRampToValueAtTime(600, t + 0.1);
    const g = c.createGain();
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g).connect(masterGain!);
    o.start(t); o.stop(t + 0.15);
  } catch { /* silent fail */ }
}

export function playJump() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(250, t);
    o.frequency.exponentialRampToValueAtTime(700, t + 0.2);
    const g = c.createGain();
    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o.connect(g).connect(masterGain!);
    o.start(t); o.stop(t + 0.25);
  } catch { /* silent fail */ }
}

export function playRoll() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(80, t);
    o.frequency.linearRampToValueAtTime(40, t + 0.6);
    const g = c.createGain();
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    o.connect(g).connect(masterGain!);
    o.start(t); o.stop(t + 0.6);
  } catch { /* silent fail */ }
}

// --- Music Engine ---

function playKick(ctx: AudioContext, time: number) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.setValueAtTime(150, time);
  o.frequency.exponentialRampToValueAtTime(0.001, time + 0.15);
  g.gain.setValueAtTime(0.4, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  o.connect(g).connect(masterGain!);
  o.start(time); o.stop(time + 0.15);
}

function playSnare(ctx: AudioContext, time: number) {
  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass'; filter.frequency.value = 1200;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.12, time);
  g.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
  noise.connect(filter).connect(g).connect(masterGain!);
  noise.start(time); noise.stop(time + 0.12);
}

function playHat(ctx: AudioContext, time: number) {
  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass'; filter.frequency.value = 8000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.05, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
  noise.connect(filter).connect(g).connect(masterGain!);
  noise.start(time); noise.stop(time + 0.04);
}

let nextNoteTime = 0;
let currentStep = 0;
const bpm = 140;
const secondsPerStep = 60 / bpm / 4; // 16th notes

export function startMusic() {
  if (musicInterval) return;
  const c = getCtx();
  nextNoteTime = c.currentTime;
  currentStep = 0;

  musicInterval = setInterval(() => {
    while (nextNoteTime < c.currentTime + LOOKAHEAD) {
      scheduleStep(currentStep, nextNoteTime);
      nextNoteTime += secondsPerStep;
      currentStep = (currentStep + 1) % 32;
    }
  }, 50);
}

function scheduleStep(step: number, time: number) {
  const c = getCtx();

  // DRUMS
  if (step % 8 === 0) playKick(c, time);
  if (step % 8 === 4) playSnare(c, time);
  if (step % 2 === 0) playHat(c, time);

  // BASS (Rich Pulse)
  const bassNotes = [65.41, 65.41, 82.41, 98.00]; // C, C, E, G
  if (step % 4 === 0 || step % 8 === 6) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'triangle';
    o.frequency.value = bassNotes[Math.floor(step / 8) % 4];
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.08, time + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    o.connect(g).connect(masterGain!);
    o.start(time); o.stop(time + 0.25);
  }

  // LEAD (Bubbly Chiptune)
  const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
  if (step % 4 === 1 || step % 4 === 2 || (step % 16 > 12 && step % 2 === 0)) {
    if (Math.random() > 0.3) {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.value = scale[Math.floor(Math.random() * scale.length)];
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.04, time + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      o.connect(g).connect(masterGain!);
      o.start(time); o.stop(time + 0.15);
    }
  }
}

export function stopMusic() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}
