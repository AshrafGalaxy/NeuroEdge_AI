import { useStorage } from "@plasmohq/storage/hook"
import * as Switch from "@radix-ui/react-switch"
import { Brain, Type, BookOpen, Cpu } from "lucide-react"

import "./style.css"

export default function IndexPopup() {
  const [adhdMode, setAdhdMode] = useStorage("adhdMode", false)
  const [dyslexiaMode, setDyslexiaMode] = useStorage("dyslexiaMode", false)
  const [readabilityMode, setReadabilityMode] = useStorage("readabilityMode", false)

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
        <ToggleRow
          icon={<Type className="w-5 h-5 text-indigo-400" />}
          title="Dyslexic Typography"
          description="Lexend font + low glare bg"
          state={dyslexiaMode}
          setState={setDyslexiaMode}
          activeColor="focus:ring-indigo-500 data-[state=checked]:bg-indigo-500"
        />

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

      <div className="mt-8 pt-4 border-t border-zinc-800/80 flex justify-between items-center group cursor-default">
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
