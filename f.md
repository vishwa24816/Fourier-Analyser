Create a high-performance, standalone SolidJS web application using TypeScript and Tailwind CSS that calculates the Fourier Series for user-drawn custom periodic signals. 

### Core Requirements

1. Architecture & Tech Stack:
   - Framework: SolidJS with TypeScript.
   - Styling: Tailwind CSS (dark mode theme by default).
   - Deployment Target: Serverless-optimized for Vercel (static single-page app, fully client-side calculations for minimal server overhead).

2. Interface & User Input (Interactive Canvas Pad):
   - Interactive HTML5 Canvas acting as a signal draw pad.
   - The canvas represents precisely 1 period ($T = 2\pi$ or normalized $t \in [0, 1]$) of a periodic waveform.
   - Drawing Mechanics: Smooth continuous drawing using pointer events (`pointerdown`, `pointermove`, `pointerup`). Automatically smooth raw input points and interpolate missing $x$-values so that every continuous sample point $x$ maps to exactly one $y$ value across the 1-cycle period.
   - Provide canvas quick-action controls: Clear Canvas, Smooth Curve, and Preset Waveforms (Square, Sawtooth, Triangle, Sine).

3. Computation Engine (Fourier Analysis):
   - Compute the Fourier Series representation up to $N$ harmonics (allow user to adjust $N$ from 1 to 50 via a slider):
     $$f(t) = a_0 + \sum_{n=1}^{N} \left( a_n \cos(n \omega t) + b_n \sin(n \omega t) \right)$$
   - Calculate coefficients $a_0$, $a_n$, and $b_n$ using numerical integration (Trapezoidal Rule or Simpson's Rule) over the interpolated $N_{samples}$ drawn array.
   - Compute amplitude $C_n = \sqrt{a_n^2 + b_n^2}$ and phase $\phi_n = \operatorname{atan2}(-b_n, a_n)$.
   - Performance Optimization: Wrap heavy integration loops inside Web Workers or split execution using `requestIdleCallback`/`requestAnimationFrame` to maintain 60 FPS without blocking the SolidJS reactive signal thread.

4. Output & Visualizations:
   - Render the symbolic LaTeX equation of the calculated Fourier Series dynamically (using KaTeX or MathJax).
   - Display a frequency spectrum bar chart showing harmonic amplitudes $C_n$ alongside $a_n$ and $b_n$ values in an interactive tabular breakdown.
   - Reconstructed Waveform Overlay: Draw the reconstructed approximation curve directly over the original user-drawn signal to visually demonstrate Fourier convergence (Gibbs phenomenon).

5. Code Quality & Vercel Optimization:
   - Modular component structure (`CanvasPad.tsx`, `FourierMath.ts`, `EquationDisplay.tsx`, `HarmonicsChart.tsx`).
   - Zero unnecessary re-renders; leverage fine-grained SolidJS primitives (`createSignal`, `createMemo`, `createEffect`).
   - Clean Vercel build configuration (`vite.config.ts`, `vercel.json` with static routing).

   https://github.com/vishwa24816/Fourier-Analyser 