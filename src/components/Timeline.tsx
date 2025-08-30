import type { Detection } from '../types';

export default function Timeline({ dets, now }:{ dets: Detection[]; now:number }) {
  return (
    <div style={{ maxHeight: 220, overflow: 'auto', border:'1px solid #444', padding:8 }}>
      {dets.sort((a,b)=>a.startSec-b.startSec).map(d=>(
        <div key={d.id} style={{
          padding:'6px 8px',
          background: now>=d.startSec && now<=d.endSec ? '#222' : 'transparent',
          borderBottom:'1px solid #333'
        }}>
          <strong>{d.type.toUpperCase()}</strong> @ {d.startSec.toFixed(1)}s
          {d.text ? <span style={{ opacity:0.8 }}> — “{d.text}”</span> : null}
        </div>
      ))}
    </div>
  );
}
