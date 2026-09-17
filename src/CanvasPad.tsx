import { createEffect } from "solid-js";
import { rasterize } from "./FourierMath";

export default function CanvasPad(props: { signal: () => number[]; setSignal: (y: number[]) => void; recon: () => number[] | null }) {
  const M = 256;
  let cv!: HTMLCanvasElement, pts: { x: number; y: number }[] = [], drawing = false;

  const draw = () => {
    const ctx = cv.getContext("2d")!, W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "#3f3f46"; ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    const y = props.signal(), r = props.recon();
    ctx.strokeStyle = "#fafafa"; ctx.lineWidth = 2; ctx.beginPath();
    y.forEach((v, i) => { const x = i / (M - 1) * W, yy = v * H; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); });
    ctx.stroke();
    if (r) {
      ctx.strokeStyle = "#22d3ee"; ctx.lineWidth = 2; ctx.setLineDash([6, 3]); ctx.beginPath();
      r.forEach((v, i) => { const x = i / (M - 1) * W, yy = v * H; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); });
      ctx.stroke(); ctx.setLineDash([]);
    }
  };
  createEffect(draw);
  createEffect(() => { props.signal(); props.recon(); requestAnimationFrame(draw); });

  const pos = (e: PointerEvent) => { const b = cv.getBoundingClientRect(); return { x: (e.clientX - b.left) / b.width, y: (e.clientY - b.top) / b.height }; };
  const commit = () => props.setSignal(rasterize(pts, M));
  const down = (e: PointerEvent) => { drawing = true; pts = [pos(e)]; (e.target as Element).setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent) => { if (!drawing) return; pts.push(pos(e)); commit(); };
  const up = () => { drawing = false; };
  return <canvas ref={cv} width={640} height={320} class="w-full rounded-lg border border-neutral-800 bg-neutral-900 touch-none cursor-crosshair"
    onPointerDown={down} onPointerMove={move} onPointerUp={up} />;
}
