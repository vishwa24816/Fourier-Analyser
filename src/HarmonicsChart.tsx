import { For } from "solid-js";
import type { Harmonic } from "./FourierMath";

// ponytail: div bars + plain table, no chart lib — 20 lines of divs replace recharts/chart.js (~100KB+); add lib when log-scale/zoom is needed
export default function HarmonicsChart(props: { hs: Harmonic[] }) {
  const max = () => Math.max(1e-9, ...props.hs.map(h => h.c));
  return <div>
    <div class="flex h-32 items-end gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-3">
      <For each={props.hs}>{h => <div class="flex-1 rounded-sm bg-cyan-400" title={`n=${h.n} C=${h.c.toFixed(3)}`} style={{ height: `${(h.c / max()) * 100}%` }} />}</For>
    </div>
    <div class="mt-3 max-h-64 overflow-auto rounded-lg border border-neutral-800">
      <table class="w-full font-mono text-xs">
        <thead class="sticky top-0 bg-neutral-900"><tr class="text-neutral-400"><th class="p-2 text-right">n</th><th class="p-2 text-right">aₙ</th><th class="p-2 text-right">bₙ</th><th class="p-2 text-right">Cₙ</th><th class="p-2 text-right">φₙ</th></tr></thead>
        <tbody><For each={props.hs}>{h => <tr class="border-t border-neutral-800"><td class="p-2 text-right">{h.n}</td><td class="p-2 text-right">{h.a.toFixed(4)}</td><td class="p-2 text-right">{h.b.toFixed(4)}</td><td class="p-2 text-right text-cyan-300">{h.c.toFixed(4)}</td><td class="p-2 text-right">{h.phi.toFixed(4)}</td></tr>}</For></tbody>
      </table>
    </div>
  </div>;
}
