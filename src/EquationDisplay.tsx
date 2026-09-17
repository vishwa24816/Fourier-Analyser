import type { Harmonic } from "./FourierMath";

// ponytail: plain-text equation, no KaTeX — KaTeX (~300KB) for one formula is bloat; add when copy-paste LaTeX export is requested
export default function EquationDisplay(props: { a0: number; hs: Harmonic[]; n: number }) {
  const f = (v: number) => (v < 0 ? "− " + Math.abs(v).toFixed(3) : "+ " + v.toFixed(3));
  const terms = () => props.hs.slice(0, Math.min(5, props.n)).map(h => `${f(h.a)}·cos(${h.n}ωt) ${f(h.b)}·sin(${h.n}ωt)`).join(" ");
  return <div class="rounded-lg border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm overflow-x-auto">
    f(t) ≈ {props.a0.toFixed(3)} {terms()} {props.n > 5 ? `+ … (${props.n - 5} more)` : ""}
  </div>;
}
