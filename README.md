GhostLens: AI-Powered Video Privacy Redaction Tool

GhostLens helps creators share videos safely by detecting and redacting sensitive information in real time. It identifies personally identifiable information (PII) such as faces, emails, phone numbers, addresses, IDs, and even spoken details using speech-to-text. With one-click privacy presets, live overlays, and exportable sanitized videos, GhostLens makes video privacy protection simple, fast, and accessible.

Demo & Links
Demo video: (https://www.youtube.com/watch?v=4OYCn7GOfvA)
Devpost submission: https://devpost.com/software/ghostlens)
Repository: https://github.com/paulinepeh/ghostlens-demo

TikTok Hackathon Track: 7. Privacy Meets AI: Building a Safer Digital Future

Features
Real-time detection of faces, on-screen PII, and spoken PII via optional speech-to-text.
One-click privacy presets: blur, bleep, or mask sensitive content instantly.
Detection timeline showing exactly when private information appears.
Export sanitized videos optimized for TikTok uploads.

Downloadable privacy report with timestamped audit logs for transparency.
Architecture Diagram
flowchart LR
    A[User Uploads Video] --> B[Frontend - React + Vite + TS]
    B -->|Sends frames| C[Backend - FastAPI]
    C -->|Runs detectors| D[Face Detection + PII Models + Whisper STT]
    D -->|Timestamped detections| B
    B -->|Applies blur/mask/bleep| E[Sanitized Video]
    E --> F[Download Privacy Report]

This diagram shows how GhostLens processes video frames, detects PII, applies privacy presets, and outputs sanitized videos.

Tech Stack
Frontend: React, Vite, TypeScript, Tailwind CSS, HTML5 Video, Canvas, Web Workers
Backend: Python, FastAPI, Uvicorn
AI & Detection: Face/person detection, PII detectors using regex and NLP, optional Whisper for speech-to-text
Data Handling: JSON APIs; CSV/JSON for downloadable privacy reports
Version Control: Git + GitHub

Tools, Libraries & APIs
Tools:
Vite (bundler)
Node.js (package management)
FastAPI (backend API framework)

Libraries:
Frontend: React, Tailwind CSS, Web Workers, Canvas
Backend: FastAPI, Uvicorn, Pydantic
AI/Detection: face-api.js / custom PII detectors / Whisper

APIs:
Custom REST API for detection and privacy reports
Whisper speech-to-text integration (optional)

Quick Start (Local Setup)
1. Clone the repository
git clone https://github.com/paulinepeh/ghostlens-demo.git
cd ghostlens-demo

2. Install and run the frontend
npm install
npm run dev

App runs at: http://localhost:5173

3. Set up and run the backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload

Backend runs at: http://127.0.0.1:8000

How It Works
User uploads a video via the frontend.
Frames are sent to the backend for analysis.
AI detects faces, on-screen text, and spoken PII using Whisper.
Detections are returned with timestamps for overlays and presets.
Users apply privacy settings and export sanitized videos with reports.

Project Structure
ghostlens-demo/
├── public/
│   ├── models/                 # Pre-trained models
│   └── vite.svg
├── src/                        # React + TypeScript source
├── index.html                  # Entry point
├── vite.config.ts              # Vite config
├── package.json                # Frontend deps
├── README.md                   # Documentation
└── ...other config files

Limitations (Hackathon Build)
Runs locally; not yet cloud-deployed.
Detection accuracy may vary depending on video quality and lighting.
Whisper STT is optional and may be disabled on low-spec systems.

What's Next
Add support for more formats (images, PDFs).
Build a browser extension for instant redaction.
Enable customizable privacy policies for flexible protection.

Acknowledgements

Open-source libraries and models used for face detection, PII recognition, and speech-to-text.
Thanks to TikTok TechJam organizers for their guidance, and for creating a platform that inspired GhostLens.
