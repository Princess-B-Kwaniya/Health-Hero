// Soft synthesized sound effects using Web Audio API

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Soft pop — collecting healthy food */
export function playCollect() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(400, t);
    o.frequency.exponentialRampToValueAtTime(600, t + 0.06);
    o.frequency.exponentialRampToValueAtTime(500, t + 0.12);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.08, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.15);
  } catch { /* silent fail */ }
}

/** Gentle thud — hitting junk food */
export function playJunkHit() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    // Soft filtered noise thud
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(60, t + 0.15);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.1, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.2);
  } catch { /* silent fail */ }
}

/** Warm chime — combo achieved */
export function playCombo() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    [392, 523, 659].forEach((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t + i * 0.1);
      g.gain.linearRampToValueAtTime(0.06, t + i * 0.1 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.2);
      o.connect(g).connect(c.destination);
      o.start(t + i * 0.1);
      o.stop(t + i * 0.1 + 0.2);
    });
  } catch { /* silent fail */ }
}

/** Soft descending tone — game over */
export function playGameOver() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(330, t);
    o.frequency.exponentialRampToValueAtTime(165, t + 0.4);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.5);
  } catch { /* silent fail */ }
}
