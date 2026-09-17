"use client";

import { CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react";
import type { ValidationResult } from "@/lib/engine";

export function Checklist({ result }: { result: ValidationResult }) {
  const color =
    result.score === 100 ? "text-emerald-400" : result.score >= 60 ? "text-amber-400" : "text-red-400";
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          Validador Anti-Erro
        </span>
        <span className={`text-sm font-bold ${color}`} data-testid="checklist-score">
          {result.score}%
        </span>
      </div>
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${
            result.score === 100 ? "bg-emerald-500" : result.score >= 60 ? "bg-amber-500" : "bg-red-500"
          }`}
          style={{ width: `${result.score}%` }}
        />
      </div>
      <ul className="space-y-1.5">
        {result.items.map((item) => (
          <li key={item.id} className="flex items-start gap-2 text-sm">
            {item.passed ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            )}
            <span className={item.passed ? "text-slate-300" : "text-slate-200"}>
              {item.label}
              {!item.passed && <span className="block text-xs text-slate-500">{item.hint}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
