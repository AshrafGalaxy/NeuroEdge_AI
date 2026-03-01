MISSION BRIEF: Edge-AI Neurodivergence Web Assistant
Event: AMD Slingshot Hackathon
Timeframe: 10-Hour Sprint
Core Mandate: ZERO cloud API calls. 100% of data processing and AI inference MUST run locally to prove AMD edge-compute dominance and guarantee absolute data privacy.

1. THE TECH STACK
Frontend (Chrome Extension):

Framework: React via Plasmo (create-plasmo).

Styling: Tailwind CSS.

UI Components: Shadcn UI (specifically Toggle/Switch, Card, Button).

State/Storage: @plasmohq/storage (IndexedDB) for saving user cognitive profiles.

Backend (Local Edge API):

Framework: Python with FastAPI.

Server: Uvicorn running on <http://localhost:8000>.

CORS: Must be configured to accept requests from the Chrome Extension.

AI Engine:

Host: Ollama running locally on <http://localhost:11434>.

Model: Lightweight local LLM (e.g., qwen:0.5b or phi3:mini).

1. ARCHITECTURE & DATA FLOW
The UI (popup.tsx): Renders the Shadcn toggle switches for "ADHD Hyper-Focus", "Dyslexia Font", and "Simplify Text". Saves states to Plasmo storage.

The Listener (content.ts): Injected into every webpage. Listens for changes in Plasmo storage. When a toggle flips, it executes DOM manipulation instantly.

The Data Bridge (background.ts): Handles the secure fetch requests. When the user highlights text and requests simplification, it POSTs the string to the local FastAPI backend.

The Inference (main.py): FastAPI receives the text, constructs a strict 5th-grade reading level prompt, routes it to Ollama, and returns the simplified string back to the extension to replace the DOM text.

1. FEATURE SPECIFICATIONS (STRICT EXECUTION LOGIC)
Feature A: ADHD Bionic Reading Scripter
Target File: content.ts

Logic: Read document.body.innerText. Split words by spaces. Wrap the first 50% of the characters of every word in a <b> or <strong> HTML tag. Reconstruct and replace the text.

Goal: Anchor the reader's eyes and break reading paralysis instantly via pure JavaScript.

Feature B: Dyslexia Font Injector
Target File: content.ts

Logic: Dynamically inject a <style> tag into the document.head.

CSS Payload: * { font-family: 'OpenDyslexic', sans-serif !important; letter-spacing: 1.5px !important; line-height: 1.8 !important; }

Goal: Physically weight the bottom of text characters to prevent word-swapping.

Feature C: DOM Clutter Wiper
Target File: content.ts

Logic: Recursive DOM traversal. Find and apply display: none !important to <aside>, <iframe>, <nav>, and floating <div> elements heavily laden with classes containing "ad", "popup", or "banner".

Goal: Eliminate visual overstimulation, leaving only the core <article> or <main> content.

Feature D: Edge AI Simplifier (The AMD Flex)
Target Files: background.ts & main.py

Python Logic: Expose a POST endpoint /simplify. Take incoming text, append: "Rewrite the following text to a 5th-grade reading level. Keep it concise. Output ONLY the rewritten text without conversational filler: [TEXT]". Send to localhost:11434/api/generate.

JS Logic: Replace the user's currently highlighted text (window.getSelection()) on the webpage with the FastAPI response.

1. AGENT EXECUTION PHASES
Phase 1: Scaffold the Plasmo + Tailwind frontend and the Python FastAPI backend.

Phase 2: Implement the UI (popup.tsx) and pure JS DOM manipulation (content.ts).

Phase 3: Write the FastAPI server (main.py) and wire up the Ollama endpoint.

Phase 4: Connect the frontend fetch requests to the local backend and handle error states (e.g., if Ollama is not running).

FAILURE CONDITIONS TO AVOID:

Do not use fetch('<https://api.openai.com>...').

Do not write complex Webpack configs; rely on Plasmo's default bundler.

Do not build a standalone web app; this MUST compile to a Chrome Extension (manifest.json V3).
