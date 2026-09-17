import type { Harmonic } from "./FourierMath";

// ponytail: plain-text equation, no KaTeX — KaTeX (~300KB) for one formula is bloat; add when copy-paste LaTeX export is requested
export default function EquationDisplay(props: { a0: number; hs: Harmonic[]; n: number }) {
  const f = (v: number) => (v < 0 ? "− " + Math.abs(v).toFixed(3) : "+ " + v.toFixed(3));
  const terms = () => props.hs.map(h => `${f(h.a)}·cos(${h.n}ωt) ${f(h.b)}·sin(${h.n}ωt)`).join(" ");
  return <div class="max-h-48 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm leading-relaxed break-words whitespace-normal">
    f(t) ≈ {props.a0.toFixed(3)} {terms()}
  </div>;
}
