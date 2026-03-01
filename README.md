# Neuro-Assist Edge AI

<div align="center">
  <h3>A zero-telemetry, privacy-first cognitive accessibility shield powered by AMD Edge Computing.</h3>
  <p><i>Submission for the AMD Slingshot Hackathon</i></p>
</div>

---

## 🚀 The Vision

The modern web is built for engagement, but for neurodivergent individuals (those with ADHD, Autism, or Dyslexia), this digital landscape often results in severe clinical cognitive overload.

Traditional accessibility tools attempt to solve this by sending user reading data to cloud APIs, compromising privacy and introducing network latency.

**Neuro-Assist solves this natively.** By deploying local LLM inference engines (`phi3:mini`) and direct GPU-accelerated Document Object Model (DOM) manipulation, we fundamentally restructure typographical physics, visual layouts, and linguistic complexity entirely on the user's local AMD hardware. No cloud. Zero telemetry. Absolute data sovereignty.

---

## ⚡ Core Features

### 1. The Edge-AI Simplifier (Local Inference)

Highlight impenetrable corporate jargon or complex academic paragraphs. Neuro-Assist routes the text securely to an isolated Python FastAPI backend running a local Ollama model. The text is synthesized and seamlessly injected back into the webpage in milliseconds, dramatically reducing reading comprehension friction.

### 2. Clinical Dyslexic Typography

Bypassing strict Chromium Content Security Policies (CSPs), Neuro-Assist physically injects native `OpenDyslexic` font binaries directly into the browser's core memory via the `FontFace` API. Active webpages are autonomously repainted to prioritize characters with heavy baselines, preventing letter flipping and confusion.

### 3. ADHD Hyper-Focus (Bionic Texting)

An algorithmic `TreeWalker` matrix parses web paragraphs instantly, anchoring heavy `font-weight: 900` styling to the exact prefix of every word while reducing trailing suffix opacity. This organically forces the visual cortex to glide across text, retaining extreme focus without breaking the host website's layout configuration.

### 4. Smart Session Memory & Application Scopes

- **Scope Selector System:** Choose **Global Mode** to have active settings autonomously rewrite every new tab you open, or **Local Mode** to carefully apply overrides only to the current active viewport.
- **Cognitive Continuance:** Deep background state listeners track your scroll position and locally synthesized texts. If a tab is accidentally closed, returning to the URL prompts an automatic UI restore, rescuing your custom reading environment.

---

## 🛠️ Architecture & Tech Stack

- **Frontend Core:** Plasmo Chrome Extension Framework (React 18, TypeScript).
- **Aesthetics Layer:** Custom Tailwind CSS (v4) Glassmorphism Dark Theme.
- **Backend Inference:** Python 3 FastAPI + Localized Ollama distribution via AMD Edge Hardware.
- **Memory Management:** `@plasmohq/storage` cross-tab synchronized listeners.

---

## ⚙️ Installation & Setup (Local Development)

### 1. Python AI Backend

Ensure you have Python 3 and Ollama installed locally.

```bash
# Navigate to backend directory
cd edge-backend

# Activate a virtual environment
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows

# Install the dependencies
pip install fastapi uvicorn requests

# Ensure Ollama is running your target model locally
ollama pull phi3:mini

# Start the secure local Edge API
python main.py
```

### 2. Plasmo Chrome Extension

Ensure you have Node.js installed.

```bash
# Navigate to the extension core
cd edge-assistant

# Install project dependencies
npm install

# Build the compiled production bundle
npm run build
```

### 3. Load into Chromium

1. Open Chrome/Edge and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked** and select the strictly compiled `edge-assistant/build/chrome-mv3-prod` folder.

---

## 🔒 Privacy Guarantee

`Neuro-Assist` requires strict `<all_urls>` permission to restructure webpages. However, no DOM data is ever transmitted outside of your isolated execution environment. All network requests are violently firewalled to `localhost:8000`.

*Built for the AMD Slingshot Hackathon.*
