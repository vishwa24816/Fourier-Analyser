// Trapezoidal integration over one period, t in [0,1). y sampled uniformly.
export interface Harmonic { n: number; a: number; b: number; c: number; phi: number; }

export function computeCoeffs(y: number[], N: number): { a0: number; hs: Harmonic[] } {
  const M = y.length;
  // ponytail: sync compute, no worker — N<=50, M=256 is ~13k mults (<1ms), worker overhead exceeds gain; add worker when M*N > 1e6
  let a0 = 0;
  for (let i = 0; i < M; i++) a0 += y[i];
  a0 /= M;
  const hs: Harmonic[] = [];
  for (let n = 1; n <= N; n++) {
    let a = 0, b = 0;
    for (let i = 0; i < M; i++) {
      const ang = 2 * Math.PI * n * i / M;
      a += y[i] * Math.cos(ang);
      b += y[i] * Math.sin(ang);
    }
    a = 2 * a / M; b = 2 * b / M;
    hs.push({ n, a, b, c: Math.hypot(a, b), phi: Math.atan2(-b, a) });
  }
  return { a0, hs };
}

export function reconstruct(a0: number, hs: Harmonic[], M: number): number[] {
  const out = new Array<number>(M);
  for (let i = 0; i < M; i++) {
    let v = a0;
    for (const h of hs) {
      const ang = 2 * Math.PI * h.n * i / M;
      v += h.a * Math.cos(ang) + h.b * Math.sin(ang);
    }
    out[i] = v;
  }
  return out;
}

// Force single y per x: bin raw points by x, average, linearly fill gaps.
export function rasterize(pts: { x: number; y: number }[], M: number): number[] {
  const sum = new Array(M).fill(0), cnt = new Array(M).fill(0);
  for (const p of pts) {
    const i = Math.min(M - 1, Math.max(0, Math.round(p.x * (M - 1))));
    sum[i] += p.y; cnt[i]++;
  }
  const y: (number | null)[] = sum.map((s, i) => cnt[i] ? s / cnt[i] : null);
  let first = y.findIndex(v => v !== null);
  if (first === -1) return new Array(M).fill(0.5);
  let last = M - 1 - [...y].reverse().findIndex(v => v !== null);
  for (let i = 0; i < first; i++) y[i] = y[first];
  for (let i = last + 1; i < M; i++) y[i] = y[last];
  let lo = first;
  for (let i = first + 1; i <= last; i++) {
    if (y[i] !== null) {
      const hi = i, span = hi - lo;
      for (let k = lo + 1; k < hi; k++) y[k] = (y[lo] as number) + ((y[hi] as number) - (y[lo] as number)) * (k - lo) / span;
      lo = hi;
    }
  }
  return y as number[];
}

export const smooth = (y: number[]): number[] => y.map((v, i) => (y[(i - 1 + y.length) % y.length] + 2 * v + y[(i + 1) % y.length]) / 4);

export const presets: Record<string, (M: number) => number[]> = {
  Sine: M => Array.from({ length: M }, (_, i) => 0.5 - 0.4 * Math.sin(2 * Math.PI * i / M)),
  Square: M => Array.from({ length: M }, (_, i) => (i / M < 0.5 ? 0.15 : 0.85)),
  Sawtooth: M => Array.from({ length: M }, (_, i) => 0.1 + 0.8 * i / M),
  Triangle: M => Array.from({ length: M }, (_, i) => { const t = i / M; return t < 0.5 ? 0.1 + 1.6 * t : 0.9 - 1.6 * (t - 0.5); }),
};
