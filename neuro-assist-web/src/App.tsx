import React from 'react';
import { Brain, Volume2, Focus, Shield, Download, Server } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30">

      {/* Navigation */}
      <nav className="border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Neuro-Assist</span>
          </div>
          <a href="#setup" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Setup Guide
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            <span>100% Local Inference & Privacy</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            The web, dynamically reformatted for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">Neurodivergence.</span>
          </h1>

          <p className="text-xl text-zinc-400 mb-12 leading-relaxed max-w-2xl">
            A privacy-first Chrome Extension that instantly mitigates ADHD cognitive overload and Dyslexic reading strain, powered entirely by your local AMD Edge AI hardware.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-all">
              <Download className="w-5 h-5" />
              Download Extension
            </button>
            <a href="#setup" className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-zinc-700">
              Read Setup Guide
            </a>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="border-t border-zinc-800/80 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold mb-16 text-center">Enterprise-Grade UX Upgrades</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-xl mb-6">
                <Focus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">ADHD Reading Ruler</h3>
              <p className="text-zinc-400 leading-relaxed">
                Combines Bionic text anchoring with an interactive spotlight that dims surrounding paragraphs, effortlessly guiding your focus without visual overwhelm.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-xl mb-6">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Edge AI Simplification</h3>
              <p className="text-zinc-400 leading-relaxed">
                Highlight complex jargon to invoke the local LLM. It rewrites paragraphs instantly on-device, replacing the text in the DOM with a simplified version.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="w-12 h-12 bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center rounded-xl mb-6">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Interactive TTS Audio</h3>
              <p className="text-zinc-400 leading-relaxed">
                A native Text-to-Speech integration featuring seamless media controls and precise word-highlighting so you can track the audio visually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Guide */}
      <section id="setup" className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Installation & Setup Guide</h2>
          <div className="space-y-6">

            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Load the Unpacked Extension</h4>
                  <p className="text-zinc-400 mb-4">Go to <code className="bg-zinc-800 px-2 py-1 rounded text-emerald-400">chrome://extensions</code> in your browser. Enable <strong>Developer Mode</strong> in the top right, click <strong>Load unpacked</strong>, and select the <code className="bg-zinc-800 px-2 py-1 rounded text-emerald-400">edge-assistant/build/chrome-mv3-dev</code> folder.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Boot the AI Engine (Ollama)</h4>
                  <p className="text-zinc-400 mb-4">Ensure your local LLM is listening on port 11434. Open your terminal and run:</p>
                  <pre className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 overflow-x-auto">
                    <code className="text-zinc-300">ollama run phi3:mini</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Start the FastAPI Bridge</h4>
                  <p className="text-zinc-400 mb-4">The extension needs the Python server to handle CORS and prompt generation. Run the backend:</p>
                  <pre className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 overflow-x-auto">
                    <code className="text-zinc-300">cd edge-backend<br />venv\\Scripts\\activate<br />python main.py</code>
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-zinc-500 text-sm">
        <p>Built for the Hackathon  •  Privacy First  •  100% Local</p>
      </footer>

    </div>
  );
}

export default App;
