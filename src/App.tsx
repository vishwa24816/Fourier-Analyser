import { createMemo, createSignal } from "solid-js";
import CanvasPad from "./CanvasPad";
import EquationDisplay from "./EquationDisplay";
import HarmonicsChart from "./HarmonicsChart";
import { computeCoeffs, reconstruct, smooth, presets } from "./FourierMath";

const M = 256;

export default function App() {
  const [signal, setSignal] = createSignal<number[]>(presets.Sine(M));
  const [n, setN] = createSignal(10);
  const res = createMemo(() => computeCoeffs(signal(), n()));
  const recon = createMemo(() => reconstruct(res().a0, res().hs, M));

  return <main class="mx-auto max-w-4xl space-y-4 p-4">
    <h1 class="text-xl font-bold">Fourier Series Pad <span class="font-mono text-xs font-normal text-neutral-400">T = 2π · t ∈ [0,1]</span></h1>
    <CanvasPad signal={signal} setSignal={setSignal} recon={recon} />
    <div class="flex flex-wrap items-center gap-2">
      <button class="rounded bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700" onClick={() => setSignal(new Array(M).fill(0.5))}>Clear</button>
      <button class="rounded bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700" onClick={() => setSignal(smooth(signal()))}>Smooth Curve</button>
      {Object.keys(presets).map(k => <button class="rounded bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700" onClick={() => setSignal(presets[k](M))}>{k}</button>)}
      <label class="ml-auto flex items-center gap-2 text-sm">N = {n()}<input type="range" min={1} max={50} value={n()} onInput={e => setN(+e.currentTarget.value)} class="accent-cyan-400" /></label>
    </div>
    <EquationDisplay a0={res().a0} hs={res().hs} n={n()} />
    <HarmonicsChart hs={res().hs} />
    <p class="text-xs text-neutral-500">White = drawn signal · Cyan dashed = N={n()} reconstruction (Gibbs ringing visible at jumps).</p>
  </main>;
}
