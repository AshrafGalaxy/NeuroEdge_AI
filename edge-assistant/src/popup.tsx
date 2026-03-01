import { useStorage } from "@plasmohq/storage/hook"
import * as Switch from "@radix-ui/react-switch"
import { Brain, Type, BookOpen, Cpu, Globe, Lock } from "lucide-react"

import "./style.css"

export default function IndexPopup() {
  const [adhdMode, setAdhdMode] = useStorage("adhdMode", false)
  const [dyslexiaMode, setDyslexiaMode] = useStorage("dyslexiaMode", false)
  const [readabilityMode, setReadabilityMode] = useStorage("readabilityMode", false)
  const [dyslexiaFont, setDyslexiaFont] = useStorage("dyslexiaFont", "OpenDyslexic")
  const [dyslexiaWeight, setDyslexiaWeight] = useStorage("dyslexiaWeight", 400)
  const [history] = useStorage<any[]>("simplificationHistory", [])
  const [globalScope, setGlobalScope] = useStorage("globalScope", true)

  return (
    <div className="w-[340px] p-6 bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-50 font-sans shadow-2xl border border-zinc-800 rounded-xl relative overflow-hidden">

      <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-zinc-800/80">
        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shadow-inner border border-emerald-500/20">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">Neuro-Assist</h1>
          <p className="text-[11px] text-zinc-400 font-medium tracking-wide">EDGE-AI COGNITIVE SHIELD</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Phase 9: Scope Selector */}
        <div className="p-3 mb-2 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Application Scope</span>
          </div>
          <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/80">
            <button
              onClick={() => setGlobalScope(true)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all duration-200 ${globalScope ? 'bg-indigo-500 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
            >
              <Globe className="w-3 h-3" /> Global
            </button>
            <button
              onClick={() => setGlobalScope(false)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all duration-200 ${!globalScope ? 'bg-amber-500 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
            >
              <Lock className="w-3 h-3" /> Local
            </button>
          </div>
          <p className="text-[9px] text-zinc-500 mt-2 leading-relaxed px-1">
            {globalScope ? "Active modes auto-apply to all new tabs and websites." : "Active modes only apply when manually toggled on this exact page."}
          </p>
        </div>

        <div className="space-y-2">
          <ToggleRow
            icon={<Type className="w-5 h-5 text-indigo-400" />}
            title="Dyslexic Typography"
            description="Custom font & spacing"
            state={dyslexiaMode}
            setState={setDyslexiaMode}
            activeColor="focus:ring-indigo-500 data-[state=checked]:bg-indigo-500"
          />
          {dyslexiaMode && (
            <div className="pl-12 pr-4 py-2 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Font</span>
                <select
                  value={dyslexiaFont}
                  onChange={(e) => setDyslexiaFont(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-xs rounded px-2 py-1 outline-none focus:border-indigo-500"
                >
                  <option value="Lexend">Lexend</option>
                  <option value="OpenDyslexic">OpenDyslexic</option>
                  <option value="Arial">Arial</option>
                  <option value="Comic Sans MS">Comic Sans</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Weight</span>
                  <span>{dyslexiaWeight}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="900"
                  step="100"
                  value={dyslexiaWeight}
                  onChange={(e) => setDyslexiaWeight(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        <ToggleRow
          icon={<Brain className="w-5 h-5 text-fuchsia-400" />}
          title="ADHD Hyper-Focus"
          description="Bionic text weight anchoring"
          state={adhdMode}
          setState={setAdhdMode}
          activeColor="focus:ring-fuchsia-500 data-[state=checked]:bg-fuchsia-500"
        />

        <ToggleRow
          icon={<BookOpen className="w-5 h-5 text-amber-400" />}
          title="Clean Reader View"
          description="Distraction-free modal overlay"
          state={readabilityMode}
          setState={setReadabilityMode}
          activeColor="focus:ring-amber-500 data-[state=checked]:bg-amber-500"
        />
      </div>

      {/* Phase 2: Simplification History */}
      {history && history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2.5">Recent Simplifications</h3>
          <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 pb-1 pt-1 custom-scrollbar">
            {history.map((item, idx) => {
              let hostname = item.url;
              try { hostname = new URL(item.url).hostname } catch (e) { }
              return (
                <div key={idx} className="bg-zinc-800/40 border border-zinc-700/50 p-3 rounded-[12px] text-left shadow-sm hover:border-zinc-600 transition-colors duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-zinc-400 font-semibold truncate bg-zinc-900/50 px-1.5 py-0.5 rounded border border-zinc-800" title={item.url}>{hostname}</span>
                    <span className="text-[9px] text-zinc-500 font-medium">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[12px] text-zinc-300 line-clamp-2 italic opacity-95 mb-2.5 border-l-2 border-zinc-600/50 pl-2.5 leading-relaxed font-medium">"{item.original}"</p>
                  <div className="text-[11.5px] text-emerald-300 font-semibold bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/10 shadow-inner leading-relaxed">
                    ✨ {item.simplified}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex justify-between items-center group cursor-default">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium transition-colors group-hover:text-zinc-300">
          <Cpu className="w-4 h-4 text-emerald-500" />
          <span className="tracking-wide">AMD ENGINE</span>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ACTIVE
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ icon, title, description, state, setState, activeColor }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 transition-all duration-300 hover:bg-zinc-700 hover:border-zinc-600 hover:shadow-lg group">
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 bg-zinc-900 border border-zinc-700/80 rounded-[10px] shadow-sm group-hover:scale-105 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h2 className="text-[13px] font-bold text-zinc-100 tracking-wide">{title}</h2>
          <p className="text-[11px] text-zinc-400/90 mt-0.5 font-medium">{description}</p>
        </div>
      </div>

      <Switch.Root
        className={`w-[44px] h-[26px] bg-zinc-700 rounded-full relative outline-none cursor-pointer focus:ring-2 transition-colors duration-200 shadow-inner ${activeColor}`}
        checked={state}
        onCheckedChange={setState}
      >
        <Switch.Thumb className="block w-[22px] h-[22px] bg-white rounded-full transition-transform duration-200 translate-x-[2px] will-change-transform data-[state=checked]:translate-x-[20px] shadow-sm" />
      </Switch.Root>
    </div>
  )
}
