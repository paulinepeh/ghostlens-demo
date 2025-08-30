import { useMemo, useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Timeline from './components/Timeline';
import { detectEmails, detectPhones } from './detectors/regex';
import { POLICIES } from './policy/presets';
import type { Detection, PrivacyReport } from '../types';
import { computePrivacyScore } from './utils/score';



export default function App() {
  const [file, setFile] = useState<File|null>(null);
  const [policyName, setPolicyName] = useState<keyof typeof POLICIES>('Public Post');
  const [notes, setNotes] = useState('Email me at demo@example.com or call 9123 4567.');
  const [dets, setDets] = useState<Detection[]>([]);
  const [now, setNow] = useState(0);
  const policy = POLICIES[policyName];
  const { score, issues, badge } = useMemo(
  () => computePrivacyScore(dets, policy),
  [dets, policy]
);


  const draftReport = useMemo<PrivacyReport>(()=>({
    createdAt: new Date().toISOString(),
    policyName: String(policyName),
    items: dets.map(d=>({
      type: d.type,
      at: d.startSec,
      text: d.text,
      bbox: d.bbox,
      action: policy[d.type],
    }))
  }), [dets, policyName, policy]);

  function handleScan() {
    // For MVP: treat "notes" as transcript/OCR text at t=1s
    const found = [
      ...detectEmails(notes, 1),
      ...detectPhones(notes, 'SG', 2),
    ];
    // Also add a demo face box so we can showcase blur:
    found.push({
      id: `face-${Date.now()}`, type:'face', startSec:0, endSec:999,
      bbox: { x:0.35, y:0.25, w:0.25, h:0.25 }, confidence:0.75
    });
    setDets(found);
  }

  function downloadReport() {
    const blob = new Blob([JSON.stringify(draftReport, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'privacy-report.json'; a.click();
  }

  return (
    <div style={{ padding: 16, fontFamily:'system-ui, sans-serif', color:'#ddd' }}>
      <h2>GhostLens Demo (React + TS + Vite)</h2>

      <section style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div>
          <label>1) Upload a short video (.mp4/.mov):
            <input type="file" accept="video/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
          </label>

          <div style={{ marginTop:12 }}>
            <label>2) Policy preset: </label>
            <select value={String(policyName)} onChange={e=>setPolicyName(e.target.value as keyof typeof POLICIES)}>
              {Object.keys(POLICIES).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ marginTop:12 }}>
            <label>3) Paste sample transcript / OCR text:</label>
            <textarea
              value={notes}
              onChange={e=>setNotes(e.target.value)}
              rows={6}
              style={{ width:'100%', background:'#111', color:'#ddd', border:'1px solid #333' }}
            />
            <button onClick={handleScan} style={{ marginTop:8 }}>Scan for PII</button>
          </div>

          <div style={{ marginTop:12 }}>
            <button onClick={downloadReport}>Download Privacy Report (JSON)</button>
          </div>
        </div>

        <div>
          <VideoPlayer file={file} detections={dets} policy={policy} onTime={setNow} />
          <p style={{ opacity:0.8 }}>Preview (left = original, right = sanitized with overlays)</p>
        </div>
      </section>

      <h3 style={{ marginTop:16 }}>Detections Timeline</h3>
      <Timeline dets={dets} now={now} />

      {/* ✅ Privacy Score Card */}
      <div
        style={{
          marginTop: 12,
          padding: 10,
          border: '1px solid #333',
          borderRadius: 8,
          background: '#111',
        }}
      >
        <strong>Privacy Score: {score} / 100</strong> — <em>{badge}</em>
        <div style={{ opacity: 0.8, fontSize: 13, marginTop: 6 }}>
          Issues detected: Faces: {issues.face ?? 0} • Emails: {issues.email ?? 0} • Phones: {issues.phone ?? 0}
        </div>
      </div>
    </div>
  );
}

