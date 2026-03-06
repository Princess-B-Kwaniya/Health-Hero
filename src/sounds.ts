// Synthesized sound effects using Web Audio API — no external files needed

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Short rising chime — collecting healthy food */
export function playCollect() {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(520, c.currentTime);
    o.frequency.linearRampToValueAtTime(780, c.currentTime + 0.08);
    g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
    o.connect(g).connect(c.destination);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.15);
  } catch { /* silent fail on unsupported */ }
}

/** Low buzz — hitting junk food */
export function playJunkHit() {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(120, c.currentTime);
    o.frequency.linearRampToValueAtTime(80, c.currentTime + 0.2);
    g.gain.setValueAtTime(0.18, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
    o.connect(g).connect(c.destination);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.25);
  } catch { /* silent fail */ }
}

/** Combo ding — two quick ascending notes */
export function playCombo() {
  try {
    const c = getCtx();
    [660, 880].forEach((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.12, c.currentTime + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.08 + 0.12);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + i * 0.08);
      o.stop(c.currentTime + i * 0.08 + 0.12);
    });
  } catch { /* silent fail */ }
}

/** Game over — descending tone */
export function playGameOver() {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(440, c.currentTime);
    o.frequency.linearRampToValueAtTime(110, c.currentTime + 0.5);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
    o.connect(g).connect(c.destination);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.5);
  } catch { /* silent fail */ }
}
