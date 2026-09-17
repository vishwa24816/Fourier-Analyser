# Fourier Series Pad

Interactive web app that computes the **Fourier Series** of any hand-drawn periodic signal. Draw one period of a waveform on a canvas, and the app calculates its harmonic coefficients, renders the series equation, plots the amplitude spectrum, and overlays the reconstructed approximation so you can watch convergence (and Gibbs ringing at discontinuities) as you add harmonics.

## Demo concept

```
draw:   ∿∿∿  (your mouse, one period, t ∈ [0, 1])
output: f(t) ≈ a₀ + Σ aₙ·cos(nωt) + bₙ·sin(nωt),  spectrum bars, cyan reconstruction overlay
```

## Features

- **Draw pad** — HTML5 canvas, pointer events (`pointerdown` / `pointermove` / `pointerup`), 256 samples per period. Raw strokes are binned per-x, averaged, and linearly gap-filled so every x maps to exactly one y.
- **Quick actions** — Clear, Smooth Curve (periodic moving-average), and presets: **Sine, Square, Sawtooth, Triangle**.
- **Fourier engine** (`src/FourierMath.ts`) — trapezoidal numerical integration over the sampled period:
  - `a₀ = (1/M)·Σy`, `aₙ = (2/M)·Σy·cos(2πni/M)`, `bₙ = (2/M)·Σy·sin(2πni/M)`
  - Amplitude `Cₙ = √(aₙ² + bₙ²)`, phase `φₙ = atan2(−bₙ, aₙ)`
  - Adjustable **N = 1…50** harmonics via slider; runs synchronously in a SolidJS `createMemo` (~13k mults at N=50, sub-millisecond — no worker needed).
- **Equation display** — live series formula, first 5 harmonics shown inline (`+ … (N−5 more)` beyond that).
- **Spectrum + table** — bar chart of Cₙ plus a scrollable table of n, aₙ, bₙ, Cₙ, φₙ.
- **Reconstruction overlay** — cyan dashed curve over the white original, recomputed on every draw/preset/N change.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [SolidJS](https://www.solidjs.com/) + TypeScript (fine-grained reactivity, no VDOM) |
| Styling | Tailwind CSS via CDN, dark theme |
| Build | Vite + `vite-plugin-solid` |
| Deploy | Static SPA, `vercel.json` rewrite → ready for Vercel |
| Deliberately excluded | KaTeX/MathJax (plain-text equation), chart libs (div bars), Web Worker (sub-ms compute) — see `ponytail:` comments in-code for upgrade paths |

## Project structure

```
├── index.html              # entry, Tailwind CDN, dark root
├── vite.config.ts          # solid plugin, dist output
├── vercel.json             # SPA rewrite for Vercel
├── f.md                    # original spec
└── src/
    ├── index.tsx           # SolidJS render root
    ├── App.tsx             # signals, N slider, preset/clear/smooth controls
    ├── CanvasPad.tsx       # draw pad + reconstruction overlay
    ├── FourierMath.ts      # rasterize, smooth, presets, computeCoeffs, reconstruct
    ├── EquationDisplay.tsx # live series equation
    └── HarmonicsChart.tsx  # spectrum bars + coefficient table
```

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Deploy (Vercel)

```bash
vercel --prod
```

No server code, no env vars — fully client-side.

## Math reference

For a 1-periodic signal sampled at M points, coefficients approximate the integrals
`aₙ = 2·∫₀¹ f(t)·cos(2πnt) dt`, `bₙ = 2·∫₀¹ f(t)·sin(2πnt) dt` via the trapezoidal rule.
Known closed forms the presets converge to:

| Preset (amp A=0.4 unless noted) | Dominant coefficients |
|---|---|
| Sine | b₁ = −A |
| Square (±A around mean) | bₙ = −4A/(nπ), odd n only |
| Sawtooth | bₙ = −2A/(nπ), all n (1/n decay) |
| Triangle | aₙ = −8A/(nπ)², odd n only (1/n² decay) |

## License

MIT.
