import type { Detection, Policy } from '../types';

export function drawBlurBox(
  ctx: CanvasRenderingContext2D,
  x:number, y:number, w:number, h:number
) {
  // pixelate: sample down then scale up
  const scale = 0.08; // lower = more pixelation
  const { width, height } = ctx.canvas;
  const sx = x * width, sy = y * height, sw = w * width, sh = h * height;
  const snap = ctx.getImageData(sx, sy, sw, sh);
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.floor(sw * scale));
  off.height = Math.max(1, Math.floor(sh * scale));
  const octx = off.getContext('2d')!;
  // draw small
  octx.imageSmoothingEnabled = false;
  octx.drawImage(imageDataToCanvas(snap), 0, 0, off.width, off.height);
  // draw back big
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(off, sx, sy, sw, sh);
}

function imageDataToCanvas(id: ImageData) {
  const c = document.createElement('canvas');
  c.width = id.width; c.height = id.height;
  c.getContext('2d')!.putImageData(id, 0, 0);
  return c;
}

export function applyPolicyToDetections(
  ctx: CanvasRenderingContext2D,
  dets: Detection[],
  policy: Policy,
  nowSec: number
) {
  dets.forEach(d => {
    if (nowSec < d.startSec || nowSec > d.endSec) return;
    if (!d.bbox) return; // only visual items get boxes; text-only items still appear in report
    const action = policy[d.type];
    if (action === 'blur') {
      drawBlurBox(ctx, d.bbox.x, d.bbox.y, d.bbox.w, d.bbox.h);
    } else {
      // other actions (e.g., draw black box) if needed
    }
  });
}
