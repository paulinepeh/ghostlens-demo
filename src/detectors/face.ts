import * as faceapi from '@vladmandic/face-api';
import '@tensorflow/tfjs-backend-webgl'; // fastest on most machines
// If you installed WASM and want to use it instead:
// import '@tensorflow/tfjs-backend-wasm';
import * as tf from '@tensorflow/tfjs-core';

import type { Detection } from '../types';

let modelsReady = false;

export async function loadFaceModels(baseURL = '/models') {
  await tf.setBackend('webgl');      // or 'wasm'
  await tf.ready();
  await faceapi.nets.tinyFaceDetector.loadFromUri(baseURL);
  modelsReady = true;
}

const opts = new faceapi.TinyFaceDetectorOptions({
  inputSize: 256,      // 224/256/320... larger = slower but more accurate
  scoreThreshold: 0.4, // lower = more sensitive
});

export async function detectFacesFromCanvas(
  canvas: HTMLCanvasElement,
  atSec: number
): Promise<Detection[]> {
  if (!modelsReady) return [];
  const res = await faceapi.detectAllFaces(canvas, opts);
  const W = canvas.width, H = canvas.height;
  return res.map((r, i) => ({
    id: `face-${atSec.toFixed(2)}-${i}`,
    type: 'face',
    startSec: atSec,
    endSec: atSec + 0.5,
    bbox: { x: r.box.x / W, y: r.box.y / H, w: r.box.width / W, h: r.box.height / H },
    confidence: r.score ?? 0.8,
  }));
}
