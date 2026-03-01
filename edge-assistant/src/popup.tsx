import { useStorage } from "@plasmohq/storage/hook"
import * as Switch from "@radix-ui/react-switch"
import { Brain, Type, BookOpen, Cpu } from "lucide-react"

import "./style.css"

export default function IndexPopup() {
  const [adhdMode, setAdhdMode] = useStorage("adhdMode", false)
  const [dyslexiaMode, setDyslexiaMode] = useStorage("dyslexiaMode", false)
  const [readabilityMode, setReadabilityMode] = useStorage("readabilityMode", false)
  const [dyslexiaFont, setDyslexiaFont] = useStorage("dyslexiaFont", "Lexend")
  const [dyslexiaWeight, setDyslexiaWeight] = useStorage("dyslexiaWeight", 400)
  const [history] = useStorage<any[]>("simplificationHistory", [])

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
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2">Recent Simplifications</h3>
          <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 pb-1">
            {history.map((item, idx) => {
              let hostname = item.url;
              try { hostname = new URL(item.url).hostname } catch (e) { }
              return (
                <div key={idx} className="bg-zinc-800/40 border border-zinc-700/50 p-2.5 rounded-lg text-left shadow-sm">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] text-zinc-500 font-medium truncate" title={item.url}>{hostname}</span>
                    <span className="text-[9px] text-zinc-600">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 line-clamp-2 italic opacity-90 mb-2 border-l-2 border-zinc-600 pl-2 leading-relaxed">"{item.original}"</p>
                  <div className="text-[11px] text-emerald-300 font-medium bg-emerald-500/10 p-2 rounded shadow-inner leading-relaxed">
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
    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800 border border-zinc-700 transition-all duration-200 hover:bg-zinc-700/80">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-sm">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">{description}</p>
        </div>
      </div>

      <Switch.Root
        className={`w-[42px] h-[24px] bg-zinc-700 rounded-full relative outline-none cursor-pointer focus:ring-2 transition-colors duration-200 shadow-inner ${activeColor}`}
        checked={state}
        onCheckedChange={setState}
      >
        <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px] shadow-sm" />
      </Switch.Root>
    </div>
  )
}
