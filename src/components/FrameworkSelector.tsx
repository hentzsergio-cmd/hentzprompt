"use client";

import { FRAMEWORK_LIST, type Framework } from "@/lib/engine";

const COLORS: Record<Framework, string> = {
  epico: "from-blue-500 to-cyan-500",
  profissional: "from-purple-500 to-fuchsia-500",
  persona: "from-emerald-500 to-teal-500",
};

export function FrameworkSelector({
  value,
  onChange,
}: {
  value: Framework;
  onChange: (f: Framework) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Complexidade / Nível do prompt">
      {FRAMEWORK_LIST.map((f) => {
        const active = f.id === value;
        return (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(f.id)}
            className={`rounded-xl border p-4 text-left transition ${
              active
                ? "border-cyan-400 bg-cyan-500/10"
                : "border-slate-800 bg-slate-900/60 hover:border-slate-600"
            }`}
          >
            <span
              className={`inline-block rounded-md bg-gradient-to-r px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white ${COLORS[f.id]}`}
            >
              {f.tagline}
            </span>
            <h3 className="mt-2 text-sm font-bold text-white">{f.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{f.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {f.sections.map((s, i) => (
                <span
                  key={`${s.letter}-${i}`}
                  title={`${s.title}: ${s.description}`}
                  className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-[11px] font-bold text-cyan-300"
                >
                  {s.letter}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
