import { useEffect, useRef, useState } from 'react';
import { applyPolicyToDetections } from '../utils/canvas';
import type { Detection, Policy } from '../types';
import { loadFaceModels } from '../detectors/face';


export default function VideoPlayer({
  file, detections, policy, onTime
}:{
  file: File | null;
  detections: Detection[];
  policy: Policy;
  onTime?: (t:number)=>void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rec, setRec] = useState<MediaRecorder|null>(null);
  const [chunks, setChunks] = useState<BlobPart[]>([]);
useEffect(() => {
    loadFaceModels('/models').catch(console.error);
  }, []);


  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = videoRef.current, c = canvasRef.current;
      if (v && c) {
        const ctx = c.getContext('2d')!;
        c.width = v.videoWidth || 1280;
        c.height = v.videoHeight || 720;
        ctx.drawImage(v, 0, 0, c.width, c.height);
        applyPolicyToDetections(ctx, detections, policy, v.currentTime);
        onTime?.(v.currentTime);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [detections, policy, onTime]);

  useEffect(() => {
    if (file && videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
    }
  }, [file]);

  function startRecording() {
    const c = canvasRef.current!;
    // Capture canvas stream and optionally the video audio track
    const stream = (c as any).captureStream
      ? (c as any).captureStream(30)
      : (c as any).captureStream();
    const v = videoRef.current!;
    const videoWithCaptureStream = v as HTMLVideoElement & { captureStream?: () => MediaStream };
    if (videoWithCaptureStream.captureStream) {
      const audio = videoWithCaptureStream.captureStream().getAudioTracks();
      audio.forEach(t => stream.addTrack(t));
    }
    const r = new MediaRecorder(stream, { mimeType: 'video/webm' });
    r.ondataavailable = e => setChunks(p => p.concat(e.data));
    r.start();
    setChunks([]);
    setRec(r);
  }
  function stopRecording() {
    rec?.stop();
    setTimeout(() => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'sanitized.webm'; a.click();
    }, 200);
  }

  return (
    <div className="player">
      <div className="video-row">
        <video ref={videoRef} controls style={{ maxWidth: '48%' }} />
        <canvas ref={canvasRef} style={{ maxWidth: '48%', border:'1px solid #333' }} />
      </div>
      <div className="controls" style={{ marginTop: 8, display:'flex', gap:8 }}>
        <button onClick={()=>videoRef.current?.play()}>Play</button>
        <button onClick={()=>videoRef.current?.pause()}>Pause</button>
        <button onClick={startRecording}>Start Export</button>
        <button onClick={stopRecording}>Stop & Download</button>
      </div>
    </div>
  );
}
