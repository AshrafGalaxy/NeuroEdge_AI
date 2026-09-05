<div align="center">
# 🧠 NeuroEdge AI (Neuro-Assist)
### *A zero-telemetry, privacy-first cognitive accessibility shield powered by local Edge AI.*
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Plasmo](https://img.shields.io/badge/Plasmo-Framework-6B46C1.svg)](https://docs.plasmo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![Ollama](https://img.shields.io/badge/Ollama-phi3:mini-white.svg)](https://ollama.com/)
[![Privacy: Zero Telemetry](https://img.shields.io/badge/Privacy-100%25%20Zero--Telemetry-brightgreen.svg)](#-privacy-guarantee)
<p align="center">
  <a href="#-the-vision">Vision</a> •
  <a href="#-core-features">Core Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-privacy-guarantee">Privacy Model</a>
</p>
</div>
---
## 🚀 The Vision
The modern web is built for engagement and stimulation, but for neurodivergent individuals—especially those with ADHD, Autism, or Dyslexia—this digital environment frequently triggers severe cognitive overload, visual fatigue, and comprehension barriers.
Traditional accessibility extensions attempt to address this by transmitting reading data to third-party cloud APIs. This introduces latency, breaks offline functionality, and fundamentally compromises user privacy.
**NeuroEdge AI solves this natively at the edge.** By combining local LLM inference engines (`phi3:mini` via Ollama) with GPU-accelerated Document Object Model (DOM) transformations, the extension restructures typographical physics, visual layouts, and linguistic complexity entirely on the user's local machine.
- **Zero Cloud Dependencies:** All processing occurs locally on your hardware.
- **Zero Telemetry:** Reading history and highlighted content never leave `localhost`.
- **True Accessibility:** Real-time visual and linguistic transformation tailored to cognitive needs.
---
## ⚡ Core Features
### 1. 🧠 Edge-AI Simplifier (Local Inference)
- Highlight dense corporate jargon, convoluted legalese, or complex academic literature.
- Content is routed locally to an isolated Python FastAPI backend running a quantized local model (`phi3:mini`).
- Synthesizes the text into clean, digestible language and performs seamless inline replacement in milliseconds without reloading the page.
### 2. 📖 Clinical OpenDyslexic Typography
- Bypasses strict Chromium Content Security Policies (CSPs) by dynamically injecting native `OpenDyslexic` font binaries into the browser runtime via the `FontFace` API.
- Restyles active web typography with bottom-weighted characters to anchor visual saccades and prevent letter inversions or word flipping.****
