import { useMemo, useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import { detectEmails, detectPhones } from './detectors/regex';
import { POLICIES } from './policy/presets';
import type { Detection, PrivacyReport } from '../types';
import { computePrivacyScore } from './utils/score';



export default function App() {
  const [file, setFile] = useState<File|null>(null);
  const [policyName, setPolicyName] = useState<keyof typeof POLICIES>('Public Post');
  const [notes, setNotes] = useState('Email me at demo@example.com or call 9123 4567.');
  const [dets, setDets] = useState<Detection[]>([]);
  // Removed unused 'now' state
  const policy = POLICIES[policyName];
const score = useMemo(
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
  <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif', color: '#ddd' }}>
    <h2>GhostLens</h2>

    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* LEFT COLUMN */}
      <div>
        <label>1) Upload a short video (.mp4/.mov):</label>
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />

        <div style={{ marginTop: 12 }}>
          <label>2) Policy preset:</label>
          <select value={String(policyName)} onChange={e => setPolicyName(e.target.value as any)}>
            {Object.keys(POLICIES).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>3) Paste sample transcript / OCR text:</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={6}
            style={{ width: '100%', background: '#111', color: '#ddd', border: '1px solid #333' }}
          />
          <button onClick={handleScan} style={{ marginTop: 8 }}>Scan for PII</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <button onClick={downloadReport}>Download Privacy Report (JSON)</button>
{score !== null && (
  <div
    style={{
      marginTop: '12px',
      padding: '10px 15px',
      backgroundColor: '#1e1e1e',
      border: '1px solid #444',
      borderRadius: '8px',
      color: '#fff',
      display: 'inline-block',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
    }}
  >
    Privacy Score:{" "}
    <span
      style={{
        color:
          score.score >= 80
            ? "#4caf50" // green for safe
            : score.score >= 50
            ? "#ffb300" // yellow for medium
            : "#f44336", // red for unsafe
      }}
    >
      {score.score} / 100
    </span>
  </div>
)}
{dets.length > 0 && (
  <div
    style={{
      marginTop: '16px',
      backgroundColor: '#1e1e1e',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #444',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      maxHeight: '220px',
      overflowY: 'auto',
    }}
  >
    <h3 style={{ margin: 0, marginBottom: '8px', fontSize: '14px', color: '#fff' }}>
      Detections Timeline
    </h3>

    {dets.map((d, i) => (
      <div
        key={i}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 0',
          borderBottom: '1px solid #333',
          fontSize: '13px',
        }}
      >
        <span style={{ color: '#ffb300', minWidth: '80px' }}>
          {d.type.toUpperCase()}
        </span>
        <span style={{ color: '#ccc' }}>{d.text || '—'}</span>
        <span style={{ color: '#aaa', minWidth: '60px', textAlign: 'right' }}>
          {d.startSec ? `${d.startSec.toFixed(1)}s` : '—'}
        </span>
        <span style={{ color: '#4caf50', minWidth: '60px', textAlign: 'right' }}>
          {policy[d.type] === 'blur' ? 'Blurred' : 'Visible'}
        </span>
      </div>
    ))}
  </div>
)}

          <button
            className="tiktok-cta"
            style={{ marginTop: 12 }}
            onClick={() => window.open('https://www.tiktok.com/upload', '_blank')}
          >
            <span className="tt-icon">🎥</span>
            Post to TikTok
          </button>
        </div>
      </div> {/* <-- close the div opened at line 62 */}

      {/* RIGHT COLUMN */}
      <div>
        <VideoPlayer file={file} detections={dets} policy={policy} />
        
        <p style={{ opacity: 0.8 }}>Preview (left = original, right = sanitized with overlays)</p>
      </div>
    </section>
  </div>
);
}
