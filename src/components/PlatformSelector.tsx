"use client";

import { Bot, Cpu, Gem, Sparkles, Squircle, Brain } from "lucide-react";
import type { ReactNode } from "react";
import { PLATFORM_LIST, type Platform } from "@/lib/engine";

const ICONS: Record<Platform, ReactNode> = {
  chatgpt: <Sparkles className="h-5 w-5" />,
  claude: <Squircle className="h-5 w-5" />,
  gemini: <Gem className="h-5 w-5" />,
  copilot: <Cpu className="h-5 w-5" />,
  deepseek: <Brain className="h-5 w-5" />,
  agent: <Bot className="h-5 w-5" />,
};

export function PlatformSelector({
  value,
  onChange,
}: {
  value: Platform;
  onChange: (p: Platform) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Plataforma / IA alvo">
      {PLATFORM_LIST.map((p) => {
        const active = p.id === value;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(p.id)}
            className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition ${
              active
                ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.4)]"
                : "border-slate-800 bg-slate-900/60 hover:border-slate-600"
            }`}
          >
            <span className={`flex items-center gap-2 text-sm font-semibold ${active ? "text-cyan-300" : "text-slate-200"}`}>
              {ICONS[p.id]}
              {p.name}
            </span>
            <span className="text-xs text-slate-400">{p.vendor}</span>
          </button>
        );
      })}
    </div>
  );
}
